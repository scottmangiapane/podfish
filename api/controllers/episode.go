package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"podfish/global"
	"podfish/middleware"
	"podfish/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// @Tags episodes
// @Router /episodes [get]
// @Param limit query number false "Limit" default(10)
// @Param offset query number false "Offset" default(0)
// @Param podcast_id query string false "Podcast ID"
// @Success 200 {object} []models.Episode
func GetEpisodes(c *gin.Context) {
	limit := 10
	if c.Query("limit") != "" {
		limitParam, err := strconv.Atoi(c.Query("limit"))
		if err != nil {
			middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid limit")
			return
		}
		limit = limitParam
	}

	offset := 0
	if c.Query("offset") != "" {
		offsetParam, err := strconv.Atoi(c.Query("offset"))
		if err != nil {
			middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid offset")
			return
		}
		offset = offsetParam
	}

	var podcastId uuid.UUID
	if c.Query("podcast_id") != "" {
		podcastIdParam, err := uuid.Parse(c.Query("podcast_id"))
		if err != nil {
			middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid podcast ID")
			return
		}
		podcastId = podcastIdParam
	}

	var episodes []models.Episode
	result := global.DB.
		Order("date DESC, episode_id").
		Limit(limit).
		Offset(offset).
		Find(&episodes, models.Episode{PodcastID: podcastId})
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get episodes")
		return
	}

	c.JSON(http.StatusOK, episodes)
}

// @Tags episodes
// @Router /episodes/{id} [get]
// @Param id path string true "Episode ID"
func GetEpisode(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid episode ID")
		return
	}

	var episode models.Episode
	result := global.DB.First(&episode, models.Episode{EpisodeID: id})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		middleware.Abort(c, http.StatusNotFound, "No episode found with that ID")
		return
	}
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get episode")
		return
	}

	c.JSON(http.StatusOK, episode)
}

// @Tags episodes
// @Router /episodes/{id}/completed [patch]
// @Param id path string true "Episode ID"
func PatchEpisodeCompleted(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}

// @Tags episodes
// @Router /episodes/{id}/playback-position [patch]
// @Param id path string true "Episode ID"
func PatchEpisodePlaybackPosition(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}
