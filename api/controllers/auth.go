package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// @Tags auth
// @Router /auth/sign-in [post]
// @Param request body controllers.PostSignIn.request true "Request body"
func PostSignIn(c *gin.Context) {
	type request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var r request
	if err := c.BindJSON(&r); err != nil {
		// TODO when will this run?
		return
	}

	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

// @Tags auth
// @Router /auth/sign-out [post]
func PostSignOut(c *gin.Context) {
	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

// @Tags auth
// @Router /auth/sign-up [post]
// @Param request body controllers.PostSignUp.request true "Request body"
func PostSignUp(c *gin.Context) {
	type request struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var r request
	if err := c.BindJSON(&r); err != nil {
		// TODO when will this run?
		return
	}

	c.IndentedJSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}
