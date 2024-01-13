package controllers

import (
	"net/http"
	"podfish/middleware"

	"github.com/gin-gonic/gin"
)

// @Tags users
// @Router /reset-password [post]
func PostResetPassword(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}

// @Tags users
// @Router /reset-password/{token} [post]
// @Param token path string true "Token"
func PostResetPasswordWithToken(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}

// @Tags users
// @Router /users/{id}/email [patch]
// @Param id path string true "User ID"
func PatchUserEmail(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}

// @Tags users
// @Router /users/{id}/password [patch]
// @Param id path string true "User ID"
func PatchUserPassword(c *gin.Context) {
	middleware.Abort(c, http.StatusBadRequest, "Not implemented")
}
