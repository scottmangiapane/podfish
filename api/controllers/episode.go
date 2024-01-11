package controllers

import (
	"fmt"
	"net/http"
	"podfish/global"
	"podfish/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Tags episodes
// @Router /episodes [get]
// @Param limit query number false "Limit" default(10)
// @Param offset query number false "Offset" default(0)
// @Param podcast_id query string false "Podcast ID"
func GetEpisodes(c *gin.Context) {
	limit := 10
	if c.Query("limit") != "" {
		limitParam, err := strconv.Atoi(c.Query("limit"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnprocessableEntity, gin.H{
				"code":    "BAD_REQUEST",
				"message": "Invalid limit",
			})
			return
		}
		limit = limitParam
	}

	offset := 0
	if c.Query("offset") != "" {
		offsetParam, err := strconv.Atoi(c.Query("offset"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnprocessableEntity, gin.H{
				"code":    "BAD_REQUEST",
				"message": "Invalid offset",
			})
			return
		}
		offset = offsetParam
	}

	var podcastId uuid.UUID
	if c.Query("podcast_id") != "" {
		podcastIdParam, err := uuid.Parse(c.Query("podcast_id"))
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnprocessableEntity, gin.H{
				"code":    "BAD_REQUEST",
				"message": "Invalid podcast ID",
			})
			return
		}
		podcastId = podcastIdParam
	}

	var episodes []models.Episode
	result := global.DB.
		Order("date DESC, id").
		Limit(limit).
		Offset(offset).
		Find(&episodes, models.Episode{PodcastID: podcastId})
	if result.Error != nil {
		fmt.Println(result.Error)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"code":    "SERVER_ERROR",
			"message": "Failed to get episodes",
		})
		return
	}

	c.JSON(http.StatusOK, episodes)
}

// @Tags episodes
// @Router /episodes/{id} [get]
// @Param id path string true "Episode ID"
func GetEpisode(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}

// @Tags episodes
// @Router /episodes/{id}/completed [patch]
// @Param id path string true "Episode ID"
func PatchEpisodeCompleted(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}

// @Tags episodes
// @Router /episodes/{id}/playback-position [patch]
// @Param id path string true "Episode ID"
func PatchEpisodePlaybackPosition(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}
