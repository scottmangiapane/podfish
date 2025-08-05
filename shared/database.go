package shared

import (
	"fmt"
	"os"

	"github.com/scottmangiapane/podfish/shared/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
)

func SetupDatabase() {
	dsn := fmt.Sprintf("dbname=%s host=%s user=%s password=%s port=5432 sslmode=disable TimeZone=UTC",
		os.Getenv("POSTGRES_DB"),
		os.Getenv("POSTGRES_HOST"),
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"))
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect to database")
	}

	DB = db

	DB.AutoMigrate(
		&models.Episode{},
		&models.NowPlaying{},
		&models.Podcast{},
		&models.Position{},
		&models.Subscription{},
		&models.User{},
	)
}
