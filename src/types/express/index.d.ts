// Referred below links for adding custom properties:
// https://stackoverflow.com/a/68957230/10249156
// https://stackoverflow.com/a/40762463/10249156

declare namespace Express {
	export interface Request {
		//  TODO(WASIT): review types for user & ipInfo
		user: any;
		ipInfo: any;
		accessToken: string;
		refreshToken?: string; // refresh token will not be available
	}
}
