//All the API endpoints will be declared here and then this will be used in entire frontend to access the endpoints...
const BaseURL = import.meta.env.VITE_API_BASE_URL;

export const authEndpoints = {
  LOGIN_API: BaseURL + 'auth/login',
  LOGOUT_API: BaseURL + 'auth/logout',
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

export const accountEndpoints = {
  USER_BY_ID: { e: BaseURL + 'account/user', t: 'GET'},
  CURRENT_USER: { e: BaseURL + 'account/me', t: 'GET' },
  ALL_USERS: { e: BaseURL + 'account/all', t: 'GET' },
  UPDATE_USER: { e: BaseURL + 'account/update', t: 'PUT' }, //param id
  CHANGE_PASSWORD: { e: BaseURL + 'account/change-password', t: 'POST' },
  DELETE_USER: { e: BaseURL + 'account/delete', t: 'DELETE' }, //param id
  USER_CREDITS: { e: BaseURL + 'account/credits', t: 'GET' }, //param id
  UPDATE_CREDITS: { e: BaseURL + 'account/credits/update', t: 'POST' },
  MANUALLY_VERIFY_EMAIL: { e: BaseURL + 'account/verify-email', t: 'POST' },
  USER_ACTIVITY: { e: BaseURL + 'account/activity', t: 'GET' }, //param id
}

export const builderEndpoints = {
  GET_NODES: { e: BaseURL + 'builder/nodes', t: 'GET' },
  CREATE_WORKFLOW: { e: BaseURL + 'builder/workflow/create', t: 'POST' },
  GET_WORKFLOW_BY_ID: { e: BaseURL + 'builder/workflow', t: 'GET' }, //param id
  UPDATE_WORKFLOW: { e: BaseURL + 'builder/workflow/update', t: 'PUT' }, //param id
  DELETE_WORKFLOW: { e: BaseURL + 'builder/workflow/delete', t: 'DELETE' }, //param id
  ACTIVATE_WORKFLOW: { e: BaseURL + 'builder/workflow/activate', t: 'PUT' }, //param id
  GET_USER_WORKFLOWS: { e: BaseURL + 'builder/workflows', t: 'GET' },
  GET_WORKFLOW_CREDITS: { e: BaseURL + 'builder/workflow/credits', t: 'GET' }, //param id
}

export const uploadEndPoints = {
  UPLOAD: BaseURL + 'upload/',
};
