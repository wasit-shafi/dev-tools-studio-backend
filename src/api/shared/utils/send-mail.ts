import nodemailer from 'nodemailer';

import { _env } from '@environment';
import { IMailOptions } from '@interfaces';
import { logger } from '@utils';
import * as constants from '@utils/constants';

const emailServiceTransport = nodemailer.createTransport({
	host: String(_env.get('EMAIL_SERVICE_SMTP_HOST_SERVER')),
	port: Number(_env.get('EMAIL_SERVICE_SMTP_PORT')),
	secure: Number(_env.get('EMAIL_SERVICE_SMTP_PORT')) == constants.SMTP_PORTS.FOUR_SIX_FIVE, // true for port 465, false for other ports
	auth: {
		user: String(_env.get('EMAIL_SERVICE_SMTP_USER')),
		pass: String(_env.get('EMAIL_SERVICE_SMTP_PASSWORD')),
	},
});

export const sendMail = async (params: IMailOptions) => {
	try {
		const info = await emailServiceTransport.sendMail(params);
	} catch (error) {
		console.log('Error While sending email :: ', error);
	}
};
