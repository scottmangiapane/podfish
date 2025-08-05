package controllers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/scottmangiapane/podfish/api/global"
	"github.com/scottmangiapane/podfish/api/middleware"
	"github.com/scottmangiapane/podfish/shared"
	"github.com/scottmangiapane/podfish/shared/models"
)

// TODO for testing purposes only, remove this or lock behind admin creds

// @Tags sync
// @Router /sync [post]
// @Success 204
func PostSync(c *gin.Context) {
	var subscriptions []models.Subscription
	result := shared.DB.Preload("Podcast").Find(&subscriptions, models.Subscription{
		UserID: middleware.GetUser(c),
	})
	if result.Error != nil {
		log.Printf("Error getting subscriptions from DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to sync")
		return
	}

	for _, subscription := range subscriptions {
		global.Sync(&subscription.Podcast)
	}

	c.JSON(http.StatusNoContent, nil)
}

// @Tags sync
// @Router /sync/{id} [post]
// @Param id path string true "Podcast ID"
// @Success 204
func PostSyncWithId(c *gin.Context) {
	// TODO include id in DB call instead of filtering later
	var subscriptions []models.Subscription
	result := shared.DB.Preload("Podcast").Find(&subscriptions, models.Subscription{
		UserID: middleware.GetUser(c),
	})
	if result.Error != nil {
		log.Printf("Error getting subscriptions from DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to sync")
		return
	}

	for _, subscription := range subscriptions {
		if subscription.PodcastID.String() == c.Param("id") {
			global.Sync(&subscription.Podcast)
		}
	}

	c.JSON(http.StatusNoContent, nil)
}
