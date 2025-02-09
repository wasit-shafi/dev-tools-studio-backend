import type { Request, Response, NextFunction, RequestHandler } from 'express';

import { _env } from '@environment';
import { emailQueue } from '@messageQueue';
import { ApiError, getHeadersForAvoidMailGrouping, logger, MESSAGES } from '@utils';
import * as constants from '@utils/constants';

const sendMail: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
	try {
		const { to, subject, salutation, body, closing, signature, dateTimeLocal, confirmationMail } = request.body;

		const targetDateAndTime = new Date(dateTimeLocal);
		const delay = Number(targetDateAndTime) - Number(new Date());

		if (delay < 0) {
			next(new ApiError(MESSAGES.SHARED.INVALID_DATE_AND_TIME, constants.HTTP_STATUS_CODES.CLIENT_ERROR.NOT_ACCEPTABLE));
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
			headers: { ...getHeadersForAvoidMailGrouping() },
		};

		const task = await emailQueue.add(
			constants.MESSAGING_QUEUES.EMAIL,
			{
				emailOptions,
				confirmationMail,
			},
			{ delay }
		);
		// logger.info('sendMail :: ', { task });

		response.json({ message: MESSAGES.BULL_MQ.EMAIL.EMAIL_SCHEDULED_SUCCESS });
	} catch (error: unknown) {
		next(new ApiError(MESSAGES.SHARED.SMTP_ERROR, constants.HTTP_STATUS_CODES.SERVER_ERROR.SMTP_ERROR));
		return;
	}
};

export const mailController = {
	sendMail,
};
