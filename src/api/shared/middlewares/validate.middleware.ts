import { RequestHandler } from 'express';
import { Schema, ZodError } from 'zod';

import { ApiError, MESSAGES } from '@utils';
import * as constants from '@utils/constants';

export const validateRequestBody =
	(schema: Schema): RequestHandler =>
	async (request, response, next) => {
		try {
			// Using parseAsync() instead of parse(), for more info refer: https://zod.dev/?id=parseasync

			request.body = await schema.parseAsync(request.body); // to remove all the dangling properties
			next();
			return;
		} catch (error: unknown) {
			// For checking if the error is an ZodError, refer below link for more info: https://github.com/colinhacks/zod/discussions/2415

			const message: string = error instanceof ZodError ? error.errors[0].message : MESSAGES.SHARED.SCHEMA_VALIDATION_ERROR;
			next(new ApiError(message, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		}
	};

export const validateRequestParams =
	(schema: Schema): RequestHandler =>
	async (request, response, next) => {
		try {
			request.params = await schema.parseAsync(request.params); // to remove all the dangling properties
			next();
		} catch (error: unknown) {
			const message: string = error instanceof ZodError ? error.errors[0].message : MESSAGES.SHARED.SCHEMA_VALIDATION_ERROR;
			next(new ApiError(message, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		}
	};

export const validateRequestQuery =
	(schema: Schema): RequestHandler =>
	async (request, response, next) => {
		try {
			request.query = await schema.parseAsync(request.query); // to remove all the dangling properties
			next();
		} catch (error: unknown) {
			const message: string = error instanceof ZodError ? error.errors[0].message : MESSAGES.SHARED.SCHEMA_VALIDATION_ERROR;
			next(new ApiError(message, constants.HTTP_STATUS_CODES.CLIENT_ERROR.BAD_REQUEST));
		}
	};
