import { RequestHandler } from 'express';
import { User } from '../../shared/models/user.model';

import { _env } from '../../../config/environments/env';

export const getUsers: RequestHandler = async (request, response) => {
	const allUsers = await User.find({});
	response.json(allUsers);
};

export const registerUser: RequestHandler = async (request, response) => {
	const newUser = await User.create({
		userName: 'name-' + _env.get('NODE_ENV') + '-' + Math.random().toString(),
	});

	response.json({ message: 'new user registered!!', user: newUser });
};
