package models

type NowPlaying struct {
	UserID    uint `json:"user_id" gorm:"primaryKey"`
	EpisodeID uint `json:"episode_id"`
}
