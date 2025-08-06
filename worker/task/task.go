package task

import (
	"context"
	"encoding/json"
	"log"

	"github.com/google/uuid"
	"github.com/hibiken/asynq"
	"github.com/scottmangiapane/podfish/worker/sync"
)

const (
	TypeSyncPodcast = "podcast:sync"
)

type SyncPodcastTaskPayload struct {
	PodcastID uuid.UUID
}

func NewSyncPodcastTask(podcastId uuid.UUID) (*asynq.Task, error) {
	payload, err := json.Marshal(SyncPodcastTaskPayload{PodcastID: podcastId})
	if err != nil {
		return nil, err
	}
	return asynq.NewTask(TypeSyncPodcast, payload, asynq.MaxRetry(0)), nil
}

func HandleSyncPodcastTask(ctx context.Context, t *asynq.Task) error {
	var p SyncPodcastTaskPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return err
	}
	log.Printf("Syncing podcast %v", p.PodcastID)
	return sync.Sync(p.PodcastID)
}
