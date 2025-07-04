import { toast } from "react-hot-toast";
import { apiConnector } from "../Connector";
import { setAccount, setCredits } from "../../app/DashboardSlice";
import { accountEndpoints } from "../Apis";

const {
  CURRENT_USER,
  UPDATE_USER,
  CHANGE_PASSWORD,
  DELETE_USER,
  USER_CREDITS,
  USER_BY_ID,
  ALL_USERS,
  UPDATE_CREDITS,
  MANUALLY_VERIFY_EMAIL,
  USER_ACTIVITY,
} = accountEndpoints;

export async function getCurrentUser() {
  const loadingToast = toast.loading("Fetching user data...");
  try {
    const response = await apiConnector(CURRENT_USER.t, CURRENT_USER.e);

    console.log("Current User API response : ", response);
    if (response.status === 200) {
      const userData = response.data;
      return userData;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.log("Current User API Error....", error);
    toast.error(error.response?.data?.message || "Failed to fetch user data");
  } finally {
    toast.dismiss(loadingToast);
  }
}

export function updateUser(userId, userData) {
  return async (dispatch) => {
    const loadingToast = toast.loading("Updating profile...");
    try {
      const response = await apiConnector(
        UPDATE_USER.t,
        `${UPDATE_USER.e}/${userId}`,
        userData
      );

      console.log("Update User API response : ", response);
      if (response.status === 200) {
        toast.success("Profile updated successfully");
        const updatedUser = response.data;
        const temp = {
          id: response.u_id,
          uname: response.name,
          uemail: response.email,
          profile_url: response.profile_url,
          credits: response.credits,
          role: response.role,
        };
        dispatch(setAccount(temp));
        return updatedUser;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log("Update User API Error....", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}

export async function changePassword(passwordData) {
  const loadingToast = toast.loading("Changing password...");
  try {
    const response = await apiConnector(
      CHANGE_PASSWORD.t,
      CHANGE_PASSWORD.e,
      passwordData
    );

    console.log("Change Password API response : ", response);
    if (response.status === 200) {
      toast.success("Password changed successfully");
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.log("Change Password API Error....", error);
    toast.error(error.response?.data?.message || "Failed to change password");
  } finally {
    toast.dismiss(loadingToast);
  }
}

export async function deleteUser(userId, navigate) {
  const loadingToast = toast.loading("Deactivating account...");
  try {
    const response = await apiConnector(
      DELETE_USER.t,
      `${DELETE_USER.e}/${userId}`
    );

    console.log("Delete User API response : ", response);
    if (response.data.success) {
      toast.success("Account deactivated successfully");
      // Clear user data and navigate to home
      localStorage.clear();
      navigate("/");
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.log("Delete User API Error....", error);
    toast.error(
      error.response?.data?.message || "Failed to deactivate account"
    );
  } finally {
    toast.dismiss(loadingToast);
  }
}

export function getUserCredits(userId, isSelf) {
  return async (dispatch) => {
    const loadingToast = toast.loading("Fetching credits...");
    try {
      const response = await apiConnector(
        USER_CREDITS.t,
        `${USER_CREDITS.e}/${userId}`
      );

      console.log("User Credits API response : ", response);
      if (response.status === 200) {
        const newCredits = response.data.credits;
        if (isSelf) {
          dispatch(setCredits({ credits: newCredits }));
        }
        return newCredits;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log("User Credits API Error....", error);
      toast.error(error.response?.data?.message || "Failed to fetch credits");
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}

//Admin Functions
export async function getUserById(userId) {
    const loadingToast = toast.loading('Fetching user details...');
    try {
      const response = await apiConnector(USER_BY_ID.t, `${USER_BY_ID.e}/${userId}`);

      console.log('Get User API response: ', response);
      if (response.status === 200) {
        toast.success('User details fetched successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user details');
      }
    } catch (error) {
      console.log('Get User API Error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch user details');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}

// Get all users (admin only)
export async function getAllUsers() {
    const loadingToast = toast.loading('Fetching all users...');
    try {
      const response = await apiConnector(ALL_USERS.t, ALL_USERS.e);

      console.log('Get All Users API response: ', response);
      if (response.status === 200) {
        toast.success('Users fetched successfully');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.log('Get All Users API Error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}

// Update user credits
export async function updateUserCredits(userId, amount, reason) {
    const loadingToast = toast.loading('Updating credits...');
    try {
      const response = await apiConnector(UPDATE_CREDITS.t, UPDATE_CREDITS.e, {
        user_id: userId,
        amount: amount,
        reason: reason
      });

      console.log('Update Credits API response: ', response);
      if (response.status === 200) {
        const actionType = amount > 0 ? 'added' : 'deducted';
        toast.success(`Credits ${actionType} successfully`);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update credits');
      }
    } catch (error) {
      console.log('Update Credits API Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update credits');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}

// Manually verify email (admin function)
export async function manuallyVerifyEmail(email) {
    const loadingToast = toast.loading('Verifying email...');
    try {
      const response = await apiConnector(MANUALLY_VERIFY_EMAIL.t, MANUALLY_VERIFY_EMAIL.e, {
        email: email
      });

      console.log('Manual Email Verification API response: ', response);
      if (response.status === 200) {
        toast.success('Email verified successfully');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to verify email');
      }
    } catch (error) {
      console.log('Manual Email Verification API Error:', error);
      toast.error(error.response?.data?.message || 'Failed to verify email');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}

// Get user activity by ID
export async function getUserActivity(userId) {
    const loadingToast = toast.loading('Fetching user activity...');
    try {
      const response = await apiConnector(USER_ACTIVITY.t, `${USER_ACTIVITY.e}/${userId}`);

      console.log('Get User Activity API response: ', response);
      if (response.status === 200) {
        toast.success('User activity fetched successfully');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch user activity');
      }
    } catch (error) {
      console.log('Get User Activity API Error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch user activity');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}
