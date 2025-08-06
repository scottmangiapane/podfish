package models

import (
	"time"

	"github.com/google/uuid"
	"github.com/scottmangiapane/podfish/shared/models/templates"
)

type Podcast struct {
	PodcastID         uuid.UUID `json:"podcast_id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	RSS               string    `json:"rss" gorm:"unique"`
	ImageID           uuid.UUID `json:"image_id" gorm:"type:uuid;default:gen_random_uuid()"`
	Title             string    `json:"title"`
	Description       string    `json:"description"`
	Color             string    `json:"color"`
	LastSyncAt        time.Time `json:"last_sync_at" gorm:"not null;default:'0001-01-01 00:00:00'"`
	LastSyncAttemptAt time.Time `json:"last_sync_attempt_at" gorm:"not null;default:'0001-01-01 00:00:00'"`
	templates.Timestamps
}
