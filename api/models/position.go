package models

import (
	"time"

	"github.com/google/uuid"
)

type Position struct {
	UserID       uuid.UUID `json:"-" gorm:"primaryKey"`
	User         User      `json:"-"`
	EpisodeID    uuid.UUID `json:"episode_id" gorm:"primaryKey"`
	Episode      Episode   `json:"-"`
	Completed    bool      `json:"completed"`
	CurrentTime  uint      `json:"current_time"`
	LastListened time.Time `json:"last_listened"`
}

type EpisodePosition struct {
	Episode  Episode   `json:"episode" gorm:"embedded"`
	Position *Position `json:"position" gorm:"embedded"`
}

type EpisodePodcastPosition struct {
	Episode  Episode   `json:"episode" gorm:"embedded"`
	Podcast  Podcast   `json:"podcast" gorm:"embedded"`
	Position *Position `json:"position" gorm:"embedded"`
}
