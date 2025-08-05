package controllers

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/scottmangiapane/podfish/api/middleware"
	"github.com/scottmangiapane/podfish/shared"
	"github.com/scottmangiapane/podfish/shared/models"
	"gorm.io/gorm"
)

// @Tags episodes
// @Router /episodes [get]
// @Param limit query number false "Limit" default(10)
// @Param before_id query string false "Before"
// @Param after_id query string false "After"
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

	var beforeId uuid.UUID
	var beforeEpisode models.Episode
	if c.Query("before_id") != "" {
		beforeParam, err := uuid.Parse(c.Query("before_id"))
		if err != nil {
			middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid before ID")
			return
		}
		beforeId = beforeParam
		result := shared.DB.First(&beforeEpisode, &models.Episode{EpisodeID: beforeId})
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			middleware.Abort(c, http.StatusNotFound, "Before episode not found")
			return
		}
	}

	var afterId uuid.UUID
	var afterEpisode models.Episode
	if c.Query("after_id") != "" {
		afterParam, err := uuid.Parse(c.Query("after_id"))
		if err != nil {
			middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid after ID")
			return
		}
		afterId = afterParam
		result := shared.DB.First(&afterEpisode, &models.Episode{EpisodeID: afterId})
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			middleware.Abort(c, http.StatusNotFound, "After episode not found")
			return
		}
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
	query := shared.DB.
		Table("episodes").
		Joins("LEFT JOIN positions "+
			"ON episodes.episode_id = positions.episode_id "+
			"AND positions.user_id = ?", middleware.GetUser(c))
	if podcastId != uuid.Nil {
		query = query.Where("podcast_id = ?", podcastId)
	}

	if beforeId != uuid.Nil {
		query = query.Where("date < ?", beforeEpisode.Date)
	}

	if afterId != uuid.Nil {
		query = query.Where("date > ?", afterEpisode.Date)
	}

	var episodes []models.EpisodePosition = []models.EpisodePosition{}
	result := query.
		Order("date DESC, episodes.episode_id").
		Limit(limit).
		Scan(&episodes)
	if result.Error != nil {
		log.Printf("Error getting episodes from DB: %v", result.Error)
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
	result := shared.DB.
		Table("episodes").
		Joins("LEFT JOIN positions "+
			"ON episodes.episode_id = positions.episode_id "+
			"AND positions.user_id = ?", middleware.GetUser(c)).
		Where(&models.Episode{EpisodeID: id}).
		Scan(&episode)

	if result.Error != nil {
		log.Printf("Error getting episode from DB: %v", result.Error)
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
// @Router /episodes/{id}/position [patch]
// @Param id path string true "Episode ID"
// @Param request body controllers.PatchEpisodePosition.request true "Request body"
// @Success 200 {object} models.Position
func PatchEpisodePosition(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid episode ID")
		return
	}

	type request struct {
		Completed    bool `json:"completed"`
		CurrentTime  uint `json:"current_time" binding:"gte=0"`
		RealDuration uint `json:"real_duration" binding:"gte=0"`
	}
	var req request
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	position := models.Position{
		UserID:       middleware.GetUser(c),
		EpisodeID:    id,
		Completed:    req.Completed,
		CurrentTime:  req.CurrentTime,
		LastListened: time.Now(),
		RealDuration: req.RealDuration,
	}
	result := shared.DB.Save(&position)
	if result.Error != nil {
		log.Printf("Error saving episode position in DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to set episode position")
		return
	}

	c.JSON(http.StatusOK, position)
}
