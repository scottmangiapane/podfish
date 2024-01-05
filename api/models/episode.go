package models

import (
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Episode struct {
	gorm.Model
	ID             uuid.UUID `gorm:"type:uuid;default:gen_random_uuid()"`
	SubscriptionID uint      `json:"subscription_id"`
	Subscription   Subscription
}
