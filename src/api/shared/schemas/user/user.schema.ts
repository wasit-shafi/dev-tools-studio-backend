import { z } from 'zod';

export const userZodSchema = z.object({
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
	mobileNumber: z.string({
		required_error: 'Mobile Number is required',
		invalid_type_error: 'Mobile Number must be a string',
	}),
	country: z.string({
		required_error: 'Country is required',
		invalid_type_error: 'Country must be a string',
	}),
	devTools: z.array(z.any()).optional(),
	createdAt: z.string().datetime().optional(),
	updatedAt: z.string().datetime().optional(),
});
