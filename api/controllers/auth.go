package controllers

import (
	"errors"
	"net/http"
	"podfish/database"
	"podfish/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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
		c.JSON(http.StatusBadRequest, gin.H{"code": "BAD_REQUEST", "message": "Could not parse request"})
		return
	}

	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

// @Tags auth
// @Router /auth/sign-out [post]
func PostSignOut(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
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
		c.JSON(http.StatusBadRequest, gin.H{"code": "BAD_REQUEST", "message": "Could not parse request"})
		return
	}

	result := database.DB.Where(&models.User{Email: r.Email}).First(&models.User{})
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusConflict, gin.H{"code": "ALREADY_EXISTS", "message": "Email is already in use"})
		return
	}

	user := models.User{Email: r.Email}
	user.SetPassword(r.Password)
	database.DB.Create(&user)
	c.JSON(http.StatusCreated, user)
}
