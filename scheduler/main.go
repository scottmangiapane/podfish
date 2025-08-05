package main

import (
	"encoding/json"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/hibiken/asynq"
	"github.com/scottmangiapane/podfish/shared"
	"github.com/scottmangiapane/podfish/shared/models"
)

type SyncTaskPayload struct {
	PodcastID uuid.UUID
}

func main() {
	log.Println("Starting scheduler...")
	shared.SetupDatabase()
	shared.SetupQueue()
	defer shared.TeardownQueue()

	intervalMinutes, err := strconv.Atoi(os.Getenv("FEED_POLL_INTERVAL"))
	if err != nil {
		panic("invalid FEED_POLL_INTERVAL")
	}
	pollInterval := time.Duration(intervalMinutes) * time.Minute
	log.Printf("Running with a %v polling interval", pollInterval)

	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	run(pollInterval)
	for range ticker.C {
		run(pollInterval)
	}
}

func run(pollInterval time.Duration) {
	cutoff := time.Now().Add(-pollInterval)

	var podcasts []models.Podcast
	result := shared.DB.
		Where("podcasts.last_polled_at < ?", cutoff).
		Find(&podcasts)
	if result.Error != nil {
		log.Printf("Error getting podcasts from DB: %v", result.Error)
		return
	}

	for _, podcast := range podcasts {
		payload, err := json.Marshal(SyncTaskPayload{PodcastID: podcast.PodcastID})
		if err != nil {
			log.Printf("Error creating sync task: %v", err)
			continue
		}
		task := asynq.NewTask("podcast:sync", payload)

		info, err := shared.Queue.Enqueue(task)
		if err != nil {
			log.Printf("Error enqueueing sync task: %v", err)
			continue
		}
		log.Printf("Successfully enqueued sync task %v for podcast %v", info.ID, podcast.PodcastID)
	}
}
