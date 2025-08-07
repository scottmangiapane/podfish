package main

import (
	"log"
	"time"

	"github.com/scottmangiapane/podfish/shared/clients"
	"github.com/scottmangiapane/podfish/shared/models"
	"github.com/scottmangiapane/podfish/shared/utils"
)

func main() {
	log.Println("Starting scheduler...")
	utils.SetUpHealth()

	clients.SetUpDatabase()
	clients.SetUpQueue()
	defer clients.Queue.Close()

	intervalMinutes := utils.GetEnvInt("FEED_POLL_INTERVAL")
	pollInterval := time.Duration(intervalMinutes) * time.Minute
	log.Printf("Running with a %v polling interval", pollInterval)

	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	poll(pollInterval)
	for range ticker.C {
		poll(pollInterval)
	}
}

func poll(pollInterval time.Duration) {
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
		err := clients.EnqueueSyncPodcastTask(podcast.PodcastID)
		if err != nil {
			log.Printf("Error enqueueing sync task: %v", err)
			continue
		}
	}
}
