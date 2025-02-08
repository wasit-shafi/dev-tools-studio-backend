import * as constants from '@utils/constants';

export interface ICountryMetaData {
	name: string;
	code: string;
	id: number;
	isdCode: string;
	symbol: string;
	capital: string;
	currency: string;
	continent: string;
	continent_code: string;
	alpha_3: string;
}

export interface IGoogleMapParams {
	latitude: string;
	longitude: string;
}
// Creating types for either keys/values of object refer : https://stackoverflow.com/a/53662389

export type TFlagCdnIconSizeKeys = keyof typeof constants.FLAG_CDN_ICON_SIZE;
export type TFlagCdnIconSizeValues = (typeof constants.FLAG_CDN_ICON_SIZE)[TFlagCdnIconSizeKeys];

export interface IHeadersForAvoidMailGrouping {
	References: string;
	'X-Entity-Ref-ID': string;
}
