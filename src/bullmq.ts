import nodemailer from 'nodemailer';
import { Queue, Worker } from 'bullmq';

import { _env } from '@environment';
import * as constants from '@utils/constants';

const redisConnectionOptions = {
	host: String(_env.get('REDIS_HOST')),
	port: Number(_env.get('REDIS_PORT')),
};

// TODO: REVIEW SHOULD WE CREATE A SINGLETON CLASS QUEUE_MANAGER/MESSAGING_QUEUE_MANAGER
// Create a new connection in every instance

const emailQueue = new Queue(constants.MESSAGING_QUEUES.EMAIL, {
	connection: redisConnectionOptions,
	defaultJobOptions: {
		attempts: 3,
		backoff: {
			type: 'fixed',
			delay: constants.TIME.MS.SECOND * 30, // retry after 30 seconds
		},
	},
});

// TODO: handle how to manage spinning more workers on demand

const emailWorker = new Worker(
	constants.MESSAGING_QUEUES.EMAIL,
	async (job: any) => {
		// console.log('job:: ', job);
		// console.log({
		// 	worker: job.name,
		// 	data: job.data,
		// 	time: new Date().getTime(),
		// });

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

		const info = await transporter.sendMail(job.data.emailPayLoad);

		// console.log('info :: ', info);
	},
	{
		connection: redisConnectionOptions,
	}
);

// console.log('emailWorker :: ', emailWorker);

export const messagingQueues = { emailQueue };
