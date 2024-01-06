package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Episode struct {
	gorm.Model
	ID        uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	PodcastID uuid.UUID `json:"podcast_id"`
	Podcast   Podcast
}
