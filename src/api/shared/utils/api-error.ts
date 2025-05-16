export class ApiError extends Error {
	private readonly code: number = 0;
	private readonly data: unknown = {};
	private readonly success: boolean = false;

	/**
	 *
	 * @param message - standard api error response.message of type string
	 * @param code - standard api error response.code of type number (http status error codes 4XX/5XX)
	 * @param data - standard api error response.data of type unknown
	 */
	constructor(message: string, code: number, data: unknown = null) {
		super(message); // calling the constructor of base Error class
		this.data = data;
		this.code = code;
		this.success = false;
		// capturing the base class stack trace in our custom ApiError class, instead of creating a new property

		Error.captureStackTrace(this, this.constructor);
	}
}
