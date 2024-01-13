package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func RequireAuth(c *gin.Context) {
	cookie, err := c.Cookie("auth")
	if err != nil || cookie == "" {
		Abort(c, http.StatusUnauthorized, "Auth token is missing")
		return
	}

	getKey := func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_HMAC_KEY")), nil
	}
	token, err := jwt.Parse(cookie, getKey)
	if err != nil || !token.Valid {
		fmt.Println(err)
		Abort(c, http.StatusUnauthorized, "Failed to parse auth token")
		return
	}

	issuedAt, err := token.Claims.GetIssuedAt()
	if err != nil || issuedAt.Add(time.Hour).Before(time.Now()) {
		Abort(c, http.StatusUnauthorized, "Auth token is expired")
		return
	}

	userIdString, err := token.Claims.GetSubject()
	if err != nil {
		Abort(c, http.StatusUnauthorized, "Failed to set active user")
		return
	}

	userId, err := uuid.Parse(userIdString)
	if err != nil {
		Abort(c, http.StatusUnauthorized, "Invalid user ID in auth token")
		return
	}

	c.Set("user", userId)
}

func GetUser(c *gin.Context) (u uuid.UUID) {
	if val, ok := c.Get("user"); ok && val != nil {
		u, _ = val.(uuid.UUID)
	}
	return
}
