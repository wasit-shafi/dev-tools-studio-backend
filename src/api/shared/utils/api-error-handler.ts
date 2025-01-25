export class ApiError extends Error {
	private readonly code: number = 0;
	private readonly data: unknown = {};
	private readonly success: boolean = false;

	private readonly isOperational: boolean = false;

	constructor(message: string, code: number, data: unknown = null) {
		super(message); // calling the constructor of base Error class
		this.data = data;
		this.code = code;
		this.success = false;

		// We are using this custom error class only for the operational error types, for more info refer: https://www.youtube.com/watch?v=BZPrK1nQcFI&list=PL1BztTYDF-QPdTvgsjf8HOwO4ZVl_LhxS&index=92

		// TODO(WASIT): review isOperational, is that really needed
		this.isOperational = true;

		// capturing the base class stack trace in our custom ApiError class, instead of creating a new property

		Error.captureStackTrace(this, this.constructor);
	}
}
