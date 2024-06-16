import { RequestHandler } from 'express';

export const registerUser: RequestHandler = (request, response) => {
	response.json({ message: 'new user registered!!' }).send();
};
