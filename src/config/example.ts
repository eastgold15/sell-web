/**
 * 环境配置使用示例
 * 展示如何在应用中使用 EnvConfig
 */

import { envConfig } from "./env.ts";

// 示例：在应用启动时配置环境
export function initializeApp() {
	// 1. 手动加载特定环境配置
	envConfig.loadConfig({
		environment: "development", // 或 "production", "test"
		override: false, // 是否覆盖已存在的环境变量
	});

	// 2. 使用自定义路径加载配置
	// envConfig.loadConfig({
	//   customPath: "/path/to/custom/.env"
	// });

	// 3. 获取环境信息
	const envInfo = envConfig.getEnvironmentInfo();
	console.log("🌍 环境信息:", envInfo);
}

// 示例：获取配置值
export function getAppConfig() {
	return {
		// 基本字符串配置
		appName: envConfig.get("APP_NAME", "MechanicEndWorld"),
		appHost: envConfig.get("APP_HOST", "localhost"),
		corsOrigin: envConfig.get("CORS_ORIGIN", "http://localhost:9002"),

		// 数字类型配置
		appPort: envConfig.getNumber("APP_PORT", 9003),
		redisPort: envConfig.getNumber("REDIS_PORT", 6379),
		maxFileSize: envConfig.getNumber("MAX_FILE_SIZE", 10485760),

		// 布尔类型配置
		debugMode: envConfig.getBoolean("DEBUG", false),
		enableSwagger: envConfig.getBoolean("ENABLE_SWAGGER", true),

		// 数据库配置
		database: {
			url: envConfig.get("DATABASE_URL"),
			user: envConfig.get("DB_USER", "app_user"),
			password: envConfig.get("DB_PASSWORD", "app_pass"),
			host: envConfig.get("DB_HOST", "localhost"),
			port: envConfig.getNumber("DB_PORT", 5432),
			name: envConfig.get("DB_NAME", "MechanicEndWorld"),
		},

		// Redis配置
		redis: {
			host: envConfig.get("REDIS_HOST", "localhost"),
			port: envConfig.getNumber("REDIS_PORT", 6379),
			password: envConfig.get("REDIS_PASSWORD"),
			url: envConfig.get("REDIS_URL"),
		},

		// JWT配置
		jwt: {
			secret: envConfig.get("JWT_SECRET", "default_secret"),
			expiresIn: envConfig.get("JWT_EXPIRES_IN", "24h"),
		},

		// 文件上传配置
		upload: {
			dir: envConfig.get("UPLOAD_DIR", "./public/uploads"),
			maxSize: envConfig.getNumber("MAX_FILE_SIZE", 10485760),
		},
	};
}

// 示例：环境特定的配置
export function getEnvironmentSpecificConfig() {
	const environment = envConfig.get("NODE_ENV", "development");

	switch (environment) {
		case "production":
			return {
				logLevel: "error",
				enableDebug: false,
				enableSwagger: false,
				cacheEnabled: true,
			};
		case "test":
			return {
				logLevel: "silent",
				enableDebug: false,
				enableSwagger: false,
				cacheEnabled: false,
			};
		default: // development
			return {
				logLevel: "debug",
				enableDebug: true,
				enableSwagger: true,
				cacheEnabled: false,
			};
	}
}

// 示例：验证配置完整性
export function validateConfiguration() {
	const config = getAppConfig();
	const errors: string[] = [];

	// 验证必需配置
	if (!config.database.url) {
		errors.push("DATABASE_URL 未配置");
	}

	if (!config.jwt.secret || config.jwt.secret === "default_secret") {
		errors.push("JWT_SECRET 未配置或使用默认值");
	}

	if (config.appPort < 1 || config.appPort > 65535) {
		errors.push("APP_PORT 配置无效");
	}

	if (errors.length > 0) {
		console.error("❌ 配置验证失败:");
		errors.forEach((error) => console.error(`  - ${error}`));
		return false;
	}

	console.log("✅ 配置验证通过");
	return true;
}

// 示例：在不同模块中使用
export class DatabaseService {
	private config = getAppConfig().database;

	getConnectionString() {
		return (
			this.config.url ||
			`postgres://${this.config.user}:${this.config.password}@${this.config.host}:${this.config.port}/${this.config.name}`
		);
	}
}

export class RedisService {
	private config = getAppConfig().redis;

	getConnectionOptions() {
		return {
			host: this.config.host,
			port: this.config.port,
			password: this.config.password,
		};
	}
}
