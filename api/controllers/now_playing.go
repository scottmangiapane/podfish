package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/scottmangiapane/podfish/api/middleware"
	"github.com/scottmangiapane/podfish/shared"
	"github.com/scottmangiapane/podfish/shared/models"
	"gorm.io/gorm"
)

// @Tags now-playing
// @Router /now-playing [get]
// @Success 200 {object} models.EpisodePodcastPosition
func GetNowPlaying(c *gin.Context) {
	var nowPlaying models.NowPlaying
	result := shared.DB.
		Preload("Position.Episode.Podcast").
		First(&nowPlaying, &models.NowPlaying{PositionUserID: middleware.GetUser(c)})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNoContent, nil)
		return
	}
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get current episode")
		return
	}

	res := models.EpisodePodcastPosition{
		Episode:  nowPlaying.Position.Episode,
		Podcast:  nowPlaying.Position.Episode.Podcast,
		Position: &nowPlaying.Position,
	}
	c.JSON(http.StatusOK, res)
}

// @Tags now-playing
// @Router /now-playing [put]
// @Param request body controllers.PutNowPlaying.request true "Request body"
// @Success 200 {object} models.EpisodePodcastPosition
func PutNowPlaying(c *gin.Context) {
	type request struct {
		EpisodeID uuid.UUID `json:"episode_id" binding:"required,uuid"`
	}
	var req request
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	result := shared.DB.Save(&models.Position{
		UserID:       middleware.GetUser(c),
		EpisodeID:    req.EpisodeID,
		LastListened: time.Now(),
	})
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to set last listened")
		return
	}

	result = shared.DB.Save(&models.NowPlaying{
		PositionUserID:    middleware.GetUser(c),
		PositionEpisodeID: req.EpisodeID,
	})
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to set current episode")
		return
	}
	var nowPlaying models.NowPlaying
	result = shared.DB.
		Preload("Position.Episode.Podcast").
		First(&nowPlaying, &models.NowPlaying{PositionUserID: middleware.GetUser(c)})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNoContent, nil)
		return
	}
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get current episode")
		return
	}

	res := models.EpisodePodcastPosition{
		Episode:  nowPlaying.Position.Episode,
		Podcast:  nowPlaying.Position.Episode.Podcast,
		Position: &nowPlaying.Position,
	}
	c.JSON(http.StatusOK, res)
}

// @Tags now-playing
// @Router /now-playing [delete]
// @Success 204
func DeleteNowPlaying(c *gin.Context) {
	shared.DB.Delete(models.NowPlaying{PositionUserID: middleware.GetUser(c)})
	c.JSON(http.StatusNoContent, nil)
}
