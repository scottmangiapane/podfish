package main

import (
	"net/http"
	"podcast-app/controllers"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.POST("/auth/sign-up", controllers.PostSignUp)
	router.POST("/auth/sign-in", controllers.PostSignIn)
	router.POST("/auth/sign-out", controllers.PostSignOut)

	router.PATCH("/users/:id/email", controllers.PatchUserEmail)
	router.PATCH("/users/:id/password", controllers.PatchUserPassword)
	router.POST("/reset-password", controllers.PostResetPassword)
	router.POST("/reset-password/:token", controllers.PostResetPasswordWithToken)

	router.GET("/subscriptions", controllers.GetSubscriptions)
	router.POST("/subscriptions", controllers.PostSubscriptions)
	router.GET("/subscriptions/:id", controllers.GetSubscription)
	router.DELETE("/subscriptions/:id", controllers.DeleteSubscription)

	router.GET("/episodes", controllers.GetEpisodes)
	router.GET("/episodes/:id", controllers.GetEpisode)
	router.PATCH("/episodes/:id/completed", controllers.PatchEpisodeCompleted)
	router.PATCH("/episodes/:id/playback-position", controllers.PatchEpisodePlaybackPosition)

	router.GET("/now-playing", controllers.GetNowPlaying)
	router.PUT("/now-playing", controllers.PutNowPlaying)
	router.DELETE("/now-playing", controllers.DeleteNowPlaying)

	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"code": "NOT_FOUND", "message": "Not found"})
	})

	router.Run("localhost:8080")
}
