import { Queue } from 'bullmq';

import { redisConnectionConfig } from '@messageQueue';
import * as constants from '@utils/constants';

export const emailQueue = new Queue(constants.MESSAGING_QUEUES.EMAIL, {
	connection: redisConnectionConfig,
	defaultJobOptions: {
		attempts: constants.QUEUE_CONFIGS.EMAIL_QUEUE.TOTAL_RETRY_ATTEMPTS,
		backoff: {
			type: constants.BACKOFF_STRATEGY_TYPE.FIXED,
			delay: constants.TIME.MS.SECOND * constants.QUEUE_CONFIGS.EMAIL_QUEUE.BACKOFF_RETRY_DELAY_IN_SECONDS,
		},
	},
});
