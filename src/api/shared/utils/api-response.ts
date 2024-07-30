import * as constants from '@utils/constants';

class ApiResponse {
	private data: any;
	private code: number;
	private message: string;
	private success: boolean;

	constructor(
		data: any,
		message: string = constants.STATUS_TYPES.OK,
		code: number = constants.HTTP_STATUS_CODES.INFORMATIONAL.OK
	) {
		this.code = code;
		this.data = data;
		this.message = message;
		this.success = code < constants.HTTP_STATUS_CODES_RANGES.MIN_CLIENT_ERROR;
	}
}

export { ApiResponse };
