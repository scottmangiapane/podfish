package middleware

import (
	"log"
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
		log.Printf("Error parsing auth token: %v", err)
		Abort(c, http.StatusUnauthorized, "Failed to parse auth token")
		return
	}

	issuedAt, err := token.Claims.GetIssuedAt()
	if err != nil || issuedAt.Add(time.Hour).Before(time.Now()) {
		log.Printf("Error validating auth token expiration: %v", err)
		Abort(c, http.StatusUnauthorized, "Auth token is expired")
		return
	}

	userIDString, err := token.Claims.GetSubject()
	if err != nil {
		log.Printf("Error setting active user: %v", err)
		Abort(c, http.StatusUnauthorized, "Failed to set active user")
		return
	}

	userID, err := uuid.Parse(userIDString)
	if err != nil {
		log.Printf("Error parsing user ID: %v", err)
		Abort(c, http.StatusUnauthorized, "Invalid user ID in auth token")
		return
	}

	c.Set("user", userID)
}

func GetUser(c *gin.Context) (u uuid.UUID) {
	if val, ok := c.Get("user"); ok && val != nil {
		u, _ = val.(uuid.UUID)
	}
	return
}
