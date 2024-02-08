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
// @Success 200 {object} []models.Podcast
func GetSubscriptions(c *gin.Context) {
	var subscriptions []models.Subscription
	result := global.DB.Preload("Podcast").Find(&subscriptions, models.Subscription{
		UserID: middleware.GetUser(c),
	})
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get subscriptions")
		return
	}

	podcasts := []models.Podcast{}
	for _, s := range subscriptions {
		podcasts = append(podcasts, s.Podcast)
	}

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
	var r request
	if err := c.ShouldBindJSON(&r); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	var podcast models.Podcast
	result := global.DB.FirstOrCreate(&podcast, models.Podcast{RSS: r.RSS})
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to create podcast")
		return
	}

	var subscription models.Subscription
	result = global.DB.FirstOrCreate(&subscription, models.Subscription{
		UserID:    middleware.GetUser(c),
		PodcastID: podcast.PodcastID,
	})
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to create subscription")
		return
	}

	// TODO make this async, maybe with a "syncing..." indicator in UI
	err := global.Sync(&podcast)
	if err != nil {
		middleware.Abort(c, http.StatusInternalServerError, "Failed to sync podcast")
		return
	}

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
	result := global.DB.Preload("Podcast").First(&subscription, models.Subscription{
		UserID:    middleware.GetUser(c),
		PodcastID: id,
	})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		middleware.Abort(c, http.StatusNotFound, "No subscription found for that podcast ID")
		return
	}
	if result.Error != nil {
		fmt.Println(result.Error)
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

	result := global.DB.Delete(models.Subscription{
		UserID:    middleware.GetUser(c),
		PodcastID: id,
	})
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to delete subscription")
		return
	}

	c.JSON(http.StatusNoContent, nil)
}
