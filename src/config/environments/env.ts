const __env: Record<string, string | number | undefined> = {
	DATABASE_URI: process.env.DATABASE_URI,
	PORT: process.env.PORT,
	CORS_ORIGIN: process.env.CORS_ORIGIN,
	NODE_ENV: process.env.NODE_ENV,
};

export const _env = {
	get(key: string): string | number | undefined {
		if (!key || typeof key !== 'string') {
			throw new Error(
				"Key should be of type 'string'(length >= 0) for accessing environment variables"
			);
		}

		if (!Object.keys(__env).includes(key)) {
			throw new Error('Invalid key for accessing environment variables');
		}

		return __env[key];
	},
};
