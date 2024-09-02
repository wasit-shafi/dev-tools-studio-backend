// TODO: handle injected env by some other service (not added in  __env object)
const __env: Record<string, string | number | undefined> = {
	// MONGO_SERVICE_NAME is only used when running from docker only for dev mode (environment variable injected from docker-compose.yml)

	DATABASE_URI: process.env.TS_NODE_DEV && process.env.MONGO_SERVICE_NAME ? process.env.MONGO_SERVICE_NAME : process.env.DATABASE_URI,
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,

	CORS_ORIGIN: process.env.CORS_ORIGIN,

	API_RATE_LIMITER_THRESHOLD_LIMIT: process.env.API_RATE_LIMITER_THRESHOLD_LIMIT,
	API_RATE_LIMITER_THRESHOLD_LIMIT_STRICT: process.env.API_RATE_LIMITER_THRESHOLD_LIMIT_STRICT,
	API_RATE_LIMITER_WINDOW_IN_MINUTE: process.env.API_RATE_LIMITER_WINDOW_IN_MINUTE,
	API_RATE_LIMITER_WINDOW_IN_MINUTE_STRICT: process.env.API_RATE_LIMITER_WINDOW_IN_MINUTE_STRICT,
	API_RATE_LIMITER_IP_WHITELIST: process.env.API_RATE_LIMITER_IP_WHITELIST,

	TS_NODE_DEV: process.env.TS_NODE_DEV,

	NODE_MAILER_TRANSPORTER_AUTH_USER: process.env.NODE_MAILER_TRANSPORTER_AUTH_USER,
	NODE_MAILER_TRANSPORTER_AUTH_PASS: process.env.NODE_MAILER_TRANSPORTER_AUTH_PASS,

	SALT_ROUNDS: process.env.SALT_ROUNDS,

	ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
	REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,

	AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
	AWS_S3_BUCKET_REGION: process.env.AWS_S3_BUCKET_REGION,
	AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
};

export const _env = {
	get(key: string): string | number | undefined {
		if (!key || typeof key !== 'string') {
			throw new Error("Key should be of type 'string'(length >= 0) for accessing environment variables");
		}

		if (!Object.keys(__env).includes(key)) {
			// throw new Error('Invalid key for accessing environment variables');

			if (Object.keys(process.env).includes(key)) {
				return process.env[key];
			}

			console.error('Invalid key for accessing environment variables, key = ', key);
		}

		//  may return undefined, as i have avoided throwing error now
		return __env[key];
	},
};
