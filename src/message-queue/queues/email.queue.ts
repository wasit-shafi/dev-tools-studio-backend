import { Queue } from 'bullmq';

import * as constants from '@utils/constants';
import { redisConnectionConfig } from '@messageQueue';

const TOTAL_RETRY_ATTEMPTS = 3;
const BACKOFF_RETRY_DELAY_IN_SECONDS = 30;

export const emailQueue = new Queue(constants.MESSAGING_QUEUES.EMAIL, {
	connection: redisConnectionConfig,
	defaultJobOptions: {
		attempts: TOTAL_RETRY_ATTEMPTS,
		backoff: {
			type: constants.BACKOFF_STRATEGY_TYPE.FIXED,
			delay: constants.TIME.MS.SECOND * BACKOFF_RETRY_DELAY_IN_SECONDS,
		},
	},
});
