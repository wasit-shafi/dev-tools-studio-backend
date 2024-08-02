import * as constants from '@utils/constants';

export class ApiError extends Error {
	status: string = '';
	code: number = 0;
	isOperational: boolean = false;
	data: any = {};

	constructor(message: string, code: number, data: any = null) {
		super(message); // calling the constructor of base Error class
		this.data = data;
		this.code = code;
		// TODO(review): if there is any need of status when we are already sending code in response
		// this.status =
		// 	code >= constants.HTTP_STATUS_CODES_RANGES.MIN_CLIENT_ERROR && code <= constants.HTTP_STATUS_CODES_RANGES.MAX_CLIENT_ERROR
		// 		? constants.STATUS_TYPES.FAIL
		// 		: constants.STATUS_TYPES.ERROR;

		// We are using this custom error class only for the operational error types, for more info refer: https://www.youtube.com/watch?v=BZPrK1nQcFI&list=PL1BztTYDF-QPdTvgsjf8HOwO4ZVl_LhxS&index=92
		this.isOperational = true;

		// capturing the base class stack trace in our custom ApiError class, instead of creating a new property

		Error.captureStackTrace(this, this.constructor);
	}
}
