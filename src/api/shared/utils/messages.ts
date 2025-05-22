export const MESSAGES = {
	ADMIN: {},
	AUTH: {
		EMAIL_AND_USERNAME_CONFLICT_FOR_SIGNIN: 'Both userName and email for login not allowed',
		EMAIL_EXISTS_ERROR: 'Email Already Exists',
		INVALID_RESET_PASSWORD_ATTEMPT: 'This password reset attempt is no longer valid, please request a new link and try again.',
		INVALID_USERNAME_OR_PASSWORD: 'Invalid username or password',
		MFA_REQUIRED: 'Multi-factor authentication required',
		PASSWORD_RESET_MAIL_SENT: 'If an account with this email exists, a password reset link has been sent. Please check your inbox and follow the instructions.',
		REFRESH_FAILURE: 'Refresh token expired or invalid, please login again',
		REFRESH_SUCCESS: 'Successfully updated the tokens',
		RESET_PASSWORD_FAILED: 'Password reset failed',
		RESET_PASSWORD_SUCCESS: 'Password reset successful, please login with your new password',
		RE_CAPTCHA_FAILED: 'reCAPTCHA verification failed',
		RE_CAPTCHA_NOT_PROVIDED: 'ReCaptcha is not provided',
		RE_CAPTCHA_RESPONSE_EMPTY: "ReCaptcha response can't be empty. Please check the checkbox again",
		SIGNIN_FAILED: 'Invalid credentials',
		SIGNIN_SUCCESS: 'You have successfully signed in',
		SIGNOUT_FAILED: 'Unable to sign out user, please try again',
		SIGNOUT_SUCCESS: 'You have been signed out successfully',
		SIGNUP_SUCCESS: 'Congratulations!! Account Created Successfully',
		TOKEN_REFRESH: 'Token refreshed successfully',
		USER_FETCH_SUCCESS: 'User detail fetched successfully',
		USER_FETCH_FAILURE: 'Something went wrong while fetching user detail',
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
		DUPLICATE_ENTRY_FOUND: 'Duplicate entry found. Please check your input and try again.',
		SIGNIN_SUCCESSFUL: 'Sign-in successful',
	},
	ERROR: {
		JWT_TOKEN_VERIFICATION_FAILURE: 'JWT token verification failed, please try again',
	},
	HTTP_STATUS: {
		INFORMATION: {},
		REDIRECTION: {},
		CLIENT: {
			TOO_MANY_REQUEST: 'Too many requests, please try again later.',
			UNAUTHORIZED: 'Unauthorized access',
		},
		SERVER: {},
	},
	USER: {
		ADD_CREDENTIAL_SUCCESS: 'New credential added successfully',
		ADD_CREDENTIAL_FAILURE: 'Something went wrong while adding new credential ',

		GET_CREDENTIAL_SUCCESS: 'Credential fetched successfully',
		GET_CREDENTIAL_FAILURE: 'Something went wrong while fetching credentials',

		DELETE_CREDENTIAL_SUCCESS: 'Credential deleted successfully',
		DELETE_CREDENTIAL_FAILURE: 'Something went wrong while deleting credential',

		PATCH_CREDENTIAL_SUCCESS: 'Credential updated successfully',
		PATCH_CREDENTIAL_FAILURE: 'Something went wrong while updating credential',

		GET_CREDENTIAL_LIST_SUCCESS: 'Credentials fetched successfully',
		GET_CREDENTIAL_LIST_FAILURE: 'Something went wrong while fetching credentials',

		EMAIL_SCHEDULED_SUCCESS: 'Email Scheduled successfully',
		EMAIL_SCHEDULED_FAILURE: 'Something went wrong while schedule email',

		EMAIL_SENT_SUCCESS: 'Email Sent successfully',
		EMAIL_SENT_FAILURE: 'Something went wrong while sending email',

		ADD_EMAIL_TEMPLATE_SUCCESS: 'New email template added successfully',
		ADD_EMAIL_TEMPLATE_FAILURE: 'Something went wrong while fetching the email template',

		PATCH_EMAIL_TEMPLATE_SUCCESS: 'Email template updated successfully',
		PATCH_EMAIL_TEMPLATE_FAILURE: 'Something went wrong while updating email template',

		DELETE_EMAIL_TEMPLATE_SUCCESS: 'Email template deleted successfully',
		DELETE_EMAIL_TEMPLATE_FAILURE: 'Something went wrong while deleting email template',

		GET_EMAIL_TEMPLATE_SUCCESS: 'Email template fetched successfully',
		GET_EMAIL_TEMPLATE_FAILURE: 'Something went wrong while fetching email template',

		GET_EMAIL_TEMPLATE_LIST_SUCCESS: 'Email templates fetched successfully',
		GET_EMAIL_TEMPLATE_LIST_FAILURE: 'Something went wrong while fetching email templates',

		PROFILE_PICTURE_SUCCESS: 'Profile picture saved successfully',
		PROFILE_PICTURE_FAILURE: 'Something went wrong while saving profile picture',

		ATTACHMENT_SUCCESS: 'Attachment saved successfully',
		ATTACHMENT_FAILURE: 'Something went wrong while saving attachment',
	},
} as const;
