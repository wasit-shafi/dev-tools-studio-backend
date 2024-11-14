import * as constants from '@utils/constants';
import otpGenerator from 'otp-generator';

interface IOtpGeneratorOptions {
	digits?: boolean;
	lowerCaseAlphabets?: boolean;
	upperCaseAlphabets?: boolean;
	specialChars?: boolean;
}

/**
 *
 * @param otpLength
 * @param otpOptions
 * @returns
 */
export const generateOtp = (otpLength = constants.DEFAULT_OTP_LENGTH, otpOptions: IOtpGeneratorOptions = {}): string => {
	return otpGenerator.generate(otpLength, otpOptions);
};

/**
 *
 * @param expiresIn
 * @param isSecure
 * @param isHttpOnly
 * @returns
 */

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
