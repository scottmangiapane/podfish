package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Tags subscriptions
// @Router /subscriptions [get]
func GetSubscriptions(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

// @Tags subscriptions
// @Router /subscriptions [post]
func PostSubscriptions(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

// @Tags subscriptions
// @Router /subscriptions/{id} [get]
// @Param id path string true "Subscription ID"
func GetSubscription(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

// @Tags subscriptions
// @Router /subscriptions/{id} [delete]
// @Param id path string true "Subscription ID"
func DeleteSubscription(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}
