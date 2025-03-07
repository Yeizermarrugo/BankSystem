import dotenv from "dotenv";
import * as path from "path";
import { Dialect } from "sequelize";
dotenv.config({ path: path.resolve(__dirname, ".env") });

interface DBConfig {
	dialect: Dialect;
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	define: {
		timestamps: boolean;
		underscored: boolean;
		underscoredAll: boolean;
	};
	dialectOptions?: {
		ssl?: {
			require: boolean;
			rejectUnauthorized: boolean;
		};
	};
}

interface Config {
	api: {
		port: number;
		host: string;
		nodeEnv: string;
		secretOrKey?: string;
	};
	db: {
		development: DBConfig;
		production: DBConfig;
		testing: DBConfig;
	};
}

export const configs: Config = {
	api: {
		port: Number(process.env.PORT) || 5000,
		host: process.env.HOST || "http://localhost:5000",
		nodeEnv: process.env.NODE_ENV || "development",
		secretOrKey: process.env.JWT_SECRET || "userService"
	},
	db: {
		development: {
			dialect: "postgres",
			host: "localhost",
			port: 5432,
			username: "postgres",
			password: "1234",
			database: "notifications",
			define: {
				timestamps: true,
				underscored: true,
				underscoredAll: true
			}
		},
		production: {
			dialect: "postgres",
			host: process.env.DB_HOST || "",
			port: Number(process.env.DB_PORT) || 5432,
			username: process.env.DB_USER || "",
			password: process.env.DB_PASSWORD || "",
			database: process.env.DB_NAME || "",
			define: {
				timestamps: true,
				underscored: true,
				underscoredAll: true
			},
			dialectOptions: {
				ssl: {
					require: true,
					rejectUnauthorized: false
				}
			}
		},
		testing: {
			dialect: "postgres",
			host: "localhost",
			port: 5432,
			username: "postgres",
			password: "1234",
			database: "",
			define: {
				timestamps: true,
				underscored: true,
				underscoredAll: true
			}
		}
	}
};

