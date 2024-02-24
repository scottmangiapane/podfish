package controllers

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"podfish/global"
	"podfish/middleware"
	"podfish/models"
	"strings"
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
// @Router /auth/reset-password [post]
func PostResetPassword(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}

// @Tags auth
// @Router /auth/reset-password/{token} [patch]
// @Param token path string true "Token"
func PatchResetPasswordWithToken(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}

// @Tags auth
// @Router /auth/sign-in [post]
// @Param request body controllers.creds true "Request body"
// @Success 200 {object} models.User
func PostSignIn(c *gin.Context) {
	var r creds
	if err := c.ShouldBindJSON(&r); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	var user models.User
	result := global.DB.First(&user, &models.User{Email: r.Email})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		middleware.Abort(c, http.StatusNotFound, "No user found with that email")
		return
	}
	if result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get user")
		return
	}

	if user.CheckPassword(r.Password) != nil {
		middleware.Abort(c, http.StatusUnauthorized, "Password verification failed")
		return
	}

	key := []byte(os.Getenv("JWT_HMAC_KEY"))
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iat": time.Now().UTC().Unix(),
		"sub": user.UserID,
	})
	s, err := t.SignedString(key)
	if err != nil {
		fmt.Println(err)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to create JWT")
		return
	}

	secure := strings.EqualFold(os.Getenv("SECURE_COOKIES"), "true")
	c.SetCookie("auth", s, 3600, "/", os.Getenv("UI_URL"), secure, true)
	c.SetCookie("user", user.UserID.String(), 3600, "/", os.Getenv("UI_URL"), secure, false)
	c.JSON(http.StatusOK, user)
}

// @Tags auth
// @Router /auth/sign-out [post]
// @Success 204
func PostSignOut(c *gin.Context) {
	secure := strings.EqualFold(os.Getenv("SECURE_COOKIES"), "true")
	c.SetCookie("auth", "", -1, "/", os.Getenv("UI_URL"), secure, true)
	c.SetCookie("user", "", -1, "/", os.Getenv("UI_URL"), secure, false)
	c.JSON(http.StatusNoContent, nil)
}

// @Tags auth
// @Router /auth/sign-up [post]
// @Param request body controllers.creds true "Request body"
// @Success 201 {object} models.User
func PostSignUp(c *gin.Context) {
	var r creds
	if err := c.ShouldBindJSON(&r); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	result := global.DB.Where(&models.User{Email: r.Email}).First(&models.User{})
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		middleware.Abort(c, http.StatusConflict, "Email is already in use")
		return
	}

	user := models.User{Email: r.Email, Password: r.Password}
	if result := global.DB.Create(&user); result.Error != nil {
		fmt.Println(result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	c.JSON(http.StatusCreated, user)
}
