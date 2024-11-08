export const DATABASE_NAME: string = 'dev-tools-studio';

export const SALT_ROUNDS_FOR_PASSWORD: number = 10;

export const OTP_LENGTH: number = 6;

export const NODE_ENV = {
	PRODUCTION: 'production',
	DEVELOPMENT: 'development',
} as const;

export const RE_CAPTCHA_SITE_VERIFY_BASE_URL: string = 'https://www.google.com/recaptcha/api/siteverify';

// TODO: check correct way for defining object of objects or string
// { [key: string]: string }
// const ROUTES: { [key: string]: string | { [key: string]: string } } = {
// const ROUTES: Record<string, string | Record<string, string>> = {
export const ROUTES = {
	// LOGIN: '/login',
	// LOGOUT: '/logout',
	USER: '/user',
	MAIL: '/mail',
	AUTH: '/auth',

	AUTH_ROUTES: {
		SIGNUP: '/signup',
		SIGNIN: '/signin',
		SIGNOUT: '/signout',
		RESET_PASSWORD: '/reset-password',
	},
} as const;

export const TIME: Record<string, Record<string, number>> = {
	MS: {
		SECOND: 1000,
		MINUTE: 1000 * 60,
		HOUR: 1000 * 60 * 60,
		DAY: 1000 * 60 * 60 * 24,
		MONTH: 1000 * 60 * 60 * 24 * 30, // 30 DAYS
		YEAR: 1000 * 60 * 60 * 24 * 30 * 365, // 365 DAYS - NON LEAP YEARS
	},
};

export const DEFAULT_COOKIE_EXPIRY = TIME.MS.DAY * 15; // 15 DAYS

export const MODEL_NAMES: Record<string, string> = {
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

export let HTTP_STATUS_CODES_RANGES: Record<string, number> = {
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

export const HTTP_STATUS_CODES: Record<string, Record<string, number>> = {
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
		FORBIDDEN: 403,
		NOT_FOUND: 404,
		NOT_ACCEPTABLE: 406,
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

export const USER_ROLES: Record<string, number> = {
	SUPER_ADMIN: 1,
	ADMIN: 2,
	APP_USER: 3,
} as const;

export const MESSAGING_QUEUES: Record<string, string> = {
	EMAIL: 'EMAIL',
} as const;

export const BACKOFF_STRATEGY_TYPE = {
	FIXED: 'fixed',
	EXPONENTIAL: 'exponential', // retry after '2 ^ (attempts - 1) * delay' milliseconds
};
