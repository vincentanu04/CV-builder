package db

import (
	"server/configs"

	"github.com/go-sql-driver/mysql"
)

func GetMySQLConfig() mysql.Config {
	return mysql.Config{
		User:                 configs.Envs.DBUser,
		Passwd:               configs.Envs.DBPasswd,
		Addr:                 configs.Envs.DBAddr,
		DBName:               configs.Envs.DBName,
		Net:                  "tcp",
		AllowNativePasswords: true,
		ParseTime:            true,
	}
}
