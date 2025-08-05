package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/scottmangiapane/podfish/api/controllers"
	"github.com/scottmangiapane/podfish/api/docs"
	"github.com/scottmangiapane/podfish/api/middleware"
	"github.com/scottmangiapane/podfish/shared"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @BasePath        /api/v1
// @contact.name    Scott Mangiapane
// @contact.url     https://github.com/scottmangiapane/podfish/issues
// @license.name    GPL 3.0
// @license.url     https://github.com/scottmangiapane/podfish/blob/master/LICENSE
func main() {
	fmt.Println("Starting API...")
	shared.InitDatabase()

	gin.ForceConsoleColor()
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()
	r.SetTrustedProxies(nil)

	// Auth
	v1 := r.Group("/api/v1")
	v1.POST("/auth/reset-password", controllers.PostResetPassword)
	v1.PATCH("/auth/reset-password/:token", controllers.PatchResetPasswordWithToken)
	v1.POST("/auth/sign-in", controllers.PostSignIn)
	v1.POST("/auth/sign-out", controllers.PostSignOut)
	v1.POST("/auth/sign-up", controllers.PostSignUp)

	authorized := v1.Group("/")
	authorized.Use(middleware.RequireAuth)

	// Episodes
	authorized.GET("/episodes", controllers.GetEpisodes)
	authorized.GET("/episodes/:id", controllers.GetEpisode)
	authorized.PATCH("/episodes/:id/position", controllers.PatchEpisodePosition)

	// Now Playing
	authorized.GET("/now-playing", controllers.GetNowPlaying)
	authorized.PUT("/now-playing", controllers.PutNowPlaying)
	authorized.DELETE("/now-playing", controllers.DeleteNowPlaying)

	// Subscriptions
	authorized.GET("/subscriptions", controllers.GetSubscriptions)
	authorized.POST("/subscriptions", controllers.PostSubscriptions)
	authorized.GET("/subscriptions/:id", controllers.GetSubscription)
	authorized.DELETE("/subscriptions/:id", controllers.DeleteSubscription)

	// Sync
	// TODO for testing purposes only, replace with background service
	authorized.POST("/sync", controllers.PostSync)
	authorized.POST("/sync/:id", controllers.PostSyncWithId)

	// Users
	authorized.PATCH("/users/:id/email", controllers.PatchUserEmail)
	authorized.PATCH("/users/:id/password", controllers.PatchUserPassword)

	docs.SwaggerInfo.Title = "Podfish"
	r.StaticFS("/docs", gin.Dir("docs", false))
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	r.StaticFS("/file", gin.Dir(os.Getenv("RSS_DATA_DIR"), false))

	r.NoRoute(func(c *gin.Context) {
		middleware.Abort(c, http.StatusNotFound, "Not found")
	})

	r.Run("0.0.0.0:" + os.Getenv("API_PORT"))
}
