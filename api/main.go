package main

import (
	"net/http"
	"podcast-app/controllers"
	"podcast-app/docs"

	"github.com/gin-gonic/gin"

	ginSwagger "github.com/swaggo/gin-swagger"

	swaggerfiles "github.com/swaggo/files"
)

// @contact.name	Scott Mangiapane
// @contact.url    	https://github.com/scottmangiapane/podcast-app/issues

// @license.name  GPL 3.0
// @license.url   https://github.com/scottmangiapane/podcast-app/blob/master/LICENSE
func main() {
	r := gin.Default()

	r.POST("/auth/sign-up", controllers.PostSignUp)
	r.POST("/auth/sign-in", controllers.PostSignIn)
	r.POST("/auth/sign-out", controllers.PostSignOut)

	r.PATCH("/users/:id/email", controllers.PatchUserEmail)
	r.PATCH("/users/:id/password", controllers.PatchUserPassword)

	r.POST("/reset-password", controllers.PostResetPassword)
	r.POST("/reset-password/:token", controllers.PostResetPasswordWithToken)

	r.GET("/subscriptions", controllers.GetSubscriptions)
	r.POST("/subscriptions", controllers.PostSubscriptions)
	r.GET("/subscriptions/:id", controllers.GetSubscription)
	r.DELETE("/subscriptions/:id", controllers.DeleteSubscription)

	r.GET("/episodes", controllers.GetEpisodes)
	r.GET("/episodes/:id", controllers.GetEpisode)
	r.PATCH("/episodes/:id/completed", controllers.PatchEpisodeCompleted)
	r.PATCH("/episodes/:id/playback-position", controllers.PatchEpisodePlaybackPosition)

	r.GET("/now-playing", controllers.GetNowPlaying)
	r.PUT("/now-playing", controllers.PutNowPlaying)
	r.DELETE("/now-playing", controllers.DeleteNowPlaying)

	docs.SwaggerInfo.Title = "Podcast API"
	r.StaticFS("/docs", http.Dir("docs"))
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	r.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"code": "NOT_FOUND", "message": "Not found"})
	})

	r.Run("localhost:8080")
}
