package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"podfish/global"
	"podfish/middleware"
	"podfish/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// @Tags now-playing
// @Router /now-playing [get]
// @Success 200 {object} controllers.GetNowPlaying.response
func GetNowPlaying(c *gin.Context) {
	var nowPlaying models.NowPlaying
	result := global.DB.
		Preload("Episode.Podcast").
		First(&nowPlaying, models.NowPlaying{UserID: middleware.GetUser(c)})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNoContent, nil)
		return
	}
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get current episode")
		return
	}

	type response struct {
		Episode models.Episode `json:"episode"`
		Podcast models.Podcast `json:"podcast"`
	}
	r := response{
		Episode: nowPlaying.Episode,
		Podcast: nowPlaying.Episode.Podcast,
	}
	c.JSON(http.StatusOK, r)
}

// @Tags now-playing
// @Router /now-playing [put]
// @Param request body controllers.PutNowPlaying.request true "Request body"
// @Success 204
func PutNowPlaying(c *gin.Context) {
	type request struct {
		EpisodeID uuid.UUID `json:"episode_id" binding:"required,uuid"`
	}
	var r request
	if err := c.ShouldBindJSON(&r); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	nowPlaying := models.NowPlaying{
		UserID:    middleware.GetUser(c),
		EpisodeID: r.EpisodeID,
	}
	result := global.DB.Save(&nowPlaying)
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to set current episode")
		return
	}

	c.JSON(http.StatusNoContent, nil)
}

// @Tags now-playing
// @Router /now-playing [delete]
// @Success 204
func DeleteNowPlaying(c *gin.Context) {
	global.DB.Delete(models.NowPlaying{UserID: middleware.GetUser(c)})
	c.JSON(http.StatusNoContent, nil)
}
