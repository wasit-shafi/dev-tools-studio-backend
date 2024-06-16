const _config: Record<string, string | number | undefined> = {
	DATABASE_URI: process.env.DATABASE_URI,
	PORT: process.env.PORT,
};

export const config = {
	get(key: string): string | number | undefined {
		if (!key || typeof key !== 'string') {
			throw new Error(
				"Key should be of type 'string'(length >= 0) for accessing environment variables"
			);
		}

		if (!Object.keys(_config).includes(key)) {
			throw new Error('Invalid key for accessing environment variables');
		}

		return _config[key];
	},
};
