import { RequestHandler } from 'express';
import { User } from '../../shared/models/user.model';

import { _env } from '../../../config/environments/env';

export const getUsers: RequestHandler = async (request, response) => {
	const allUsers = await User.find({});
	response.json(allUsers);
};

export const registerUser: RequestHandler = async (request, response) => {
	const num = (await User.find({})).length + 1;
	const newUser = await User.create({
		userName: num + '->name-' + _env.get('NODE_ENV') + '-',
	});

	response.json({ message: 'new user registered!!', user: newUser });
};
