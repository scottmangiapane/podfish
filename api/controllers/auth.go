package controllers

import (
	"errors"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/scottmangiapane/podfish/api/middleware"
	"github.com/scottmangiapane/podfish/shared/clients"
	"github.com/scottmangiapane/podfish/shared/models"
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
	var req creds
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	var user models.User
	result := clients.DB.First(&user, &models.User{Email: req.Email})
	if errors.Is(result.Error, gorm.ErrRecordNotFound) {
		middleware.Abort(c, http.StatusNotFound, "No user found with that email")
		return
	}
	if result.Error != nil {
		log.Printf("Error getting user from DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to get user")
		return
	}

	if user.CheckPassword(req.Password) != nil {
		middleware.Abort(c, http.StatusUnauthorized, "Password verification failed")
		return
	}

	session := sessions.Default(c)
	session.Set("user_id", user.UserID)

	if err := session.Save(); err != nil {
		log.Printf("Failed to save session: %v", err)
		c.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	c.JSON(http.StatusOK, user)
}

// @Tags auth
// @Router /auth/sign-out [post]
// @Success 204
func PostSignOut(c *gin.Context) {
	session := sessions.Default(c)
	session.Clear()
	session.Save()
	c.JSON(http.StatusNoContent, nil)
}

// @Tags auth
// @Router /auth/sign-up [post]
// @Param request body controllers.creds true "Request body"
// @Success 201 {object} models.User
func PostSignUp(c *gin.Context) {
	var req creds
	if err := c.ShouldBindJSON(&req); err != nil {
		middleware.Abort(c, http.StatusUnprocessableEntity, "Request is invalid")
		return
	}

	result := clients.DB.Where(&models.User{Email: req.Email}).First(&models.User{})
	if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		middleware.Abort(c, http.StatusConflict, "Email is already in use")
		return
	}

	user := models.User{Email: req.Email, Password: req.Password}
	if result := clients.DB.Create(&user); result.Error != nil {
		log.Printf("Error creating user in DB: %v", result.Error)
		middleware.Abort(c, http.StatusInternalServerError, "Failed to create user")
		return
	}

	c.JSON(http.StatusCreated, user)
}
