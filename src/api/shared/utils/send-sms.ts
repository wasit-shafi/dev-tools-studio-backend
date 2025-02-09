import { PublishCommand, SetSMSAttributesCommand, SNSClient } from '@aws-sdk/client-sns';
import { _env } from '@config/environment';
import { ISendSms } from '@interfaces';
import { logger } from '@utils';
import * as constants from '@utils/constants';

const snsClientConfig = {
	region: String(_env.get('AWS_SNS_REGION')),
	credentials: {
		accessKeyId: String(_env.get('AWS_ACCESS_KEY_ID')),
		secretAccessKey: String(_env.get('AWS_SECRET_ACCESS_KEY')),
	},
};

const snsClient = new SNSClient(snsClientConfig);

export const sendSms = async (params: ISendSms): Promise<void> => {
	const { phoneNumber, message, smsType = constants.DEFAULT_SMS_TYPE } = params;

	// logger.info('sendSms params :: ', { phoneNumber, message, smsType });

	try {
		const input = {
			PhoneNumber: phoneNumber,
			Message: message,
		};

		const publishCommand = new PublishCommand(input);

		// const setSmsAttributesCommand = new SetSMSAttributesCommand({
		// 	attributes: {
		// 		DefaultSMSType: smsType,
		// 	},
		// });

		const publishResponse = await snsClient.send(publishCommand);
		// logger.info({ publishCommand, publishResponse, setSmsAttributesCommand });
	} catch (error) {
		console.log('sendSms error :: ', error);
	}
};
