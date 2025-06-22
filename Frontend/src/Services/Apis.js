//All the API endpoints will be declared here and then this will be used in entire frontend to access the endpoints...
const BaseURL = import.meta.env.VITE_API_BASE_URL;

export const authEndpoints = {
  LOGIN_API: BaseURL + 'auth/login',
  REGISTER: BaseURL + 'auth/register',
  VALIDATE_GMAIL: BaseURL + 'auth/validate',
  GOOGLE_SIGN_IN: BaseURL + 'auth/sign-in-google',
  CHECK_USER: BaseURL + 'auth/check-user',
  SEND_OTP: BaseURL + 'auth/send-otp',
  RESEND_OTP: BaseURL + 'auth/resend-otp',
  VERIFY_OTP: BaseURL + 'auth/verify-otp',
  FORGOT_PASSWORD: BaseURL + 'auth/forgot-password',
  RESET_PASSWORD: BaseURL + 'auth/reset-password',
};

export const uploadEndPoints = {
  UPLOAD: BaseURL + 'upload/',
};
