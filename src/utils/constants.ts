const DATABASE_NAME: string = 'dev-tools-studio';

const SALT_ROUNDS_FOR_PASSWORD: number = 10;

const ROUTES: Record<string, string> = {
	LOGIN: '/login',
	LOGOUT: '/logout',
};

const MODEL_NAMES: Record<string, string> = {
	USER: 'User',
};

const HTTP_STATUS_CODES: Record<string, number> = {
	// Information - 1XX

	// Successful - 2XX

	OK: 200,
	CREATED: 201,

	// Redirection - 3XX

	// Client Error - 4XX

	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	NOT_FOUND: 404,

	// Server Error - 5XX

	INTERNAL_SERVER_ERROR: 500,
	SERVICE_UNAVAILABLE: 503,
};

export {
	DATABASE_NAME,
	HTTP_STATUS_CODES,
	MODEL_NAMES,
	ROUTES,
	SALT_ROUNDS_FOR_PASSWORD,
};
