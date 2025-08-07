package clients

import (
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"github.com/hibiken/asynq"
	"github.com/scottmangiapane/podfish/shared/utils"
)

const (
	TypeSyncPodcast = "podcast:sync"
)

type SyncPodcastTaskPayload struct {
	PodcastID uuid.UUID
}

var Queue *asynq.Client

func SetUpQueue() {
	Queue = asynq.NewClient(asynq.RedisClientOpt{
		Addr:     fmt.Sprintf("%s:6379", utils.GetEnvString("REDIS_HOST")),
		Password: utils.GetEnvString("REDIS_PASSWORD"),
		DB:       0,
	})
}

func NewSyncPodcastTask(podcastId uuid.UUID) (*asynq.Task, error) {
	payload, err := json.Marshal(SyncPodcastTaskPayload{PodcastID: podcastId})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeSyncPodcast, payload, asynq.MaxRetry(0)), nil
}
