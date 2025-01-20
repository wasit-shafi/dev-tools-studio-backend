import otpGenerator from 'otp-generator';
import { UAParser } from 'ua-parser-js';

import { _env } from '@config/environment';
import { IGoogleMapParams, IStaticMapParams, TFlagCdnIconSizeValues } from '@interfaces';
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

	if (ipInfo && !ipInfo?.bogon) {
		near = `${ipInfo.city}, ${ipInfo.country}${ipInfo.isEU ? '(Europe)' : ''}, ${ipInfo.region}`;
	}

	near = near.trim();

	return near;
};

export const getStaticMapUrl = (params: IStaticMapParams): string => {
	let staticMapUrl = '';
	const { latitude, longitude } = params;

	if (latitude && longitude) {
		staticMapUrl = `${constants.GEOAPIFY_MAPS_BASE_URL}/staticmap?style=osm-bright&width=250&height=250&geometry=circle:${longitude},${latitude},50;fillcolor:%23f9a9eb;fillopacity:0.6&zoom=12&scaleFactor=2&apiKey=${String(_env.get('GEOAPIFY_API_KEY'))}`;
	}

	return staticMapUrl;
};

export const getGoogleMapUrl = (params: IGoogleMapParams): string => {
	let googleMapUrl = '';
	const { latitude, longitude } = params;

	if (latitude && longitude) {
		googleMapUrl = `${constants.GOOGLE_MAPS_BASE_URL}/maps?z=10&t=m&q=loc:${latitude}+${longitude}`;
	}

	return googleMapUrl;
};
// For more info refer: https://flagpedia.net/download/api

export const getCountryFlagUrl = (flagSize: TFlagCdnIconSizeValues, countryCode: string): string => {
	let flagUrl = '';

	if (flagSize && countryCode) {
		flagUrl = `${constants.FLAG_CDN_BASE_URL}/${flagSize}/${countryCode.toLowerCase()}.png`;
	}

	return flagUrl;
};
