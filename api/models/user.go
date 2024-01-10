package models

import (
	"os"
	"strconv"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	Base
	Email    string `json:"email" gorm:"unique"`
	Password string `json:"-"`
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
