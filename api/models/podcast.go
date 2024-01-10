package models

type Podcast struct {
	Base
	RSS string `json:"rss" gorm:"unique"`
}
