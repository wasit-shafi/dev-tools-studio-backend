import { RequestHandler } from 'express';
import { User } from '../../shared/models/user.model';

export const getUsers: RequestHandler = async (request, response) => {
	const allUsers = await User.find({});
	response.json(allUsers);
};

export const registerUser: RequestHandler = async (request, response) => {
	const newUser = await User.create({
		userName: 'name-' + Math.random().toString(),
	});

	response.json({ message: 'new user registered!!', user: newUser });
};
