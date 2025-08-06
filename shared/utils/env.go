package utils

import (
	"log"
	"os"
	"strconv"
	"strings"
)

func GetEnvBool(key string) bool {
	val := strings.ToLower(GetEnvString(key))
	return val == "1" || val == "true" || val == "yes"
}

func GetEnvInt(key string) int {
	val, err := strconv.Atoi(GetEnvString(key))
	if err != nil {
		log.Fatalf("Environment variable '%v' is an invalid int", key)
	}
	return val
}

func GetEnvString(key string) string {
	val, exists := os.LookupEnv(key)
	if !exists {
		log.Fatalf("Environment variable '%v' is required", key)
	}
	return val
}
