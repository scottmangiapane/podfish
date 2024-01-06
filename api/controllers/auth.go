package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"podfish/global"
	"podfish/middleware"
	"podfish/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
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
		middleware.AbortWithValidationError(c, err)
		return
	}

	var user models.User
	result := global.DB.First(&user, &models.User{Email: r.Email})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusNotFound, gin.H{
			"code":    "NOT_FOUND",
			"message": "No user found for that email",
		})
		return
	}
	if result.Error != nil {
		fmt.Println(result.Error)
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"code":    "SERVER_ERROR",
			"message": "Failed to get user",
		})
		return
	}

	if user.CheckPassword(r.Password) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"code":    "UNAUTHORIZED",
			"message": "Password verification failed",
		})
		return
	}

	key := []byte("development key")
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iat": time.Now().UTC().Unix(),
		"sub": user.ID,
	})
	s, err := t.SignedString(key)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    "SERVER_ERROR",
			"message": "Failed to create JWT",
		})
		return
	}

	c.SetCookie("auth", s, 3600, "/", "localhost", false, true)
	c.JSON(http.StatusOK, user)
}

// @Tags auth
// @Router /auth/sign-out [post]
func PostSignOut(c *gin.Context) {
	c.SetCookie("auth", "", -1, "/", "localhost", false, true)
	c.Writer.WriteHeader(http.StatusNoContent)
}

// @Tags auth
// @Router /auth/sign-up [post]
// @Param request body controllers.creds true "Request body"
func PostSignUp(c *gin.Context) {
	var r creds
	if err := c.ShouldBindJSON(&r); err != nil {
		middleware.AbortWithValidationError(c, err)
		return
	}

	result := global.DB.Where(&models.User{Email: r.Email}).First(&models.User{})
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusConflict, gin.H{
			"code":    "ALREADY_EXISTS",
			"message": "Email is already in use",
		})
		return
	}

	user := models.User{Email: r.Email, Password: r.Password}
	if result := global.DB.Create(&user); result.Error != nil {
		fmt.Println(result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{
			"code":    "SERVER_ERROR",
			"message": "Failed to create user",
		})
		return
	}

	c.JSON(http.StatusCreated, user)
}
