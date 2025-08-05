package tasks

import "github.com/google/uuid"

type SyncTaskPayload struct {
	PodcastID uuid.UUID
}
