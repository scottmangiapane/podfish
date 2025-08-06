package main

import (
	"fmt"
	"log"
	"time"

	"github.com/hibiken/asynq"
	"github.com/scottmangiapane/podfish/shared/clients"
	"github.com/scottmangiapane/podfish/shared/models"
	"github.com/scottmangiapane/podfish/shared/utils"
	"github.com/scottmangiapane/podfish/worker/task"
)

func main() {
	log.Println("Starting scheduler...")
	clients.SetupDatabase()
	utils.SetupHealth()

	client := asynq.NewClient(asynq.RedisClientOpt{
		Addr:     fmt.Sprintf("%s:6379", utils.GetEnvString("REDIS_HOST")),
		Password: utils.GetEnvString("REDIS_PASSWORD"),
		DB:       0,
	})
	defer client.Close()

	intervalMinutes := utils.GetEnvInt("FEED_POLL_INTERVAL")
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
	result := clients.DB.
		Joins("JOIN subscriptions ON subscriptions.podcast_id = podcasts.podcast_id").
		Where("podcasts.last_sync_attempt_at < ?", cutoff).
		Find(&podcasts)
	if result.Error != nil {
		log.Printf("Error getting podcasts from DB: %v", result.Error)
		return
	}

	log.Printf("Found %v podcasts in need of syncing", len(podcasts))

	for _, podcast := range podcasts {
		task, err := task.NewSyncPodcastTask(podcast.PodcastID)
		if err != nil {
			log.Printf("Error creating sync task: %v", err)
			continue
		}

		info, err := client.Enqueue(task)
		if err != nil {
			log.Printf("Error enqueueing sync task: %v", err)
			continue
		}
		log.Printf("Successfully enqueued sync task %v for podcast %v", info.ID, podcast.PodcastID)
	}
}
