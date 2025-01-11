package configs

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port string
	DBUser string
	DBPasswd string
	DBAddr string
	DBName string
}

var Envs = initConfig()

func initConfig() Config {
	godotenv.Load()

	return Config{
		Port: getEnv("PORT", "8080"),
		DBUser: getEnv("DB_User", "root"),
		DBPasswd: getEnv("DB_Passwd", ""),
		DBAddr: fmt.Sprintf("%s:%s", getEnv("DB_Host", "127.0.0.1"), getEnv("DB_Port", "3306")),
		DBName: getEnv("DB_Name", "cvbuilder"),
	}
}

func getEnv(key string, fallback string) string {
	value, ok := os.LookupEnv(key)
	if ok {
		return value
	}

	return fallback
}