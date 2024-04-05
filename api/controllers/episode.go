package controllers

import (
	"fmt"
	"net/http"
	"podfish/global"
	"podfish/middleware"
	"podfish/models"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// @Tags episodes
// @Router /episodes [get]
// @Param limit query number false "Limit" default(10)
// @Param offset query number false "Offset" default(0)
// @Param podcast_id query string false "Podcast ID"
// @Success 200 {object} []models.EpisodePosition
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
	var episodes []models.EpisodePosition = []models.EpisodePosition{}
	result := global.DB.
		Table("episodes").
		Joins("LEFT JOIN positions "+
			"ON episodes.episode_id = positions.episode_id "+
			"AND positions.user_id = ?", middleware.GetUser(c)).
		Where(&models.Episode{PodcastID: podcastId}).
		Order("date DESC, episodes.episode_id").
		Limit(limit).
		Offset(offset).
		Scan(&episodes)
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
// @Success 200 {object} models.EpisodePosition
func GetEpisode(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid episode ID")
		return
	}

	var episode models.EpisodePosition
	result := global.DB.
		Table("episodes").
		Joins("LEFT JOIN positions "+
			"ON episodes.episode_id = positions.episode_id "+
			"AND positions.user_id = ?", middleware.GetUser(c)).
		Where(&models.Episode{EpisodeID: id}).
		Scan(&episode)

	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get episode")
		return
	}
	if episode.Episode.EpisodeID == uuid.Nil {
		middleware.Abort(c, http.StatusNotFound, "No episode found with that ID")
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
// @Router /episodes/{id}/current-time [patch]
// @Param id path string true "Episode ID"
// @Param request body controllers.PatchEpisodeCurrentTime.request true "Request body"
// @Success 204
func PatchEpisodeCurrentTime(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid episode ID")
		return
	}

	type request struct {
		CurrentTime uint `json:"current_time" binding:"gte=0"`
	}
	var r request
	if err := c.ShouldBindJSON(&r); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	position := models.Position{
		UserID:       middleware.GetUser(c),
		EpisodeID:    id,
		CurrentTime:  r.CurrentTime,
		LastListened: time.Now(),
	}
	result := global.DB.Save(&position)
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to set current time")
		return
	}

	c.JSON(http.StatusOK, position)
}
