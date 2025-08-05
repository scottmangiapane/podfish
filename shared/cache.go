package shared

import (
	"fmt"
	"os"

	"github.com/hibiken/asynq"
)

var (
	Cache *asynq.Client
)

func InitCache() {
	redisAddr := fmt.Sprintf("%s:6379", os.Getenv("POSTGRES_HOST"))
	cache := asynq.NewClient(asynq.RedisClientOpt{Addr: redisAddr})
	defer cache.Close()

	Cache = cache
}
