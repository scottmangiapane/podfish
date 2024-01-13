package controllers

import (
	"net/http"
	"podfish/middleware"

	"github.com/gin-gonic/gin"
)

// @Tags now-playing
// @Router /now-playing [get]
func GetNowPlaying(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}

// @Tags now-playing
// @Router /now-playing [put]
func PutNowPlaying(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}

// @Tags now-playing
// @Router /now-playing [delete]
func DeleteNowPlaying(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}
