import * as constants from '@utils/constants';

export class ApiResponse {
	private readonly code: number;
	private readonly data: unknown;
	private readonly success: boolean;

	private readonly message: string;

	/**
	 *
	 * @param message - standard api response.message of type string
	 * @param code - standard api response.code of type number (http status codes 1XX/2XX/3XX)
	 * @param data - standard api response.data of type unknown
	 */
	constructor(message: string, code: number, data: unknown = null) {
		this.success = code < constants.HTTP_STATUS_CODES_RANGES.MIN_CLIENT_ERROR;
		this.code = code;
		this.message = message;
		this.data = data;
	}
}
