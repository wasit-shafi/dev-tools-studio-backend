import nodemailer from 'nodemailer';

import { _env } from '@environment';
import { ISendApplicationEmail, ISendUserEmail } from '@interfaces';
import { logger } from '@utils';
import * as constants from '@utils/constants';

const emailServiceTransporter = nodemailer.createTransport({
	host: String(_env.get('EMAIL_SERVICE_SMTP_HOST_SERVER')),
	port: Number(_env.get('EMAIL_SERVICE_SMTP_PORT')),
	secure: Number(_env.get('EMAIL_SERVICE_SMTP_PORT')) == constants.SMTP_PORTS.FOUR_SIX_FIVE, // true for port 465, false for other ports
	auth: {
		user: String(_env.get('EMAIL_SERVICE_SMTP_USER')),
		pass: String(_env.get('EMAIL_SERVICE_SMTP_PASSWORD')),
	},
});

export const sendApplicationEmail = async (params: ISendApplicationEmail) => {
	try {
		await emailServiceTransporter.sendMail(params.emailOptions);
	} catch (error) {
		console.log('Error While sending email :: ', error);
	}
};

export const sendUserEmail = async (params: ISendUserEmail) => {
	try {
		const {
			credential: { host, port, emailId, pass },
			emailOptions,
		} = params;

		const transporter = nodemailer.createTransport({
			host,
			port,
			secure: port == constants.SMTP_PORTS.FOUR_SIX_FIVE, // true for port 465, false for other ports
			auth: {
				user: emailId,
				pass,
			},
		});

		await transporter.sendMail(emailOptions);
	} catch (error) {
		console.log('Error While sending email :: ', error);
	}
};
