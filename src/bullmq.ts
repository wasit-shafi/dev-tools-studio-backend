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
});

// TODO: handle how to manage spinning more workers on demand

const emailWorker = new Worker(
	constants.MESSAGING_QUEUES.EMAIL,
	async (job: any) => {
		// console.log('job:: ', job);
		console.log({
			worker: job.name,
			data: job.data,
		});
	},
	{
		connection: redisConnectionOptions,
	}
);

// console.log('emailWorker :: ', emailWorker);

export const messagingQueues = { emailQueue };
