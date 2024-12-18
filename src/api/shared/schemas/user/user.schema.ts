import { z } from 'zod';

import * as constants from '@utils/constants';

export const userZodSchema = z
	.object({
		firstName: z
			.string({
				required_error: 'First Name is required',
				invalid_type_error: 'First Name must be a string',
			})
			.trim()
			.min(3, { message: 'First Name must be at least 3 characters' })
			.max(20, { message: "First Name can't be more than 20 characters" }),

		lastName: z
			.string({
				required_error: 'Last Name is required',
				invalid_type_error: 'Last Name must be a string',
			})
			.trim()
			.min(3, { message: 'Last Name must be at least 3 characters' })
			.max(20, { message: "Last Name can't be more than 20 characters" }),
		userName: z.string().optional(),
		displayName: z.string().optional(),
		email: z
			.string({
				required_error: 'Email is required',
				invalid_type_error: 'Email must be a string',
			})
			.email({
				message: 'You have entered invalid email address',
			}),
		password: z
			.string({
				required_error: 'Password is required',
				invalid_type_error: 'Password must be a string',
			})
			.trim()
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(100, { message: "Password can't be more than 100 characters" }),
		confirmPassword: z
			.string({
				required_error: 'Confirm Password is required',
				invalid_type_error: 'Confirm Password must be a string',
			})
			.trim(),
		countryCode: z
			.string({
				required_error: 'Country Code is required',
				invalid_type_error: 'Country Code must be a string',
			})
			.min(2, { message: 'Country Code must be at least 2 characters' })
			.refine(
				(countryCode) => {
					return constants.COUNTRY_METADATA.some((country) => country.isdCode === countryCode);
				},
				{
					message: 'Invalid ISD Country Code.',
				}
			),

		mobileNumber: z.string({
			required_error: 'Mobile Number is required',
			invalid_type_error: 'Mobile Number must be a string',
		}),
		country: z.string({
			required_error: 'Country is required',
			invalid_type_error: 'Country must be a string',
		}),
		refreshTokens: z.string().array().nonempty().optional(),
		// don't take input from user
		// roles: z
		// 	.number({
		// 		required_error: 'Role is required',
		// 		invalid_type_error: 'Role must be a number',
		// 	})
		// 	.array()
		// 	.nonempty({ message: 'User should have at-least one role' }),

		createdAt: z.string().datetime().optional(),
		updatedAt: z.string().datetime().optional(),
	})
	.refine((userData) => userData.password === userData.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirm'], // path of error
	});
