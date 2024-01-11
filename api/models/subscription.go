package models

import (
	"github.com/google/uuid"
)

type Subscription struct {
	UserID    uuid.UUID `json:"user_id" gorm:"primaryKey"`
	User      User      `json:"-"`
	PodcastID uuid.UUID `json:"podcast_id" gorm:"primaryKey"`
	Podcast   Podcast   `json:"-"`
}
