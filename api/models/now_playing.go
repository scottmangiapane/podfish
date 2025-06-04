package models

import "github.com/google/uuid"

type NowPlaying struct {
	PositionUserID    uuid.UUID `json:"-" gorm:"primaryKey;type:uuid"`
	PositionEpisodeID uuid.UUID `json:"-"`
	Position          Position  `json:"-"`
}
