import { RequestHandler } from 'express';

export const validate =
	(schema: any): RequestHandler =>
	async (request, response, next) => {
		console.clear();
		try {
			const parsedBody = await schema.parseAsync(request.body);
			// assigned parsedBody to request.body to make sure we don't have any other dangling property than we are expect to receive

			request.body = parsedBody;
			next();
		} catch (error: any) {
			console.log('error: ', error);
			response.status(400).json({ message: error.errors[0].message });
		}
	};
