import * as constants from '@utils/constants';

// import cryptoRandomString from 'crypto-random-string';

export const generateOtp = (): string => {
	// TODO: review once more issue with crypto-random-string
	// return cryptoRandomString({ length: constants.OTP_LENGTH });
	return '123456';
};

export const generateCookieOptions = (
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
