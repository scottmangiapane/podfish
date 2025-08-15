package clients

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/scottmangiapane/podfish/shared/models"
	"github.com/scottmangiapane/podfish/shared/utils"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB *gorm.DB
)

func SetUpDatabase() {
	dsn := fmt.Sprintf("dbname=%s host=%s user=%s password=%s port=5432 sslmode=disable TimeZone=UTC",
		utils.GetEnvString("POSTGRES_DB"),
		utils.GetEnvString("POSTGRES_HOST"),
		utils.GetEnvString("POSTGRES_USER"),
		utils.GetEnvString("POSTGRES_PASSWORD"))
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: setUpLogger(),
	})
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

func setUpLogger() logger.Interface {
	if utils.GetEnvString("ENVIRONMENT") == "dev" {
		return logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold: 200 * time.Millisecond,
				LogLevel:      logger.Info,
				Colorful:      true,
			},
		)
	}
	return logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold: time.Second,
			LogLevel:      logger.Warn,
			Colorful:      false,
		},
	)
}
