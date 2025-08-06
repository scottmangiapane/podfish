package clients

import (
	"fmt"

	"github.com/scottmangiapane/podfish/shared/models"
	"github.com/scottmangiapane/podfish/shared/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var (
	DB *gorm.DB
)

func SetupDatabase() {
	dsn := fmt.Sprintf("dbname=%s host=%s user=%s password=%s port=5432 sslmode=disable TimeZone=UTC",
		utils.GetEnvString("POSTGRES_DB"),
		utils.GetEnvString("POSTGRES_HOST"),
		utils.GetEnvString("POSTGRES_USER"),
		utils.GetEnvString("POSTGRES_PASSWORD"))
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
