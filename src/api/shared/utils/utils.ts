import otpGenerator from 'otp-generator';
import { UAParser } from 'ua-parser-js';

import * as constants from '@utils/constants';

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

/**
 * utility function to get the random numbers
 *
 * @param min - the minimum random number value
 * @param  max - the maximum random number value
 * @returns radom value within range [min, max]
 */
export const randomInteger = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getDeviceInfoString = (userAgent: string): string => {
	let device = '';

	const uaParser = new UAParser(userAgent);
	const userAgentParsedData = uaParser.getResult();

	if (userAgentParsedData.browser.name) {
		device = userAgentParsedData.browser.name;
	}

	if (userAgentParsedData.os) {
		device += ` ${userAgentParsedData.os}`;
	}

	if (userAgentParsedData.device.vendor && userAgentParsedData.device.type) {
		device += ` (${userAgentParsedData.device.vendor}, ${userAgentParsedData.device.type})`;
	}

	device = device.trim();

	return device;
};

export const getIpInfoString = (ipInfo: any): string => {
	let near = '';

	if (!ipInfo?.bogon) {
		near = `${ipInfo.city}, ${ipInfo.country}${ipInfo.isEU ? '(Europe)' : ''}, ${ipInfo.region}`;
	}

	near = near.trim();

	return near;
};
