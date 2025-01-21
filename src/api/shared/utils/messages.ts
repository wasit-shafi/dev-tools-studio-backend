export const messages = {
	ADMIN: {},
	AUTH: {
		EMAIL_AND_USERNAME_CONFLICT_FOR_SIGNIN: 'Both userName and email for login not allowed',
		EMAIL_EXISTS_ERROR: 'Email Already Exists',
		INVALID_RESET_PASSWORD_ATTEMPT: 'This password reset attempt is no longer valid, please request a new link and try again.',
		INVALID_USERNAME_OR_PASSWORD: 'Invalid username or password',
		MFA_REQUIRED: 'Multi-factor authentication required',
		PASSWORD_RESET_MAIL_SENT:
			'If an account with this email exists, a password reset link has been sent. Please check your inbox and follow the instructions.',
		RESET_PASSWORD_FAILED: 'Password reset failed',
		RESET_PASSWORD_SUCCESS: 'Password reset successful, please login with your new password',
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
	SHARED: {
		DATABASE_CONNECTION_ERROR: 'Failed to connect with database',
		INVALID_DATE_AND_TIME: 'Invalid date/time',
		SCHEMA_VALIDATION_ERROR: 'Something went wrong while parsing/validating request',
		SERVER_HEALTH_CHECK: 'Server on working fine',
		SMTP_ERROR: 'Something went wrong, while sending email, please try again after some time',
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
} as const;
