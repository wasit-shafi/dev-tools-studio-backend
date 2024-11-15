export const messages = {
	ADMIN: {},
	AUTH: {
		EMAIL_AND_USERNAME_CONFLICT_FOR_SIGNIN: 'Both userName and email for login not allowed',
		EMAIL_EXISTS_ERROR: 'Email Already Exists',
		INVALID_USERNAME_OR_PASSWORD: 'Invalid username or password',
		MFA_REQUIRED: 'Multi-factor authentication required',
		RESET_PASSWORD_FAILED: 'Password reset failed',
		RESET_PASSWORD_SUCCESS: 'Password reset successful',
		RE_CAPTCHA_FAILED: 'reCAPTCHA verification failed',
		RE_CAPTCHA_NOT_PROVIDED: 'ReCaptcha is not provided',
		RE_CAPTCHA_RESPONSE_EMPTY: "ReCaptcha response can't be empty. Please check the checkbox again",
		SIGNIN_FAILED: 'Invalid credentials',
		SIGNIN_SUCCESS: 'You have successfully signed in',
		SIGNOUT_SUCCESS: 'You have been signed out successfully',
		SIGNUP_SUCCESS: 'Congratulations!! Account Created Successfully',
		TOKEN_REFRESH: 'Token refreshed successfully',
	},
	BULL_MQ: {
		EMAIL: {
			EMAIL_SCHEDULED_SUCCESS: 'Your Email has been scheduled successfully',
		},
	},
	COMMON: {
		INVALID_DATE_AND_TIME: 'Invalid date/time',
		SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
	},
	ERROR: {},
	HTTP_STATUS: {
		INFORMATION: {},
		REDIRECTION: {},
		CLIENT: {
			TOO_MANY_REQUEST: 'Too many requests, please try again later.',
			UNAUTHORIZED: 'Unauthorized access',
		},
		SERVER: {},
	},
	USER: {},
};
