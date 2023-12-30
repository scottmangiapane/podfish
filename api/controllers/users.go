package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func PatchUserEmail(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

func PatchUserPassword(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

func PostResetPassword(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

func PostResetPasswordWithToken(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}
