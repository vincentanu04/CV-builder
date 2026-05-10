package configs

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	DatabaseURL        string
	JWTSecret          string
	JWTExpirationInSec int64
	Environment        string
}

var Envs = initConfig()

func initConfig() Config {
	if err := godotenv.Load("../.env.local"); err != nil {
		log.Println("No .env.local file found, reading env from environment")
	}

	config := Config{
		Port:               getEnv("PORT", "8080"),
		DatabaseURL:        getEnv("DATABASE_URL", ""),
		JWTSecret:          getEnv("JWT_SECRET", "no-fallback"),
		JWTExpirationInSec: getEnvInt("JWT_EXPIRATION_IN_SEC", 3600*24),
		Environment:        getEnv("ENVIRONMENT", "dev"),
	}
	return config
}

func getEnv(key string, fallback string) string {
	value, ok := os.LookupEnv(key)
	if ok {
		return value
	}
	return fallback
}

func getEnvInt(key string, fallback int64) int64 {
	value, ok := os.LookupEnv(key)
	if ok {
		i, err := strconv.ParseInt(value, 10, 64)
		if err != nil {
			return fallback
		}
		return i
	}
	return fallback
}


