package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetEpisodes(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

func GetEpisode(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

func PatchEpisodeCompleted(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

func PatchEpisodePlaybackPosition(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}
