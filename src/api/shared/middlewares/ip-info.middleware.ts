import { NextFunction, Request, RequestHandler, Response } from 'express';
import { IPinfoWrapper } from 'node-ipinfo';

import { _env } from '@environment';
import * as constants from '@utils/constants';

export const ipInfo: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	try {
		// For more info refer:
		// https://github.com/expressjs/express/issues/3030
		// https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1

		const prefix = '::ffff:';
		let ip: string = _env.get('NODE_ENV') === constants.NODE_ENV.DEVELOPMENT ? constants.mockIpSelector() : (request.ip ?? '');

		ip = ip.startsWith(prefix) ? ip.substring(prefix.length) : ip;

		const ipInfoWrapper = new IPinfoWrapper(String(_env.get('IP_INFO_ACCESS_TOKEN')));
		const ipInfo = await ipInfoWrapper.lookupIp(ip);

		request.ipInfo = ipInfo || null;
	} catch (error: unknown) {
		console.log('Error while injecting Ipinfo :: ', error);

		request.ipInfo = null;
	}

	next();
};
