package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"github.com/hibiken/asynq"
	"github.com/scottmangiapane/podfish/shared"
	"github.com/scottmangiapane/podfish/shared/models"
	"github.com/scottmangiapane/podfish/shared/tasks"
)

func main() {
	log.Println("Starting scheduler...")
	shared.SetupDatabase()

	client := asynq.NewClient(asynq.RedisClientOpt{
		Addr:     fmt.Sprintf("%s:6379", os.Getenv("REDIS_HOST")),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})
	defer client.Close()

	intervalMinutes, err := strconv.Atoi(os.Getenv("FEED_POLL_INTERVAL"))
	if err != nil {
		panic("invalid FEED_POLL_INTERVAL")
	}
	pollInterval := time.Duration(intervalMinutes) * time.Minute
	log.Printf("Running with a %v polling interval", pollInterval)

	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	run(client, pollInterval)
	for range ticker.C {
		run(client, pollInterval)
	}
}

func run(client *asynq.Client, pollInterval time.Duration) {
	cutoff := time.Now().Add(-pollInterval)

	var podcasts []models.Podcast
	result := shared.DB.
		Where("podcasts.last_polled_at < ?", cutoff).
		Find(&podcasts)
	if result.Error != nil {
		log.Printf("Error getting podcasts from DB: %v", result.Error)
		return
	}

	log.Printf("Found %v podcasts in need of syncing", len(podcasts))

	for _, podcast := range podcasts {
		payload, err := json.Marshal(tasks.SyncTaskPayload{PodcastID: podcast.PodcastID})
		if err != nil {
			log.Printf("Error creating sync task: %v", err)
			continue
		}
		task := asynq.NewTask("podcast:sync", payload)

		info, err := client.Enqueue(task)
		if err != nil {
			log.Printf("Error enqueueing sync task: %v", err)
			continue
		}
		log.Printf("Successfully enqueued sync task %v for podcast %v", info.ID, podcast.PodcastID)
	}
}
