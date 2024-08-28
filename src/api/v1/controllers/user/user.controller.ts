import type { Request, Response } from 'express';

import { asyncHandler } from '@utils';

import { User } from '@models/user/user.model';

import { _env } from '@environment';

const getUsers = asyncHandler(async (request: Request, response: Response) => {
	const allUsers = await User.find({});
	response.json(allUsers);
});

export const userController = { getUsers };
