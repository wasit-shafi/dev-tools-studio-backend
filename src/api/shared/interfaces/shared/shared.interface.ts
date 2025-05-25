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

export interface IHeadersForAvoidEmailGrouping {
	References: string;
	'X-Entity-Ref-ID': string;
}

export interface IEmailOptions {
	from: string;
	to: string;
	subject: string;
	html: string;
	headers?: Record<string, string>;
}

export interface ISmtpCredential {
	host: string;
	port: number;
	emailId: string;
	pass: string;
}
export interface ISendUserEmail {
	credential: ISmtpCredential;
	emailOptions: IEmailOptions;
	receiveConfirmationEmail: boolean;
	emailType: number;
	_id?: string;
	attachmentDetails?: {
		userId: string;
		fileName: string;
	}[];
}

export interface ISendApplicationEmail {
	emailOptions: IEmailOptions;
}
/*
	Transactional - highest reliability
	Promotional - lowest cost 
*/
type TSmsType = 'Promotional' | 'Transactional';

export interface ISendSms {
	phoneNumber: string;
	message: string;
	smsType?: TSmsType;
}

export interface IOtpGeneratorOptions {
	digits?: boolean;
	lowerCaseAlphabets?: boolean;
	upperCaseAlphabets?: boolean;
	specialChars?: boolean;
}

export interface IRedisConnectionConfig {
	host: string;
	port: number;
	password?: string;
}

export interface IUserFilePath {
	_id: string;
	type: (typeof constants.S3_FILE_TYPES)[keyof typeof constants.S3_FILE_TYPES];
}

export interface IUploadToS3 {
	key: string;
	filePath: string;
}

export interface IGeneratePresignedUrl {
	key: string;
	operation: (typeof constants.CLIENT_S3_OPERATIONS)[keyof typeof constants.CLIENT_S3_OPERATIONS];
}

export interface IDeleteFromS3 {
	key: string;
}
