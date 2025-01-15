package configs

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	DBUser             string
	DBPasswd           string
	DBAddr             string
	DBName             string
	JWTSecret          string
	JWTExpirationInSec int64
}

var Envs = initConfig()

func initConfig() Config {
	err := godotenv.Load()
	if err != nil {
		log.Println(err)
	}

	config := Config{
		Port:               getEnv("PORT", "8080"),
		DBUser:             getEnv("DB_USER", "root"),
		DBPasswd:           getEnv("DB_PASSWD", ""),
		DBAddr:             fmt.Sprintf("%s:%s", getEnv("DB_HOST", "127.0.0.1"), getEnv("DB_PORT", "3306")),
		DBName:             getEnv("DB_NAME", "cv_builder"),
		JWTSecret:          getEnv("JWT_SECRET", "no-fallback"),
		JWTExpirationInSec: getEnvInt("JWT_EXPIRATION_IN_SEC", 3600*24),
	}
	log.Printf("with config %+v", config)

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
