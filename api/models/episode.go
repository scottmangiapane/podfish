package models

import (
	"podfish/models/templates"
	"time"

	"github.com/google/uuid"
)

type Episode struct {
	EpisodeID   uuid.UUID `json:"episode_id" gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	PodcastID   uuid.UUID `json:"podcast_id" gorm:"type:uuid;index:idx_podcast_item,unique"`
	Podcast     Podcast   `json:"-"`
	ItemID      string    `json:"guid" gorm:"index:idx_podcast_item,unique"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	Duration    uint      `json:"duration"`
	URL         string    `json:"url"`
	templates.Timestamps
}
