import * as constants from '@utils/constants';

const generateCookieOptions = (
	expiresIn: Date = new Date(Date.now() + constants.DEFAULT_COOKIE_EXPIRY),
	isSecure = true,
	isHttpOnly = true
) => {
	const cookieOptions = {
		expires: expiresIn,
		secure: isSecure,
		httpOnly: isHttpOnly,
	};
	// console.log('cookieOptions :: ', cookieOptions);
	return cookieOptions;
};

export { generateCookieOptions };
