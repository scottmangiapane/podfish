package main

import (
	"net/http"
	"podfish/controllers"
	"podfish/docs"
	"podfish/global"
	"podfish/middleware"

	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @BasePath        /api/v1
// @contact.name    Scott Mangiapane
// @contact.url     https://github.com/scottmangiapane/podfish/issues
// @license.name    GPL 3.0
// @license.url     https://github.com/scottmangiapane/podfish/blob/master/LICENSE
func main() {
	global.InitDatabase()

	gin.ForceConsoleColor()
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()
	r.SetTrustedProxies(nil)

	v1 := r.Group("/api/v1")
	v1.POST("/auth/sign-in", controllers.PostSignIn)
	v1.POST("/auth/sign-out", controllers.PostSignOut)
	v1.POST("/auth/sign-up", controllers.PostSignUp)

	authorized := v1.Group("/")
	authorized.Use(middleware.RequireAuth)

	authorized.GET("/episodes", controllers.GetEpisodes)
	authorized.GET("/episodes/:id", controllers.GetEpisode)
	authorized.PATCH("/episodes/:id/completed", controllers.PatchEpisodeCompleted)
	authorized.PATCH("/episodes/:id/playback-position", controllers.PatchEpisodePlaybackPosition)

	authorized.GET("/now-playing", controllers.GetNowPlaying)
	authorized.PUT("/now-playing", controllers.PutNowPlaying)
	authorized.DELETE("/now-playing", controllers.DeleteNowPlaying)

	authorized.GET("/subscriptions", controllers.GetSubscriptions)
	authorized.POST("/subscriptions", controllers.PostSubscriptions)
	authorized.GET("/subscriptions/:id", controllers.GetSubscription)
	authorized.DELETE("/subscriptions/:id", controllers.DeleteSubscription)

	authorized.POST("/reset-password", controllers.PostResetPassword)
	authorized.POST("/reset-password/:token", controllers.PostResetPasswordWithToken)
	authorized.PATCH("/users/:id/email", controllers.PatchUserEmail)
	authorized.PATCH("/users/:id/password", controllers.PatchUserPassword)

	docs.SwaggerInfo.Title = "PodFish"
	r.StaticFS("/docs", http.Dir("docs"))
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	r.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"code": "NOT_FOUND", "message": "Not found"})
	})

	r.Run("0.0.0.0:8080")
}
