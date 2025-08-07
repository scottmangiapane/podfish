package main

import (
	"fmt"
	"log"

	"github.com/hibiken/asynq"
	"github.com/scottmangiapane/podfish/shared/clients"
	"github.com/scottmangiapane/podfish/shared/utils"
	"github.com/scottmangiapane/podfish/worker/task"
)

func main() {
	log.Println("Starting worker...")
	utils.SetUpHealth()

	clients.SetUpDatabase()

	server := asynq.NewServer(
		asynq.RedisClientOpt{
			Addr:     fmt.Sprintf("%s:6379", utils.GetEnvString("REDIS_HOST")),
			Password: utils.GetEnvString("REDIS_PASSWORD"),
			DB:       0,
		},
		asynq.Config{
			Concurrency: 0,
		})

	mux := asynq.NewServeMux()
	mux.HandleFunc(clients.TypeSyncPodcast, task.HandleSyncPodcastTask)

	if err := server.Run(mux); err != nil {
		log.Fatal(err)
	}
}
