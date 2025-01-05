import * as constants from '@utils/constants';

export class ApiResponse {
	private readonly data: unknown;
	private readonly code: number;
	private readonly message: string;
	private readonly success: boolean;

	constructor(data: unknown, message: string = 'ok', code: number = constants.HTTP_STATUS_CODES.SUCCESSFUL.OK) {
		this.code = code;
		this.data = data;
		this.message = message;
		this.success = code < constants.HTTP_STATUS_CODES_RANGES.MIN_CLIENT_ERROR;
	}
}
