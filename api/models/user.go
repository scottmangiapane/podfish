package models

import (
	"os"
	"podfish/models/templates"
	"strconv"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	UserID   uuid.UUID `json:"user_id" gorm:"primarykey;type:uuid;default:gen_random_uuid()"`
	Email    string    `json:"email" gorm:"unique"`
	Password string    `json:"-"`
	templates.Timestamps
}

func (user *User) BeforeSave(tx *gorm.DB) (err error) {
	cost, err := strconv.Atoi(os.Getenv("BCRYPT_COST"))
	if err != nil {
		return err
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), cost)
	if err != nil {
		return err
	}

	user.Password = string(bytes)
	return nil
}

func (user *User) CheckPassword(providedPassword string) error {
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(providedPassword))
	if err != nil {
		return err
	}
	return nil
}
