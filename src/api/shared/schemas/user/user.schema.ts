import { z } from 'zod';

import { MESSAGES } from '@utils';
import * as constants from '@utils/constants';

export const signupZodSchema = z
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

		reCaptcha: z.string({
			required_error: MESSAGES.AUTH.RE_CAPTCHA_NOT_PROVIDED,
			invalid_type_error: 'reCaptcha must be a string',
		}),
	})
	.refine((userData) => userData.password === userData.confirmPassword, {
		message: "Passwords & Confirm Password don't match, please try again.",
		path: ['confirm'], // path of error
	});

export const resetPasswordZodSchema = z
	.object({
		password: z
			.string({
				required_error: 'Password is required',
				invalid_type_error: 'Password must be a string',
			})
			.trim(),
		confirmPassword: z
			.string({
				required_error: 'Confirm Password is required',
				invalid_type_error: 'Confirm Password must be a string',
			})
			.trim(),
		reCaptcha: z
			.string({
				required_error: 'reCaptcha is required',
				invalid_type_error: 'reCaptcha must be a string',
			})
			.trim(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords & Confirm Password don't match, please try again.",
		path: ['confirm'], // path of error
	});
