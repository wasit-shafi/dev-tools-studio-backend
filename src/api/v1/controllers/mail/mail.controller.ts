import nodemailer from 'nodemailer';

import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { _env } from '@environment';
import { ApiError } from '@api/shared/utils';
import * as constants from '@utils/constants';

const sendMail: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	try {
		const { to = '', subject = '', salutation = '', body = '', closing = '', signature = '', dateTimeLocal = '' } = request.body;
		const date = new Date(dateTimeLocal);

		// console.log({ dateTimeLocal, date });

		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 465,
			// Use `true` for port 465, `false` for all other ports
			secure: true,
			auth: {
				user: _env.get('NODE_MAILER_TRANSPORTER_AUTH_USER') as string,
				pass: _env.get('NODE_MAILER_TRANSPORTER_AUTH_PASS') as string,
			},
		});
		const html = `<p>\
										<b>SALUTATION:</b> ${salutation}<br/>\
										<b>BODY:</b><pre>${body}</pre><br/>\
										<b>CLOSING:</b> ${closing}<br/>\
										<b>SIGNATURE:</b> ${signature}<br/>\
										<b>DATE:</b>	${date.toString()}<br/>\
										<b>DATE TIME LOCAL:</b>	${dateTimeLocal}\
									</p>`;

		const payLoad = {
			from: `Wasit Shafi 👻<${_env.get('NODE_MAILER_TRANSPORTER_AUTH_USER')}>`, // sender address
			to,
			subject,
			html,
		};
		const info = await transporter.sendMail(payLoad);
		// console.log('info :: ', info);

		response.json({ message: `Email sent successfully ${info}` });
	} catch (error) {
		next(new ApiError(error as string, constants.HTTP_STATUS_CODES.SERVER_ERROR.SERVER_ERROR));
	}
};

export const mailController = {
	sendMail,
};
