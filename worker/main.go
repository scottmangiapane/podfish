package main

import (
	"fmt"
	"log"
	"os"

	"github.com/hibiken/asynq"
	"github.com/scottmangiapane/podfish/shared"
	"github.com/scottmangiapane/podfish/worker/task"
)

func main() {
	log.Println("Starting worker...")
	shared.SetupDatabase()

	server := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr:     fmt.Sprintf("%s:6379", os.Getenv("REDIS_HOST")),
			Password: os.Getenv("REDIS_PASSWORD"),
			DB:       0,
		},
		asynq.Config{
			Concurrency: 0,
		})

	mux := asynq.NewServeMux()
	mux.HandleFunc(task.TypeSyncPodcast, task.HandleSyncPodcastTask)

	if err := server.Run(mux); err != nil {
		log.Fatal(err)
	}
}
