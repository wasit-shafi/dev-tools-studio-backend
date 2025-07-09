import { Request } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v7 as uuidv7 } from 'uuid';

import { MESSAGES } from '@utils';
import * as constants from '@utils/constants';

const storage = multer.diskStorage({
	destination: function (request, file, callback) {
		try {
			if (!fs.existsSync(constants.FILE_PATHS.TEMP_UPLOADS)) {
				fs.mkdirSync(constants.FILE_PATHS.TEMP_UPLOADS, { recursive: true });
			}

			callback(null, constants.FILE_PATHS.TEMP_UPLOADS);
		} catch (error) {
			console.log('multer middleware :: destination callback error :: ', error);
		}
	},
	filename: function (request, file, callback) {
		try {
			callback(null, `${uuidv7()}${path.parse(file.originalname).ext}`);
		} catch (error) {
			console.log('multer middleware :: filename callback error :: ', error);
		}
	},
});

export const upload = multer({
	storage,
	limits: {
		fileSize: constants.FILE_SIZE.BYTES.ONE_MB * constants.GLOBAL_MAX_FILE_SIZE_LIMIT_IN_MB,
	},
	fileFilter: (request: Request, file: any, callback) => {
		// TODO(Wasit): Remove below line when AWS S3 cloud storage is enabled back.

		callback(new Error('Uploading/Storing files on cloud storage (AWS S3 Bucket) is temporarily disabled since 26 June 2025.'));

		const { path = '' } = request;

		switch (path) {
			case constants.ROUTES.USER_ROUTES.PROFILE_PICTURE: {
				const allowedMimeTypes = [...constants.ALLOWED_MIME_TYPES.IMAGES];
				const isFileAccepted: boolean = allowedMimeTypes.includes(file.mimetype);
				callback(null, isFileAccepted);
				return;
			}

			case constants.ROUTES.USER_ROUTES.ATTACHMENT: {
				const allowedMimeTypes = [
					...constants.ALLOWED_MIME_TYPES.IMAGES,
					...constants.ALLOWED_MIME_TYPES.VIDEOS,
					...constants.ALLOWED_MIME_TYPES.TEXT,
					...constants.ALLOWED_MIME_TYPES.AUDIO,
					...constants.ALLOWED_MIME_TYPES.DOCUMENTS,
				];
				const isFileAccepted: boolean = allowedMimeTypes.includes(file.mimetype);
				callback(null, isFileAccepted);
				return;
			}
		}
		// fallback error message

		callback(new Error(MESSAGES.SHARED.SOMETHING_WRONG_WITH_FILE_FAILURE));
	},
});
