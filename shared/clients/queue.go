package clients

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

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
	return asynq.NewTask(
		TypeSyncPodcast,
		payload,
		asynq.MaxRetry(0),
		asynq.TaskID(podcastId.String()),
	), nil
}

func EnqueueSyncPodcastTask(podcastID uuid.UUID) error {
	task, err := NewSyncPodcastTask(podcastID)
	if err != nil {
		return fmt.Errorf("failed to create sync task: %w", err)
	}

	info, err := Queue.Enqueue(task)
	if err != nil {
		if errors.Is(err, asynq.ErrTaskIDConflict) {
			log.Printf("Task for podcast %v is already queued or processing", podcastID)
			return nil
		}
		return fmt.Errorf("failed to enqueue sync task: %w", err)
	}

	log.Printf("Successfully enqueued sync task %v for podcast %v", info.ID, podcastID)
	return nil
}
