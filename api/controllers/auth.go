package controllers

import (
	"errors"
	"net/http"
	"podfish/global"
	"podfish/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type creds struct {
	Email    string `json:"email" binding:"email,required"`
	Password string `json:"password" binding:"max=64,min=8,required"`
}

// @Tags auth
// @Router /auth/sign-in [post]
// @Param request body controllers.creds true "Request body"
func PostSignIn(c *gin.Context) {
	var r creds
	if err := c.ShouldBindJSON(&r); err != nil {
		global.AbortWithValidationError(c, err)
		return
	}

	var user models.User
	result := global.DB.Where(&models.User{Email: r.Email}).First(&user)
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"code": "NOT_FOUND", "message": "No user found for that email"})
		return
	}

	if user.CheckPassword(r.Password) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"code": "UNAUTHORIZED", "message": "Password verification failed"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// @Tags auth
// @Router /auth/sign-out [post]
func PostSignOut(c *gin.Context) {
	c.JSON(http.StatusBadRequest, gin.H{"code": "NOT_IMPLEMENTED", "message": "Not implemented"})
}

// @Tags auth
// @Router /auth/sign-up [post]
// @Param request body controllers.creds true "Request body"
func PostSignUp(c *gin.Context) {
	var r creds
	if err := c.ShouldBindJSON(&r); err != nil {
		global.AbortWithValidationError(c, err)
		return
	}

	result := global.DB.Where(&models.User{Email: r.Email}).First(&models.User{})
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusConflict, gin.H{"code": "ALREADY_EXISTS", "message": "Email is already in use"})
		return
	}

	user := models.User{Email: r.Email}
	user.SetPassword(r.Password)
	global.DB.Create(&user)
	c.JSON(http.StatusCreated, user)
}
