// for more info refer google recaptcha docs: https://developers.google.com/recaptcha/docs/verify

type ReCaptchaSiteVerifyErrorCodes =
	| 'missing-input-secret' // The secret parameter is missing.
	| 'invalid-input-secret' // The secret parameter is invalid or malformed.
	| 'missing-input-response' // The response parameter is missing.
	| 'invalid-input-response' // The response parameter is invalid or malformed.
	| 'bad-request' // The request is invalid or malformed.
	| 'timeout-or-duplicate'; // The response is no longer valid: either is too old or has been used previously.

export interface IReCaptchaSiteVerifyResponse {
	success: boolean;
	challenge_ts: string; // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
	hostname: string; // the hostname of the site where the reCAPTCHA was solved
	'error-codes': ReCaptchaSiteVerifyErrorCodes[]; // optional
}
