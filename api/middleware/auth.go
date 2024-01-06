package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func CheckAuth(c *gin.Context) {
	cookie, err := c.Cookie("auth")
	if err != nil || cookie == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"code": "UNAUTHORIZED", "message": "Auth token is missing"})
		return
	}

	getKey := func(token *jwt.Token) (interface{}, error) { return []byte("development key"), nil }
	token, err := jwt.Parse(cookie, getKey)
	if err != nil || !token.Valid {
		fmt.Println(err)
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"code": "UNAUTHORIZED", "message": "Failed to parse auth token"})
	}

	issuedAt, err := token.Claims.GetIssuedAt()
	if err != nil || issuedAt.Add(time.Hour).Before(time.Now()) {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"code": "UNAUTHORIZED", "message": "Auth token is expired"})
	}

	userId, err := token.Claims.GetSubject()
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"code": "UNAUTHORIZED", "message": "Failed to set active user"})
	}
	c.Set("user", userId)
}
