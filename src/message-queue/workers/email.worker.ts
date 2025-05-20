import { Job, Worker } from 'bullmq';

import { redisConnectionConfig } from '@messageQueue';
import { logger, sendApplicationEmail, sendUserEmail } from '@utils';
import * as constants from '@utils/constants';

// TODO(WASIT): handle how to manage spinning more workers on demand

const emailWorker = new Worker(
	constants.MESSAGING_QUEUES.EMAIL,
	async (job: Job) => {
		const { emailType = 0 } = job.data;

		// logger.info('emailWorker ::', {
		// 	worker: job.name,
		// 	data: job.data,
		// });

		if (emailType === constants.EMAIL_TYPES.APPLICATION) {
			await sendApplicationEmail(job.data);
		} else if (emailType === constants.EMAIL_TYPES.USER) {
			await sendUserEmail(job.data);
		}
	},
	{
		connection: redisConnectionConfig,
	}
);
