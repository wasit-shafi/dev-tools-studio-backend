// For more info refer below link:
// https://www.mongodb.com/docs/manual/reference/error-codes/
// https://github.com/mongodb/mongo/blob/a21c7c7e0d0dcd7bd9b11d62f95ec6496bc617e8/src/mongo/base/error_codes.err#L273

export const MONGODB_ERRORS = {
	DUPLICATE_KEY: 11000,
	NETWORK_ERROR: 89,
	UNAUTHORIZED: 13,
} as const;
