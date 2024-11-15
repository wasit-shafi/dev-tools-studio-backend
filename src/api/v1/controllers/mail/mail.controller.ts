import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { _env } from '@environment';
import { ApiError, messages } from '@api/shared/utils';
import * as constants from '@utils/constants';
import { emailQueue } from '@messageQueue';

const sendMail: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	try {
		const { to, subject, salutation, body, closing, signature, dateTimeLocal, confirmationMail } = request.body;

		const targetDateAndTime = new Date(dateTimeLocal);
		const delay = Number(targetDateAndTime) - Number(new Date());

		if (delay < 0) {
			return next(new ApiError(messages.COMMON.INVALID_DATE_AND_TIME, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_ACCEPTABLE));
		}

		const html = `<p>\
										<b>SALUTATION:</b> ${salutation}<br/>\
										<b>BODY:</b><pre>${body}</pre><br/>\
										<b>CLOSING:</b> ${closing}<br/>\
										<b>SIGNATURE:</b> ${signature}<br/>\
										<b>DATE:</b>	${targetDateAndTime.toString()}<br/>\
										<b>DATE TIME LOCAL:</b>	${dateTimeLocal}\
									</p>`;

		const emailPayload = {
			from: `Wasit Shafi 👻<${_env.get('NODE_MAILER_TRANSPORTER_AUTH_USER')}>`, // sender address
			to,
			subject,
			html,
		};

		const task = await emailQueue.add(
			constants.MESSAGING_QUEUES.EMAIL,
			{
				emailPayload,
				confirmationMail,
			},
			{ delay }
		);
		// console.log('task :: ', task);

		response.json({ message: messages.BULL_MQ.EMAIL.EMAIL_SCHEDULED_SUCCESS });
	} catch (error) {
		next(new ApiError(error as string, constants.HTTP_STATUS_CODES.SERVER_ERROR.SERVER_ERROR));
	}
};

export const mailController = {
	sendMail,
};
