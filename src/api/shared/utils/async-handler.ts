import type { RequestHandler, Request, Response, NextFunction } from 'express';
/**
 *
 * @param asyncCallback
 * @returns
 */
export const asyncHandler = (asyncCallback: Function): RequestHandler => {
	return (request: Request, response: Response, next: NextFunction) => {
		asyncCallback(request, response, next).catch((error: unknown) => {
			return next(error);
		});
	};
};
