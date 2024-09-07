import { emailQueue } from '@messageQueue';

const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/ui');

createBullBoard({
	queues: [new BullMQAdapter(emailQueue, { description: 'This is used to schedule all the e-mails added by the user.' })],
	serverAdapter,
	options: {
		uiConfig: {
			boardTitle: 'Dev Tools Studio',
			boardLogo: {
				path: 'https://res.cloudinary.com/dtlx6i2m7/image/upload/v1725672016/dev-tools-studio/t35fx73zvnjoe29bz5mc.jpg',
				width: '50px',
				height: '50px',
			},
			miscLinks: [
				{ text: 'Frontend App', url: 'http://localhost:4200' },
				// { text: 'Logout', url: '/logout' },
			],
			// TODO: check why it's not working
			// favIcon: {
			// 	default: '../public/favicon.svg',
			// 	alternative: 'public/favicon.svg',
			// },
		},
	},
});

export { serverAdapter };
