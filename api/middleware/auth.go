package middleware

import (
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func RequireAuth(c *gin.Context) {
	session := sessions.Default(c)
	userId := session.Get("user_id")
	if userId == nil {
		Abort(c, http.StatusUnauthorized, "Unauthorized")
		return
	}
	c.Set("user_id", userId)
}

func GetUser(c *gin.Context) (u uuid.UUID) {
	if val, ok := c.Get("user_id"); ok && val != nil {
		u, _ = val.(uuid.UUID)
	}
	return
}
