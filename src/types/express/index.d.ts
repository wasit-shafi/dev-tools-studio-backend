// Referred below links for adding custom properties:
// https://stackoverflow.com/a/68957230/10249156
// https://stackoverflow.com/a/40762463/10249156

declare namespace Express {
	export interface Request {
		//  TODO(WASIT): review types for user & ipinfo
		user: any;
		ipinfo: any;
	}
}
