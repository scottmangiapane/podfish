package task

import (
	"context"
	"encoding/json"
	"log"

	"github.com/hibiken/asynq"
	"github.com/scottmangiapane/podfish/shared/clients"
	"github.com/scottmangiapane/podfish/worker/sync"
)

func HandleSyncPodcastTask(ctx context.Context, t *asynq.Task) error {
	var p clients.SyncPodcastTaskPayload
	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return err
	}
	log.Printf("Syncing podcast %v", p.PodcastID)
	return sync.Sync(p.PodcastID)
}
