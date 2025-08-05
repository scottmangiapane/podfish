package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/hibiken/asynq"
	"github.com/scottmangiapane/podfish/shared"
	"github.com/scottmangiapane/podfish/shared/tasks"
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

	if err := server.Run(asynq.HandlerFunc(handler)); err != nil {
		log.Fatal(err)
	}
}

func handler(ctx context.Context, t *asynq.Task) error {
	switch t.Type() {
	case "podcast:sync":
		var p tasks.SyncTaskPayload
		if err := json.Unmarshal(t.Payload(), &p); err != nil {
			return err
		}
		log.Printf("Syncing podcast %v", p.PodcastID)
		Sync(p.PodcastID)

	default:
		return fmt.Errorf("unexpected task type: %s", t.Type())
	}
	return nil
}
