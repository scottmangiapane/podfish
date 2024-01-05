package models

import (
	"time"
)

type PlaybackPosition struct {
	UserID       uint `json:"user_id" gorm:"primaryKey"`
	User         User
	EpisodeID    uint `json:"episode_id" gorm:"primaryKey"`
	Episode      Episode
	Completed    bool      `json:"completed"`
	Timestamp    time.Time `json:"timestamp"`
	LastListened time.Time `json:"last_listened"`
}
