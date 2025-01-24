import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { ApiError, messages } from '@api/shared/utils';
import { _env } from '@environment';
import { emailQueue } from '@messageQueue';
import * as constants from '@utils/constants';

const sendMail: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	try {
		const { to, subject, salutation, body, closing, signature, dateTimeLocal, confirmationMail } = request.body;

		const targetDateAndTime = new Date(dateTimeLocal);
		const delay = Number(targetDateAndTime) - Number(new Date());

		if (delay < 0) {
			next(new ApiError(messages.SHARED.INVALID_DATE_AND_TIME, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_ACCEPTABLE));
			return;
		}

		const html = `<p>\
										<b>SALUTATION:</b> ${salutation}<br/>\
										<b>BODY:</b><pre>${body}</pre><br/>\
										<b>CLOSING:</b> ${closing}<br/>\
										<b>SIGNATURE:</b> ${signature}<br/>\
										<b>DATE:</b>	${targetDateAndTime.toString()}<br/>\
										<b>DATE TIME LOCAL:</b>	${dateTimeLocal}\
									</p>`;

		const emailOptions = {
			from: `Wasit Shafi 👻<${_env.get('NODE_MAILER_TRANSPORT_AUTH_USER')}>`, // sender address
			to,
			subject,
			html,
		};

		const task = await emailQueue.add(
			constants.MESSAGING_QUEUES.EMAIL,
			{
				emailOptions,
				confirmationMail,
			},
			{ delay }
		);
		// console.log('task :: ', task);

		response.json({ message: messages.BULL_MQ.EMAIL.EMAIL_SCHEDULED_SUCCESS });
	} catch (error: unknown) {
		next(new ApiError(messages.SHARED.SMTP_ERROR, constants.HTTP_STATUS_CODES.SERVER_ERROR.SMTP_ERROR));
		return;
	}
};

export const mailController = {
	sendMail,
};
