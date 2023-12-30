package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func PostSignUp(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

func PostSignIn(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

func PostSignOut(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}
