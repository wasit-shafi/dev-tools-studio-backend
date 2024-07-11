import { type RequestHandler } from 'express';

import { _env } from '../../../../config';
import { User } from '../../../shared/models/user/user.model';

const getUsers: RequestHandler = async (request, response) => {
	const allUsers = await User.find({});
	response.json(allUsers);
};

const registerUser: RequestHandler = async (request, response) => {
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
};

export const userController = { registerUser, getUsers };
