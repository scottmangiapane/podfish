package models

import "github.com/google/uuid"

type NowPlaying struct {
	PositionUserID    uuid.UUID `json:"-" gorm:"primaryKey"`
	PositionEpisodeID uuid.UUID `json:"-"`
	Position          Position  `json:"-"`
}
