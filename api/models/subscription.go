package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Subscription struct {
	gorm.Model
	ID  uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	Rss string    `json:"rss"`
}
