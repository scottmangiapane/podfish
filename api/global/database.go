package global

import (
	"fmt"
	"os"
	"podfish/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
)

func InitDatabase() {
	dsn := fmt.Sprintf("dbname=%s host=%s user=%s password=%s port=5432 sslmode=disable TimeZone=UTC",
		os.Getenv("POSTGRES_DB"),
		os.Getenv("DATABASE_HOST"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"))
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	DB = db

	DB.AutoMigrate(
		&models.Episode{},
		&models.NowPlaying{},
		&models.PlaybackPosition{},
		&models.Subscription{},
		&models.User{},
	)
}
