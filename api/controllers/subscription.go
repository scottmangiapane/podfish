package controllers

import (
	"bytes"
	"errors"
	"log"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/scottmangiapane/podfish/api/middleware"
	"github.com/scottmangiapane/podfish/shared"
	"github.com/scottmangiapane/podfish/shared/models"
	"gorm.io/gorm"
)

// @Tags subscriptions
// @Router /subscriptions [get]
// @Success 200 {object} []models.Podcast
func GetSubscriptions(c *gin.Context) {
	var subscriptions []models.Subscription
	result := shared.DB.
		Preload("Podcast").
		Find(&subscriptions, models.Subscription{
			UserID: middleware.GetUser(c),
		})
	if result.Error != nil {
		log.Printf("Error getting subscriptions from DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get subscriptions")
		return
	}

	podcasts := []models.Podcast{}
	for _, subscription := range subscriptions {
		podcasts = append(podcasts, subscription.Podcast)
	}
	sort.Slice(podcasts, func(i, j int) bool {
		if podcasts[i].Title != podcasts[j].Title {
			return podcasts[i].Title < podcasts[j].Title
		}
		return bytes.Compare(subscriptions[i].PodcastID[:], subscriptions[j].PodcastID[:]) < 0
	})

	c.JSON(http.StatusOK, podcasts)
}

// @Tags subscriptions
// @Router /subscriptions [post]
// @Param request body controllers.PostSubscriptions.request true "Request body"
// @Success 201 {object} models.Podcast
func PostSubscriptions(c *gin.Context) {
	type request struct {
		RSS string `json:"rss" binding:"required,url"`
	}
	var req request
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	var podcast models.Podcast
	result := shared.DB.FirstOrCreate(&podcast, models.Podcast{RSS: req.RSS})
	if result.Error != nil {
		log.Printf("Error creating podcast in DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to create podcast")
		return
	}

	var subscription models.Subscription
	result = shared.DB.FirstOrCreate(&subscription, models.Subscription{
		UserID:    middleware.GetUser(c),
		PodcastID: podcast.PodcastID,
	})
	if result.Error != nil {
		log.Printf("Error creating subscription in DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to create subscription")
		return
	}

	// TODO request immediate sync of podcast
	// TODO show "syncing..." indicator in UI
	// err := global.Sync(&podcast)
	// if err != nil {
	// 	log.Printf("Error syncing podcast: %v", err)
	// 	middleware.Abort(c, http.StatusInternalServerError, "Failed to sync podcast")
	// 	return
	// }

	c.JSON(http.StatusCreated, podcast)
}

// @Tags subscriptions
// @Router /subscriptions/{id} [get]
// @Param id path string true "Podcast ID"
// @Success 200 {object} models.Podcast
func GetSubscription(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid podcast ID")
		return
	}

	var subscription models.Subscription
	result := shared.DB.Preload("Podcast").First(&subscription, models.Subscription{
		UserID:    middleware.GetUser(c),
		PodcastID: id,
	})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		middleware.Abort(c, http.StatusNotFound, "No subscription found with that podcast ID")
		return
	}
	if result.Error != nil {
		log.Printf("Error getting subscription from DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get subscription")
		return
	}

	c.JSON(http.StatusOK, subscription.Podcast)
}

// @Tags subscriptions
// @Router /subscriptions/{id} [delete]
// @Param id path string true "Podcast ID"
// @Success 204
func DeleteSubscription(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Invalid podcast ID")
		return
	}

	result := shared.DB.Delete(models.Subscription{
		UserID:    middleware.GetUser(c),
		PodcastID: id,
	})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		middleware.Abort(c, http.StatusNotFound, "No subscription found with that podcast ID")
		return
	}
	if result.Error != nil {
		log.Printf("Error deleting subscription from DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to delete subscription")
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
