import nodemailer from 'nodemailer';

import { _env } from '@environment';

interface IMailOptions {
	from: string;
	to: string;
	subject: string;
	html?: string;
	text?: string;
}

const nodemailerTransport = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	// Use `true` for port 465, `false` for all other ports
	secure: true,
	auth: {
		user: _env.get('NODE_MAILER_TRANSPORT_AUTH_USER') as string,
		pass: _env.get('NODE_MAILER_TRANSPORT_AUTH_PASS') as string,
	},
});

export const sendMail = async (params: IMailOptions) => {
	const info = await nodemailerTransport.sendMail(params);
	// console.log('info :: ', info);
};
