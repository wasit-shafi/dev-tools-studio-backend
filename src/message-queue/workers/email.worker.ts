import { Job, Worker } from 'bullmq';

import { redisConnectionConfig } from '@messageQueue';
import { logger, sendMail } from '@utils';
import * as constants from '@utils/constants';

// TODO(WASIT): handle how to manage spinning more workers on demand

const emailWorker = new Worker(
	constants.MESSAGING_QUEUES.EMAIL,
	async (job: Job) => {
		// logger.info('emailWorker ::', {
		// 	worker: job.name,
		// 	data: job.data,
		// 	time: new Date().getTime(),
		// 	// job,
		// });

		await sendMail(job.data.emailOptions);
	},
	{
		connection: redisConnectionConfig,
	}
);
