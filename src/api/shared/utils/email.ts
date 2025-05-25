import nodemailer from 'nodemailer';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { _env } from '@environment';
import { ISendApplicationEmail, ISendUserEmail } from '@interfaces';
import { BUCKET_NAME, generateFilePathForUser, s3Client } from '@utils';
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
			attachmentDetails = [],
			_id = '',
		} = params;

		const attachmentsKeys = attachmentDetails.map((attachment) => ({
			fileName: attachment.fileName,
			key: `${generateFilePathForUser({ _id, type: constants.S3_FILE_TYPES.USER_ATTACHMENT })}${attachment.fileName}`,
		}));

		const attachmentPromises = attachmentsKeys.map(async (attachment) => {
			const s3Response = await s3Client.send(
				new GetObjectCommand({
					Bucket: BUCKET_NAME,
					Key: attachment.key,
				})
			);

			return {
				filename: attachment.fileName,
				content: s3Response.Body as any,
				contentType: s3Response.ContentType,
			};
		});

		const attachments = await Promise.all(attachmentPromises);
		const emailOptionsWithAttachments = { ...emailOptions, attachments };

		const transporter = nodemailer.createTransport({
			host,
			port,
			secure: port == constants.SMTP_PORTS.FOUR_SIX_FIVE, // true for port 465, false for other ports
			auth: {
				user: emailId,
				pass,
			},
		});
		await transporter.sendMail(emailOptionsWithAttachments);
	} catch (error) {
		console.log('Error While sending email :: ', error);
	}
};
