// NOTE(wasit): Refer for more info:
// https://stackoverflow.com/a/68957230/10249156
// https://blog.logrocket.com/extend-express-request-object-typescript/

// import { IUser } from '@models/user/user.model';

declare namespace Express {
	export interface Request {
		user: any;
		// user?: IUser;
	}
}
