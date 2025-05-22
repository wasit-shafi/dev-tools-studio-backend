import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { v7 as uuidv7 } from 'uuid';

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

export const upload = multer({ storage });
