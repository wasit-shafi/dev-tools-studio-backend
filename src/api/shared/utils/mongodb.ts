// For more info refer below link:
// https://www.reddit.com/r/mongodb/comments/1ickeqb/import_mongodb_error_codes_mongodb_error_codes_in/
// https://www.mongodb.com/community/forums/t/import-mongodb-error-codes-mongodb-error-codes-in-javascript/310945
// https://www.mongodb.com/docs/manual/reference/error-codes/

export const  MONGODB_ERROR_CODES = {
	DUPLICATE_KEY : 11000
} as const satisfies Record<string, number>;
