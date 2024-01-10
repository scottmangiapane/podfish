package models

import (
	"github.com/google/uuid"
)

type Episode struct {
	Base
	PodcastID uuid.UUID `json:"podcast_id"`
	Podcast   Podcast
}
