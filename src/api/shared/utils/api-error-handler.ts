import { HTTP_STATUS_CODES_RANGES, STATUS_TYPES } from '@utils';

export class ApiError extends Error {
	status: string = '';
	statusCode: number = 0;
	isOperational: boolean = false;

	constructor(message: string, statusCode: number) {
		super(message); // calling the constructor of base Error class

		this.statusCode = statusCode;
		this.status =
			statusCode >= HTTP_STATUS_CODES_RANGES.MIN_CLIENT_ERROR && statusCode <= HTTP_STATUS_CODES_RANGES.MAX_CLIENT_ERROR
				? STATUS_TYPES.FAIL
				: STATUS_TYPES.ERROR;

		// We are using this custom error class only for the operational error types, for more info refer: https://www.youtube.com/watch?v=BZPrK1nQcFI&list=PL1BztTYDF-QPdTvgsjf8HOwO4ZVl_LhxS&index=92
		this.isOperational = true;

		// capturing the base class stack trace in our custom ApiError class, instead of creating a new property

		Error.captureStackTrace(this, this.constructor);
	}
}
