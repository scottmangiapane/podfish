package global

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func AbortWithValidationError(c *gin.Context, err error) {
	msg := gin.H{"error": "BAD_REQUEST", "message": "Request is invalid"}
	c.AbortWithStatusJSON(http.StatusUnprocessableEntity, msg)
}
