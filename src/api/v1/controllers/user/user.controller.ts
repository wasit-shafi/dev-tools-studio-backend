import type { Request, Response } from 'express';

import { asyncHandler } from '@utils';

import { User } from '@models/user/user.model';

const getUsers = asyncHandler(async (request: Request, response: Response) => {
	const allUsers = await User.find({});
	response.json(allUsers);
});

const registerUser = asyncHandler(async (request: Request, response: Response) => {
	const { firstName = '', lastName = '', email = '', password = '', mobileNumber = '', country = '' } = request.body;
	const userName = firstName + '_' + lastName;

	const newUser = await User.create({
		firstName,
		lastName,
		userName,
		email,
		password,
		mobileNumber,
		country,
	});
	response.json({ message: 'new user created', user: newUser });
});

export const userController = { registerUser, getUsers };
