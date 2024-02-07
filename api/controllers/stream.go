package controllers

import (
	"net/http"
	"podfish/middleware"

	"github.com/gin-gonic/gin"
)

// @Tags stream
// @Router /stream [get]
func GetStream(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}
