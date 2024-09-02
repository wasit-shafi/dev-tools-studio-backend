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

const TIME: Record<string, Record<string, number>> = {
	MS: {
		SECOND: 1000,
		MINUTE: 1000 * 60,
		HOUR: 1000 * 60 * 60,
		DAY: 1000 * 60 * 60 * 24,
		MONTH: 1000 * 60 * 60 * 24 * 30, // 30 DAYS
		YEAR: 1000 * 60 * 60 * 24 * 30 * 365, // 365 DAYS - NON LEAP YEARS
	},
};

const DEFAULT_COOKIE_EXPIRY = TIME.MS.DAY * 15; // 15 DAYS

const MODEL_NAMES: Record<string, string> = {
	USER: 'User',
	ROLE: 'Role',
	DEV_TOOL: 'DevTool',
	EMAIL_TEMPLATE: 'EmailTemplate',
} as const;

// const STATUS_TYPES: Record<string, string> = {
// 	FAIL: 'fail', // used for client side errors - 4XX
// 	ERROR: 'error', // used for server side errors - 5XX
// 	OK: 'ok', // used for all other types of responses other than 4xx or 5xx
// } as const;

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
		TOO_MANY_REQUESTS: 429,
	},
	// Server Error - 5XX

	SERVER_ERROR: {
		INTERNAL_SERVER_ERROR: 500,
		SERVICE_UNAVAILABLE: 503,
		SMTP_ERROR: 554,
	},
} as const;
// TODO: Review where to use the db constants or should we prefer enums

const USER_ROLES: Record<string, number> = {
	SUPER_ADMIN: 1,
	ADMIN: 2,
	APP_USER: 3,
} as const;

export {
	DATABASE_NAME,
	DEFAULT_COOKIE_EXPIRY,
	HTTP_STATUS_CODES,
	HTTP_STATUS_CODES_RANGES,
	MODEL_NAMES,
	ROUTES,
	SALT_ROUNDS_FOR_PASSWORD,
	// STATUS_TYPES,
	TIME,
	USER_ROLES,
};
