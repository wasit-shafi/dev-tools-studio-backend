const DATABASE_NAME: string = 'dev-tools-studio';

const SALT_ROUNDS_FOR_PASSWORD: number = 10;

const ROUTES: Record<string, string> = {
	LOGIN: '/login',
	LOGOUT: '/logout',
} as const;

const MODEL_NAMES: Record<string, string> = {
	USER: 'User',
} as const;

const STATUS_TYPES: Record<string, string> = {
	FAIL: 'fail', // used for client side errors - 4XX
	ERROR: 'error', // used for server side errors - 5XX
	OK: 'ok', // used for all other types of responses other than 4xx or 5xx
} as const;

const HTTP_STATUS_CODES_RANGES: Record<string, number> = {
	MIN_INFORMATION: 100,
	MAX_INFORMATION: 199,

	MIN_SUCCESSFUL: 200,
	MAX_SUCCESSFUL: 299,

	MIN_REDIRECTION: 300,
	MAX_REDIRECTION: 399,

	MIN_CLIENT_ERROR: 400,
	MAX_CLIENT_ERROR: 499,

	MIN_SERVER_ERROR: 500,
	MAX_SERVER_ERROR: 599,
} as const;

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
} as const;

export {
	DATABASE_NAME,
	HTTP_STATUS_CODES,
	HTTP_STATUS_CODES_RANGES,
	MODEL_NAMES,
	ROUTES,
	SALT_ROUNDS_FOR_PASSWORD,
	STATUS_TYPES,
};
