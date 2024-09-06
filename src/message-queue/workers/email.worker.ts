import { Worker } from 'bullmq';

import * as constants from '@utils/constants';
import { redisConnectionConfig } from '@messageQueue';
import { sendMail } from '@api/shared/utils/send-mail';

// TODO: handle how to manage spinning more workers on demand

const emailWorker = new Worker(
	constants.MESSAGING_QUEUES.EMAIL,
	async (job: any) => {
		// console.log({
		// 	worker: job.name,
		// 	data: job.data,
		// 	time: new Date().getTime(),
		// 	// job,
		// });
		sendMail(job.data.emailPayLoad);
	},
	{
		connection: redisConnectionConfig,
	}
);
