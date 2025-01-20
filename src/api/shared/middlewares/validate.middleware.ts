import { RequestHandler } from 'express';
import { Schema } from 'zod';

import { messages } from '@api/shared/utils';
import * as constants from '@utils/constants';

export const validate =
	(schema: Schema): RequestHandler =>
	async (request, response, next) => {
		try {
			const parsedBody = await schema.parseAsync(request.body);

			// assigned parsedBody to request.body to make sure we don't have any other dangling property than we are expect to receive

			request.body = parsedBody;
			next();
		} catch (error: unknown) {
			let message: string = '';

			if (error && error instanceof Object && 'errors' in error && Array.isArray(error.errors) && error.errors.length) {
				message = error.errors[0].message;
			} else {
				message = messages.SHARED.SCHEMA_VALIDATION_ERROR;
			}

			response.status(constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json({ message });
		}
	};
