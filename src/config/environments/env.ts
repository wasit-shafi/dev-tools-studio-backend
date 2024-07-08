// TODO: handle injected env by some other service (not added in  __env object)
const __env: Record<string, string | number | undefined> = {
	// MONGO_SERVICE_NAME is only used when running from docker only for dev mode (environment variable injected from docker-compose.yml)
	DATABASE_URI:
		process.env.TS_NODE_DEV && process.env.MONGO_SERVICE_NAME
			? process.env.MONGO_SERVICE_NAME
			: process.env.DATABASE_URI,
	PORT: process.env.PORT,
	CORS_ORIGIN: process.env.CORS_ORIGIN,
	NODE_ENV: process.env.NODE_ENV,
	TS_NODE_DEV: process.env.TS_NODE_DEV,
	NODE_MAILER_TRANSPORTER_AUTH_USER: process.env.NODE_MAILER_TRANSPORTER_AUTH_USER,
	NODE_MAILER_TRANSPORTER_AUTH_PASS: process.env.NODE_MAILER_TRANSPORTER_AUTH_PASS,
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
