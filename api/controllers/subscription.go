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

// @Tags subscriptions
// @Router /subscriptions [get]
func GetSubscriptions(c *gin.Context) {
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

	var podcasts []models.Podcast
	for _, s := range subscriptions {
		podcasts = append(podcasts, s.Podcast)
	}

	c.JSON(http.StatusOK, podcasts)
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
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnprocessableEntity, gin.H{
			"code":    "BAD_REQUEST",
			"message": "Invalid subscription ID",
		})
		return
	}

	var subscription models.Subscription
	result := global.DB.Preload("Podcast").First(&subscription, models.Subscription{
		UserID:    middleware.GetUser(c),
		PodcastID: id,
	})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    "NOT_FOUND",
			"message": "No subscription found with that ID",
		})
		return
	}
	if result.Error != nil {
		fmt.Println(result.Error)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"code":    "SERVER_ERROR",
			"message": "Failed to get subscription",
		})
		return
	}

	c.JSON(http.StatusOK, subscription.Podcast)
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
