package models

import "github.com/google/uuid"

type NowPlaying struct {
	UserID    uuid.UUID `json:"user_id" gorm:"primaryKey"`
	User      User
	EpisodeID uuid.UUID `json:"episode_id" gorm:"primaryKey"`
	Episode   Episode
}
