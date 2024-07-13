import nodemailer from 'nodemailer';

import { type RequestHandler } from 'express';

import { _env } from '@environment';

const sendMail: RequestHandler = async (request, response) => {
	const { to = '', subject = '', salutation = '', body = '', closing = '', signature = '' } = request.body;

	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true, // Use `true` for port 465, `false` for all other ports
		auth: {
			user: _env.get('NODE_MAILER_TRANSPORTER_AUTH_USER') as string,
			pass: _env.get('NODE_MAILER_TRANSPORTER_AUTH_PASS') as string,
		},
	});

	const payLoad = {
		from: `Wasit Shafi 👻<${_env.get('NODE_MAILER_TRANSPORTER_AUTH_USER')}>`, // sender address
		to,
		subject,
		text: `${salutation} \n ${body} \n ${closing} \n ${signature}`,
	};
	const info = await transporter.sendMail(payLoad);

	response.json({ message: `Message sent: ${info.messageId}` });
};

export const mailController = {
	sendMail,
};
