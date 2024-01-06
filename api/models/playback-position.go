package models

import (
	"time"

	"github.com/google/uuid"
)

type PlaybackPosition struct {
	UserID       uuid.UUID `json:"user_id" gorm:"primaryKey"`
	User         User
	EpisodeID    uuid.UUID `json:"episode_id" gorm:"primaryKey"`
	Episode      Episode
	Completed    bool      `json:"completed"`
	Timestamp    time.Time `json:"timestamp"`
	LastListened time.Time `json:"last_listened"`
}
