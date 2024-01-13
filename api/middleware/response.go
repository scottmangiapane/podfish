package middleware

import "github.com/gin-gonic/gin"

func Abort(c *gin.Context, code int, message string) {
	c.AbortWithStatusJSON(code, gin.H{"error": message})
}
