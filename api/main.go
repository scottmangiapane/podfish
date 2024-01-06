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

// @BasePath /api/v1
// @contact.name       Scott Mangiapane
// @contact.url        https://github.com/scottmangiapane/podfish/issues
// @license.name  GPL 3.0
// @license.url   https://github.com/scottmangiapane/podfish/blob/master/LICENSE
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

	v1.POST("/reset-password", middleware.CheckAuth, controllers.PostResetPassword)
	v1.POST("/reset-password/:token", middleware.CheckAuth, controllers.PostResetPasswordWithToken)
	v1.PATCH("/users/:id/email", middleware.CheckAuth, controllers.PatchUserEmail)
	v1.PATCH("/users/:id/password", middleware.CheckAuth, controllers.PatchUserPassword)

	v1.GET("/subscriptions", middleware.CheckAuth, controllers.GetSubscriptions)
	v1.POST("/subscriptions", middleware.CheckAuth, controllers.PostSubscriptions)
	v1.GET("/subscriptions/:id", middleware.CheckAuth, controllers.GetSubscription)
	v1.DELETE("/subscriptions/:id", middleware.CheckAuth, controllers.DeleteSubscription)

	v1.GET("/episodes", middleware.CheckAuth, controllers.GetEpisodes)
	v1.GET("/episodes/:id", middleware.CheckAuth, controllers.GetEpisode)
	v1.PATCH("/episodes/:id/completed", middleware.CheckAuth, controllers.PatchEpisodeCompleted)
	v1.PATCH("/episodes/:id/playback-position", middleware.CheckAuth, controllers.PatchEpisodePlaybackPosition)

	v1.GET("/now-playing", middleware.CheckAuth, controllers.GetNowPlaying)
	v1.PUT("/now-playing", middleware.CheckAuth, controllers.PutNowPlaying)
	v1.DELETE("/now-playing", middleware.CheckAuth, controllers.DeleteNowPlaying)

	docs.SwaggerInfo.Title = "PodFish"
	r.StaticFS("/docs", http.Dir("docs"))
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	r.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"code": "NOT_FOUND", "message": "Not found"})
	})

	r.Run("0.0.0.0:8080")
}
