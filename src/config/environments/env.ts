const _env: Record<string, string | number | undefined> = {
	DATABASE_URI: process.env.DATABASE_URI,
	PORT: process.env.PORT,
	CORS_ORIGIN: process.env.CORS_ORIGIN,
};

export const env = {
	get(key: string): string | number | undefined {
		if (!key || typeof key !== 'string') {
			throw new Error(
				"Key should be of type 'string'(length >= 0) for accessing environment variables"
			);
		}

		if (!Object.keys(_env).includes(key)) {
			throw new Error('Invalid key for accessing environment variables');
		}

		return _env[key];
	},
};
