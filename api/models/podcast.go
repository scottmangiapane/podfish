package models

import "github.com/google/uuid"

type Podcast struct {
	Base
	RSS         string    `json:"rss" gorm:"unique"`
	ImageID     uuid.UUID `json:"image_id" gorm:"type:uuid;default:gen_random_uuid()"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
}
