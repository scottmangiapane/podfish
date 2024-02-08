package models

import (
	"podfish/models/templates"
	"time"

	"github.com/google/uuid"
)

type Episode struct {
	EpisodeID   uuid.UUID `json:"episode_id" gorm:"primarykey;type:uuid;default:gen_random_uuid()"`
	PodcastID   uuid.UUID `json:"podcast_id"`
	Podcast     Podcast   `json:"-"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	URL         string    `json:"url" gorm:"unique"`
	templates.Timestamps
}
