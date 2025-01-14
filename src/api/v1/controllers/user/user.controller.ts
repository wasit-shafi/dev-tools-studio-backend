import type { Request, Response } from 'express';

import { _env } from '@environment';
import { User } from '@models/user/user.model';
import { asyncHandler } from '@utils';

const getUsers = asyncHandler(async (request: Request, response: Response) => {
	const allUsers = await User.find({});
	response.json(allUsers);
});

export const userController = { getUsers };
