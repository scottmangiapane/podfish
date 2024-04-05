package models

import (
	"github.com/google/uuid"
)

type Subscription struct {
	UserID    uuid.UUID `json:"-" gorm:"primaryKey"`
	User      User      `json:"-"`
	PodcastID uuid.UUID `json:"podcast_id" gorm:"primaryKey"`
	Podcast   Podcast   `json:"-"`
}
