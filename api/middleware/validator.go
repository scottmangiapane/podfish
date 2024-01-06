package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AbortWithValidationError(c *gin.Context, err error) {
	c.AbortWithStatusJSON(http.StatusUnprocessableEntity, gin.H{
		"error":   "BAD_REQUEST",
		"message": "Request is invalid",
	})
}
