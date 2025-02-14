// TODO(WASIT): handle injected env by some other service (not added in  __env object)

const __env = {
	// MONGO_SERVICE_NAME is only used when running from docker only for dev mode (environment variable injected from docker-compose.yml)

	DATABASE_URI: process.env.TS_NODE_DEV && process.env.MONGO_SERVICE_NAME ? process.env.MONGO_SERVICE_NAME : process.env.DATABASE_URI,
	EXPRESS_PORT: process.env.EXPRESS_PORT,
	NODE_ENV: process.env.NODE_ENV,

	CORS_ORIGIN: process.env.CORS_ORIGIN,

	API_RATE_LIMITER_THRESHOLD_LIMIT: process.env.API_RATE_LIMITER_THRESHOLD_LIMIT,
	API_RATE_LIMITER_THRESHOLD_LIMIT_STRICT: process.env.API_RATE_LIMITER_THRESHOLD_LIMIT_STRICT,
	API_RATE_LIMITER_WINDOW_IN_MINUTE: process.env.API_RATE_LIMITER_WINDOW_IN_MINUTE,
	API_RATE_LIMITER_WINDOW_IN_MINUTE_STRICT: process.env.API_RATE_LIMITER_WINDOW_IN_MINUTE_STRICT,
	API_RATE_LIMITER_IP_WHITELIST: process.env.API_RATE_LIMITER_IP_WHITELIST,

	TS_NODE_DEV: process.env.TS_NODE_DEV,

	NODE_MAILER_TRANSPORT_AUTH_USER: process.env.NODE_MAILER_TRANSPORT_AUTH_USER,
	NODE_MAILER_TRANSPORT_AUTH_PASS: process.env.NODE_MAILER_TRANSPORT_AUTH_PASS,

	SALT_ROUNDS: process.env.SALT_ROUNDS,

	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
	REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,

	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

	AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
	AWS_S3_BUCKET_REGION: process.env.AWS_S3_BUCKET_REGION,

	AWS_SNS_REGION: process.env.AWS_SNS_REGION,

	REDIS_HOST: process.env.TS_NODE_DEV && process.env.REDIS_SERVICE_NAME ? process.env.REDIS_SERVICE_NAME : process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT,
	REDIS_USER_PASSWORD: process.env.REDIS_USER_PASSWORD,

	RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,

	FE_BASE_URL: process.env.FE_BASE_URL,

	IP_INFO_ACCESS_TOKEN: process.env.IP_INFO_ACCESS_TOKEN,

	GEOAPIFY_API_KEY: process.env.GEOAPIFY_API_KEY,
} as const;

export const _env = {
	get(key: keyof typeof __env): string {
		// if (!key || typeof key !== 'string') {
		// 	throw new Error("Key should be of type 'string'(length >= 0) for accessing environment variables");
		// }

		// if (!(key in __env)) {
		// 	if (key in process.env) {
		// 		return process.env[key];
		// 	}

		// 	throw new Error(`Invalid key for accessing environment variables, key =${key}`);
		// }

		return __env[key] ?? '';
	},
};
