package models

import (
	"time"

	"github.com/google/uuid"
)

type Episode struct {
	Base
	PodcastID   uuid.UUID `json:"podcast_id"`
	Podcast     Podcast   `json:"-"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Date        time.Time `json:"date"`
	URL         string    `json:"url" gorm:"unique"`
}
