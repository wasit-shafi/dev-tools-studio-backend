const DATABASE_NAME: string = 'dev-tools-studio';

const SALT_ROUNDS_FOR_PASSWORD: number = 10;

// TODO: check correct way for defining object of objects or string
// { [key: string]: string }
// const ROUTES: { [key: string]: string | { [key: string]: string } } = {
// const ROUTES: Record<string, string | Record<string, string>> = {
const ROUTES = {
	// LOGIN: '/login',
	// LOGOUT: '/logout',
	USER: '/user',
	MAIL: '/mail',
	AUTH: '/auth',

	AUTH_ROUTER: {
		SIGNUP: '/signup',
		SIGNIN: '/signin',
		SIGNOUT: '/signout',
		RESET_PASSWORD: '/reset-password',
	},
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

const HTTP_STATUS_CODES: Record<string, Record<string, number>> = {
	// Information - 1XX

	INFORMATIONAL: {
		CREATED: 100,
	},
	// Successful - 2XX

	SUCCESSFUL: {
		OK: 200,
		CREATED: 201,
		ACCEPTED: 202,
		NO_CONTENT: 204,
	},
	// Redirection - 3XX

	REDIRECTION: {},
	// Client Error - 4XX

	CLIENT_ERROR: {
		BAD_REQUEST: 400,
		UNAUTHORIZED: 401,
		NOT_FOUND: 404,
		CONFLICT: 409,
		TOO_MANY_REQUESTS: 426,
	},
	// Server Error - 5XX

	SERVER_ERROR: {
		INTERNAL_SERVER_ERROR: 500,
		SERVICE_UNAVAILABLE: 503,
	},
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
