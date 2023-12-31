package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Tags now-playing
// @Router /now-playing [get]
func GetNowPlaying(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

// @Tags now-playing
// @Router /now-playing [put]
func PutNowPlaying(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

// @Tags now-playing
// @Router /now-playing [delete]
func DeleteNowPlaying(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}
