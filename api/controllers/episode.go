package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Tags episodes
// @Router /episodes [get]
func GetEpisodes(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}

// @Tags episodes
// @Router /episodes/{id} [get]
// @Param id path string true "Episode ID"
func GetEpisode(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}

// @Tags episodes
// @Router /episodes/{id}/completed [patch]
// @Param id path string true "Episode ID"
func PatchEpisodeCompleted(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}

// @Tags episodes
// @Router /episodes/{id}/playback-position [patch]
// @Param id path string true "Episode ID"
func PatchEpisodePlaybackPosition(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{
		"code":    "NOT_IMPLEMENTED",
		"message": "Not implemented",
	})
}
