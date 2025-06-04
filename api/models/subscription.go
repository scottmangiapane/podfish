package models

import (
	"github.com/google/uuid"
)

type Subscription struct {
	UserID    uuid.UUID `json:"-" gorm:"primaryKey;type:uuid"`
	User      User      `json:"-"`
	PodcastID uuid.UUID `json:"podcast_id" gorm:"primaryKey;type:uuid"`
	Podcast   Podcast   `json:"-"`
}
