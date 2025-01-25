import * as constants from '@utils/constants';

export class ApiResponse {
	private readonly code: number;
	private readonly data: unknown;
	private readonly success: boolean;

	private readonly message: string;

	constructor(data: unknown, message: string = 'ok', code: number = constants.HTTP_STATUS_CODES.SUCCESSFUL.OK) {
		this.success = code < constants.HTTP_STATUS_CODES_RANGES.MIN_CLIENT_ERROR;
		this.code = code;
		this.message = message;
		this.data = data;
	}
}
