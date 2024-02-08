package models

import (
	"podfish/models/templates"

	"github.com/google/uuid"
)

type Podcast struct {
	PodcastID   uuid.UUID `json:"podcast_id" gorm:"primarykey;type:uuid;default:gen_random_uuid()"`
	RSS         string    `json:"rss" gorm:"unique"`
	ImageID     uuid.UUID `json:"image_id" gorm:"type:uuid;default:gen_random_uuid()"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	templates.Timestamps
}
