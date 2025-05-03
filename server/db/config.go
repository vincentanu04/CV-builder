package db

import (
	"fmt"
	"server/configs"
)

func GetPostgresConnString() string {
	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s/%s?sslmode=disable",
		configs.Envs.DBUser, configs.Envs.DBPasswd, configs.Envs.DBAddr, configs.Envs.DBName,
	)

	return dsn
}
