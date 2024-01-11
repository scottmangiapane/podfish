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
func PostSync(c *gin.Context) {
	var subscriptions []models.Subscription
	result := global.DB.Preload("Podcast").Find(&subscriptions, models.Subscription{
		UserID: middleware.GetUser(c),
	})
	if result.Error != nil {
		fmt.Println(result.Error)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"code":    "SERVER_ERROR",
			"message": "Failed to get subscriptions",
		})
		return
	}

	for _, s := range subscriptions {
		global.Sync(s.Podcast)
	}

	c.Writer.WriteHeader(http.StatusNoContent)
}
