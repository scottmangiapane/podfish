package main

import (
	"encoding/gob"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-contrib/sessions/redis"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/scottmangiapane/podfish/api/controllers"
	"github.com/scottmangiapane/podfish/api/docs"
	"github.com/scottmangiapane/podfish/api/middleware"
	"github.com/scottmangiapane/podfish/shared/clients"
	"github.com/scottmangiapane/podfish/shared/utils"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @BasePath        /api/v1
// @contact.name    Scott Mangiapane
// @contact.url     https://github.com/scottmangiapane/podfish/issues
// @license.name    GPL 3.0
// @license.url     https://github.com/scottmangiapane/podfish/blob/master/LICENSE
func main() {
	log.Println("Starting API...")
	clients.SetupDatabase()
	utils.SetupHealth()

	gin.ForceConsoleColor()
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()
	r.SetTrustedProxies(nil)
	setupSessionMiddleware(r)

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

	// Users
	authorized.PATCH("/users/:id/email", controllers.PatchUserEmail)
	authorized.PATCH("/users/:id/password", controllers.PatchUserPassword)

	docs.SwaggerInfo.Title = "Podfish"
	r.StaticFS("/docs", gin.Dir("docs", false))
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	r.StaticFS("/file", gin.Dir(utils.GetEnvString("RSS_DATA_DIR"), false))

	r.NoRoute(func(c *gin.Context) {
		middleware.Abort(c, http.StatusNotFound, "Not found")
	})

	r.Run("0.0.0.0:" + utils.GetEnvString("API_PORT"))
}

func setupSessionMiddleware(r *gin.Engine) {
	gob.Register(uuid.UUID{})

	authKey := []byte(utils.GetEnvString("AUTH_KEY"))
	redisHost := fmt.Sprintf("%s:6379", utils.GetEnvString("REDIS_HOST"))
	redisPassword := utils.GetEnvString("REDIS_PASSWORD")

	if len(authKey) < 32 {
		log.Fatal("AUTH_KEY must be at least 32 bytes")
	}

	store, err := redis.NewStore(10, "tcp", redisHost, "", redisPassword, authKey)
	if err != nil {
		log.Fatalf("Failed to create redis session store: %v", err)
	}

	store.Options(sessions.Options{
		HttpOnly: true,
		MaxAge:   60 * 60 * 12, // 12 hours
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
		Secure:   utils.GetEnvBool("SECURE_COOKIES"),
	})

	r.Use(sessions.Sessions("session", store))
}
