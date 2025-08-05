package shared

import (
	"fmt"
	"os"

	"github.com/hibiken/asynq"
)

var (
	Queue *asynq.Client
)

func SetupQueue() {
	queue := asynq.NewClient(asynq.RedisClientOpt{
		Addr:     fmt.Sprintf("%s:6379", os.Getenv("REDIS_HOST")),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})

	Queue = queue
}

func TeardownQueue() {
	if Queue != nil {
		Queue.Close()
	}
}
