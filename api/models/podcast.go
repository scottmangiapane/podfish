package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Podcast struct {
	gorm.Model
	ID  uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	RSS string    `json:"rss" gorm:"unique"`
}
