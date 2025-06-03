import { readFile } from 'node:fs/promises';

import {
    DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client, S3ServiceException
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { _env } from '@environment';
import { IDeleteFromS3, IGeneratePresignedUrl, IUploadToS3 } from '@interfaces';
import * as constants from '@utils/constants';

export const BUCKET_NAME: string = String(_env.get('AWS_S3_BUCKET_NAME'));
const AWS_PRESIGNED_URL_EXPIRY: number = Number(_env.get('AWS_PRESIGNED_URL_EXPIRY'));

export const s3Client = new S3Client({
	region: String(_env.get('AWS_S3_BUCKET_REGION')),
	credentials: {
		accessKeyId: String(_env.get('AWS_ACCESS_KEY_ID')),
		secretAccessKey: String(_env.get('AWS_SECRET_ACCESS_KEY')),
	},
});
// For more info refer official docs: https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html

export const uploadToS3 = async (params: IUploadToS3) => {
	try {
		const { filePath, key } = params;
		const command = new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			Body: await readFile(filePath),
		});

		return await s3Client.send(command);
	} catch (error: unknown) {
		if (error instanceof S3ServiceException && error.name === 'EntityTooLarge') {
			throw new Error(
				`Error from S3 while uploading object to ${BUCKET_NAME}.The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) or the multipart upload API (5TB max).`
			);
		} else if (error instanceof S3ServiceException) {
			throw new Error(`Error from S3 while uploading object to ${BUCKET_NAME}.  ${error.name}: ${error.message}`);
		} else {
			throw error;
		}
	}
};
// For more info refer official docs: https://docs.aws.amazon.com/AmazonS3/latest/userguide/delete-objects.html

export const deleteFromS3 = async (params: IDeleteFromS3) => {
	try {
		const { key } = params;
		const command = new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		});

		return await s3Client.send(command);
	} catch (error: unknown) {
		console.log('Error :: deleteFromS3', error);
		throw error;
	}
};

export const generatePresignedUrl = async (params: IGeneratePresignedUrl): Promise<string> => {
	try {
		let presignedUrl = '';
		const { key, operation } = params;

		switch (operation) {
			// NOTE(Wasit): used {} for eslint/sonar issues "unexpected lexical declaration in case block"/"no-case-declarations", refer: https://eslint.org/docs/latest/rules/no-case-declarations#rule-details

			case constants.CLIENT_S3_OPERATIONS.GET_OBJECT: {
				const command = new GetObjectCommand({
					Bucket: BUCKET_NAME,
					Key: key,
					ResponseContentType: 'auto',
				});

				presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: AWS_PRESIGNED_URL_EXPIRY });
				break;
			}
			case constants.CLIENT_S3_OPERATIONS.PUT_OBJECT: {
				break;
			}
			case constants.CLIENT_S3_OPERATIONS.DELETE_OBJECT: {
				break;
			}
			case constants.CLIENT_S3_OPERATIONS.LIST_OBJECT: {
				break;
			}
		}
		return presignedUrl;
	} catch (error: unknown) {
		// console.log('error :: generatePresignedUrl', error);
		throw new Error(`generatePresignedUrl() :: Unsupported operation`);
	}
};
