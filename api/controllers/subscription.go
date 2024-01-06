package controllers

import (
	"fmt"
	"net/http"
	"podfish/global"
	"podfish/middleware"
	"podfish/models"

	"github.com/gin-gonic/gin"
)

// @Tags subscriptions
// @Router /subscriptions [get]
func GetSubscriptions(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}

// @Tags subscriptions
// @Router /subscriptions [post]
// @Param request body controllers.PostSubscriptions.request true "Request body"
func PostSubscriptions(c *gin.Context) {
	type request struct {
		RSS string `json:"rss" binding:"required,url"`
	}
	var r request
	if err := c.ShouldBindJSON(&r); err != nil {
		middleware.AbortWithValidationError(c, err)
		return
	}

	var podcast models.Podcast
	result := global.DB.FirstOrCreate(&podcast, models.Podcast{RSS: r.RSS})
	if result.Error != nil {
		fmt.Println(result.Error)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"code":    "SERVER_ERROR",
			"message": "Failed to create podcast",
		})
		return
	}

	var subscription models.Subscription
	result = global.DB.FirstOrCreate(&subscription, models.Subscription{
		UserID:    middleware.GetUser(c),
		PodcastID: podcast.ID,
	})
	if result.Error != nil {
		fmt.Println(result.Error)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"code":    "SERVER_ERROR",
			"message": "Failed to create subscription",
		})
		return
	}

	c.JSON(http.StatusCreated, podcast)
}

// @Tags subscriptions
// @Router /subscriptions/{id} [get]
// @Param id path string true "Subscription ID"
func GetSubscription(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}

// @Tags subscriptions
// @Router /subscriptions/{id} [delete]
// @Param id path string true "Subscription ID"
func DeleteSubscription(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}
