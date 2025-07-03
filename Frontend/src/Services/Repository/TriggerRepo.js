import { toast } from 'react-hot-toast';
import { apiConnector } from '../Connector';
import { triggerEndpoints } from '../Apis';

const { 
  GET_ALL, 
  GET_SPECIFIC, 
  GET_FOR_WF, 
  CREATE_TRIGGER, 
  UPDATE_TRIGGER, 
  GET_WF_WITHOUT_TRIGGERS,
  TOGGLE_TRIGGER,
  HARD_DELETE,
} = triggerEndpoints;

// Get all triggers with optional workflow filter
export async function getAllTriggers(workflowId = null) {
    const loadingToast = toast.loading('Loading triggers...');
    try {
      const params = workflowId ? { workflow_id: workflowId } : {};
      const response = await apiConnector(GET_ALL.t, GET_ALL.e, null, null, params);

      console.log('Get All Triggers API response: ', response);
      
      if (response.status === 200) {
        toast.success('Triggers loaded successfully');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to load triggers');
      }
    } catch (error) {
      console.log('Get All Triggers API Error: ', error);
      toast.error(error.response?.data?.message || 'Failed to load triggers');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}

// Get specific trigger by ID
export function getTriggerById(triggerId) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Loading trigger details...');
    try {
      const response = await apiConnector(
        GET_SPECIFIC.t, 
        `${GET_SPECIFIC.e}/${triggerId}`
      );

      console.log('Get Trigger By ID API response: ', response);
      
      if (response.status === 200) {
        toast.success('Trigger details loaded successfully');
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to load trigger details');
      }
    } catch (error) {
      console.log('Get Trigger By ID API Error: ', error);
      toast.error(error.response?.data?.message || 'Failed to load trigger details');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}

// Get trigger for specific workflow
export function getTriggerForWorkflow(workflowId) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Loading workflow trigger...');
    try {
      const response = await apiConnector(
        GET_FOR_WF.t, 
        `${GET_FOR_WF.e}/${workflowId}`
      );

      console.log('Get Trigger For Workflow API response: ', response);
      
      if (response.status === 200) {
        if (response.data.data) {
          toast.success('Workflow trigger loaded successfully');
        } else {
          toast.info('No trigger found for this workflow');
        }
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to load workflow trigger');
      }
    } catch (error) {
      console.log('Get Trigger For Workflow API Error: ', error);
      toast.error(error.response?.data?.message || 'Failed to load workflow trigger');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}

// Create new trigger
export async function createTrigger(triggerData, navigate = null) {
    const loadingToast = toast.loading('Creating trigger...');
    try {
      const response = await apiConnector(
        CREATE_TRIGGER.t, 
        CREATE_TRIGGER.e, 
        triggerData
      );

      console.log('Create Trigger API response: ', response);
      
      if (response.status === 200) {
        toast.success('Trigger created successfully!');
        if (navigate) {
          navigate('/triggers'); // Navigate to triggers list or appropriate page
        }
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create trigger');
      }
    } catch (error) {
      console.log('Create Trigger API Error: ', error);
      toast.error(error.response?.data?.message || 'Failed to create trigger');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}

// Update existing trigger
export async function updateTrigger(triggerId, triggerData, navigate = null) {
    const loadingToast = toast.loading('Updating trigger...');
    try {
      const response = await apiConnector(
        UPDATE_TRIGGER.t, 
        `${UPDATE_TRIGGER.e}/${triggerId}`, 
        triggerData
      );

      console.log('Update Trigger API response: ', response);
      
      if (response.status === 200) {
        toast.success('Trigger updated successfully!');
        if (navigate) {
          navigate('/triggers'); // Navigate to triggers list or appropriate page
        }
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update trigger');
      }
    } catch (error) {
      console.log('Update Trigger API Error: ', error);
      toast.error(error.response?.data?.message || 'Failed to update trigger');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}

// Get workflows without triggers (for easier trigger creation)
export async function getWorkflowsWithoutTriggers() {
    const loadingToast = toast.loading('Loading available workflows...');
    try {
      const response = await apiConnector(
        GET_WF_WITHOUT_TRIGGERS.t, 
        GET_WF_WITHOUT_TRIGGERS.e
      );

      console.log('Get Workflows Without Triggers API response: ', response);
      
      if (response.status === 200) {
        toast.success('Available workflows loaded successfully');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to load available workflows');
      }
    } catch (error) {
      console.log('Get Workflows Without Triggers API Error: ', error);
      toast.error(error.response?.data?.message || 'Failed to load available workflows');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}

// Delete trigger (if you need this functionality later)
export function deleteTrigger(triggerId) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Deleting trigger...');
    try {
      const response = await apiConnector(
        'DELETE', 
        `${UPDATE_TRIGGER.e}/${triggerId}`
      );

      console.log('Delete Trigger API response: ', response);
      
      if (response.status === 200) {
        toast.success('Trigger deleted successfully!');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete trigger');
      }
    } catch (error) {
      console.log('Delete Trigger API Error: ', error);
      toast.error(error.response?.data?.message || 'Failed to delete trigger');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}

// Helper function to validate trigger data before sending
export function validateTriggerData(triggerData) {
  const { wf_id, schedule_type, time } = triggerData;
  
  if (!wf_id) {
    toast.error('Please select a workflow');
    return false;
  }
  
  if (!schedule_type) {
    toast.error('Please select a schedule type');
    return false;
  }
  
  if (!time) {
    toast.error('Please select a time');
    return false;
  }
  
  if (schedule_type === 'weekly' && (!triggerData.days || triggerData.days.length === 0)) {
    toast.error('Please select at least one day for weekly schedule');
    return false;
  }
  
  return true;
}

export async function toggleTrigger(triggerId) {
    const loadingToast = toast.loading('Toggling trigger status...');
    try {
      const response = await apiConnector(
        TOGGLE_TRIGGER.t, 
        `${TOGGLE_TRIGGER.e}/${triggerId}`, {}
      );

      console.log('Toggle Trigger API response: ', response);
      
      if (response.status === 200) {
        toast.success(`Trigger ${response.data.is_active ? 'activated' : 'deactivated'} successfully!`);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to toggle trigger status');
      }
    } catch (error) {
      console.log('Toggle Trigger API Error: ', error);
      toast.error(error.response?.data?.message || 'Failed to toggle trigger status');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}

// Hard delete trigger (permanent deletion)
export async function hardDeleteTrigger(triggerId) {
    const loadingToast = toast.loading('Permanently deleting trigger...');
    try {
      const response = await apiConnector(
        HARD_DELETE.t, 
        `${HARD_DELETE.e}/${triggerId}`,
        {}
      );

      console.log('Hard Delete Trigger API response: ', response);
      
      if (response.status === 200) {
        toast.success('Trigger permanently deleted!');
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete trigger');
      }
    } catch (error) {
      console.log('Hard Delete Trigger API Error: ', error);
      toast.error(error.response?.data?.message || 'Failed to delete trigger');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
}