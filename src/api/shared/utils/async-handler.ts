import type { RequestHandler, Request, Response, NextFunction } from 'express';

const asyncHandler = (asyncCallback: Function): RequestHandler => {
	return (request: Request, response: Response, next: NextFunction) => {
		asyncCallback(request, response, next).catch((error: any) => {
			return next(error);
		});
	};
};

export { asyncHandler };
