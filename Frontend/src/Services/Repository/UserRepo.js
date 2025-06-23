//These repository files will be responsible for the flow of loaders and then sending the data to the connector along with the specific endpoint.
//i.e frontend pages will call the functions from these repo and then pass data to this and this function will decide the further actions/
//i.e enabling the loader, which endpoint should be called, after receiving the response what to do, toasting the required messages and at last defusing loaders.
import { toast } from 'react-hot-toast';
import { apiConnector } from '../Connector';
import {
  setAccount,
  setAccountAfterRegister,
  setDFeature,
} from '../../App/DashboardSlice';
import { authEndpoints } from '../Apis';

const { 
  LOGIN_API, 
  REGISTER, 
  VALIDATE_GMAIL, 
  GOOGLE_SIGN_IN,
  CHECK_USER,
  SEND_OTP,
  RESEND_OTP,
  VERIFY_OTP,
  FORGOT_PASSWORD,
  RESET_PASSWORD
} = authEndpoints;

// Check if user exists
export function checkUser(email) {
  return async (dispatch) => {
    try {
      const response = await apiConnector('POST', CHECK_USER, { email });
      console.log('Check User API response : ', response);
      return response.data;
    } catch (error) {
      console.log('Check User API Error....', error);
      toast.error(error.response?.data?.message || 'Failed to check user');
      throw error;
    }
  };
}

// Register new user
export function register(name, email, password, occupation, navigate) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Registering you...');
    try {
      const response = await apiConnector('POST', REGISTER, {
        name,
        email,
        password,
        occupation,
      });
      console.log('Register API response : ', response);
      
      if (response.data.success) {
        toast.success('Registration Successful! OTP sent to your email.');
        const temp = {
          email: email,
          name: name,
        };
        dispatch(setAccountAfterRegister(temp));
        navigate('/verify-email');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log('Register API Error....', error);
      toast.error(error.response?.data?.message || 'Registration failed');
    }
    toast.dismiss(loadingToast);
  };
}

// Send OTP for email verification
export function sendOTP(email) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Sending OTP...');
    try {
      const response = await apiConnector('POST', SEND_OTP, { email });
      console.log('Send OTP API response : ', response);
      
      if (response.data.success) {
        toast.success('OTP sent successfully!');
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log('Send OTP API Error....', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
      throw error;
    }
    toast.dismiss(loadingToast);
  };
}

// Resend OTP
export function resendOTP(email) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Resending OTP...');
    try {
      const response = await apiConnector('POST', RESEND_OTP, { email });
      console.log('Resend OTP API response : ', response);
      
      if (response.data.success) {
        toast.success('OTP resent successfully!');
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log('Resend OTP API Error....', error);
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
      throw error;
    }
    toast.dismiss(loadingToast);
  };
}

// Verify OTP
export function verifyOTP(email, otp, navigate) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Verifying OTP...');
    try {
      const response = await apiConnector('POST', VERIFY_OTP, { email, otp });
      console.log('Verify OTP API response : ', response);
      
      if (response.data.verified) {
        toast.success('Email verified successfully!');
        navigate('/login');
        toast('Please Login with your credentials...');
        toast.dismiss(loadingToast);
        return response.data;
      } else {
        toast.dismiss(loadingToast);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log('Verify OTP API Error....', error);
      toast.error(error.response?.data?.message || 'OTP verification failed');
      toast.dismiss(loadingToast);
      throw error;
    }
  };
}

// Login function with new API structure
export function login(email, password, navigate) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Letting you in...');
    try {
      const response = await apiConnector('POST', LOGIN_API, {
        email,
        password,
      });

      console.log('Login API response : ', response);
      
      const { exists_flag, login_flag, user, message } = response.data;

      if (!exists_flag) {
        // Account doesn't exist
        toast.error(message || 'Account does not exist');
        toast.dismiss(loadingToast);
        return { exists_flag, login_flag, shouldShowRegister: true };
      } else if (exists_flag && !login_flag) {
        // Account exists but password incorrect
        toast.error(message || 'Incorrect password');
        toast.dismiss(loadingToast);
        return { exists_flag, login_flag, shouldShowRegister: false };
      } else if (exists_flag && login_flag && user) {
        // Successful login
        toast.success('Login Successful!');
        const temp = {
          id: user.u_id,
          uname: user.name,
          uemail: user.email,
          profile_url: user.profile_url,
          credits: user.credits,
        };
        dispatch(setAccount(temp));
        dispatch(setDFeature({ dashboardFeature: 'Home' }));
        navigate('/dashboard');
        toast.dismiss(loadingToast);
        return { exists_flag, login_flag, shouldShowRegister: false };
      } else {
        throw new Error(message || 'Login failed');
      }
    } catch (error) {
      console.log('Login API Error....', error);
      toast.error(error.response?.data?.message || 'Login failed');
      toast.dismiss(loadingToast);
      return { exists_flag: false, login_flag: false, shouldShowRegister: false };
    }
  };
}

// Forgot password
export function forgotPassword(email) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Sending password reset OTP...');
    try {
      const response = await apiConnector('POST', FORGOT_PASSWORD, { email });
      console.log('Forgot Password API response : ', response);
      
      if (response.data.success) {
        toast.success('OTP sent to your registered email!');
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log('Forgot Password API Error....', error);
      toast.error(error.response?.data?.message || 'Failed to send reset OTP');
      throw error;
    }
    toast.dismiss(loadingToast);
  };
}

// Reset password
export function resetPassword(email, otp, new_password, navigate) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Resetting password...');
    try {
      const response = await apiConnector('POST', RESET_PASSWORD, {
        email,
        otp,
        new_password,
      });
      console.log('Reset Password API response : ', response);
      
      if (response.data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
        toast('Please login with your new password...');
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log('Reset Password API Error....', error);
      toast.error(error.response?.data?.message || 'Password reset failed');
      throw error;
    }
    toast.dismiss(loadingToast);
  };
}

// Legacy functions - keeping for backward compatibility
export function authEmail(userId, otp, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading('Validating OTP..');
    try {
      const response = await apiConnector('POST', VALIDATE_GMAIL, {
        userId,
        otp,
      });
      console.log('Validate API response : ', response);
      if (response.data.success) {
        toast.success('Validation Successful..');
        navigate('/login');
        toast('Please Login...');
        console.log(response);
      } else {
        toast.error(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log('VALIDATION API Error....', error);
      toast.error(error.response.data.message);
    }
    toast.dismiss(toastId);
  };
}

export function loginWithGoogle(credentialResponse, navigate) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Signing in with Google...');
    try {
      const response = await apiConnector('POST', GOOGLE_SIGN_IN, {
        credential: credentialResponse.credential,
      });

      console.log('Google Sign-In API response: ', response);

      if (response.data.success) {
        toast.success('Google Sign-In Successful!');

        const temp = {
          id: response.data.data.data.u_id,
          uname: response.data.data.data.name,
          uemail: response.data.data.data.email,
          token: response.data.data.data.token,
          is_new: response.data.data.data.isNew,
        };
        console.log(temp);

        dispatch(setAccount(temp));

        if (response.data.data.isNew) {
          dispatch(
            setDFeature({
              dashboardFeature: 'Home',
            }),
          );
          navigate('/dashboard');
        } else {
          dispatch(
            setDFeature({
              dashboardFeature: 'Home',
            }),
          );
          navigate('/dashboard');
        }
      } else {
        throw new Error(response.data.message || 'Sign-in failed');
      }
    } catch (error) {
      console.log('Google Sign-In API Error:', error);
      console.log(
        'Google Sign-In API Error Details:',
        error.response?.data?.message,
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Failed to sign in with Google',
      );
    }

    toast.dismiss(loadingToast);
  };
}