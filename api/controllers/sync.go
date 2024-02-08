package controllers

import (
	"fmt"
	"net/http"
	"podfish/global"
	"podfish/middleware"
	"podfish/models"

	"github.com/gin-gonic/gin"
)

// TODO for testing purposes only, remove this or lock behind admin creds

// @Tags sync
// @Router /sync [post]
// @Success 204
func PostSync(c *gin.Context) {
	var subscriptions []models.Subscription
	result := global.DB.Preload("Podcast").Find(&subscriptions, models.Subscription{
		UserID: middleware.GetUser(c),
	})
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get subscriptions")
		return
	}

	for _, s := range subscriptions {
		global.Sync(&s.Podcast)
	}

	c.JSON(http.StatusNoContent, nil)
}

// @Tags sync
// @Router /sync/{id} [post]
// @Param id path string true "Podcast ID"
// @Success 204
func PostSyncWithId(c *gin.Context) {
	var subscriptions []models.Subscription
	result := global.DB.Preload("Podcast").Find(&subscriptions, models.Subscription{
		UserID: middleware.GetUser(c),
	})
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get subscriptions")
		return
	}

	for _, s := range subscriptions {
		if s.PodcastID.String() == c.Param("id") {
			global.Sync(&s.Podcast)
		}
	}

	c.JSON(http.StatusNoContent, nil)
}
