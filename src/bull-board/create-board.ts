import { emailQueue } from '@messageQueue';

import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { _env } from '@environment';

export const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/ui');

createBullBoard({
	queues: [new BullMQAdapter(emailQueue, { description: 'This is used to schedule all the e-mails added by the user.' })],
	serverAdapter,
	options: {
		uiConfig: {
			boardTitle: 'DTS',
			boardLogo: {
				path: '/dev-tools-studio-logo.jpg',
			},
			// TODO(Wasit): update/config the url later once deployed on aws

			miscLinks: [
				{ text: 'Goto Frontend', url: `${_env.get('CORS_ORIGIN')}` },
				{ text: 'Goto Backend', url: `http://localhost:${_env.get('EXPRESS_PORT')}` },
			],

			favIcon: {
				default: '/favicon.svg',
				alternative: '/favicon.ico',
			},
		},
	},
});
