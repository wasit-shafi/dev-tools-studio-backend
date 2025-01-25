// NOTE(WASIT): Refer for more info:
// https://stackoverflow.com/a/47448486/10249156
// https://stackoverflow.com/a/68957230/10249156
// https://blog.logrocket.com/extend-express-request-object-typescript/

import { IUser, IUserDocument } from '@api/shared/models';

declare global {
	namespace Express {
		interface Request {
			user: IUserDocument;
			// TODO(WASIT): what should be type of ipInfo...?

			ipinfo: any;
		}
	}
}
