import { toast } from 'react-hot-toast';
import { apiConnector } from '../Connector';

import { builderEndpoints } from '../Apis';

const {
  GET_NODES,
  CREATE_WORKFLOW,
  GET_WORKFLOW_BY_ID,
  UPDATE_WORKFLOW,
  DELETE_WORKFLOW,
  ACTIVATE_WORKFLOW,
  GET_USER_WORKFLOWS,
  GET_WORKFLOW_CREDITS
} = builderEndpoints;


export function getNodes() {
  return async (dispatch) => {
    const loadingToast = toast.loading('Loading node templates...');
    try {
      const response = await apiConnector(GET_NODES.t, GET_NODES.e);

      // Check if response is successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        toast.success('Node templates loaded successfully');
        // Return the response data directly (which should be the nodes array)
        return response.data;
      } else {
        throw new Error('Failed to fetch nodes');
      }
    } catch (error) {
      console.log('Get Nodes API Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to load node templates');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}


export function createWorkflow(name, description, credits, data, navigate = null) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Creating workflow...');
    try {
      const response = await apiConnector(
        CREATE_WORKFLOW.t,
        CREATE_WORKFLOW.e,
        {
          name,
          description,
          credits,
          data
        }
      );

      if (response.data.success) {
        toast.success('Workflow created successfully!');
        
        // Navigate to the newly created workflow if navigation function provided
        if (navigate && response.data.wf_id) {
          navigate(`/workflow/${response.data.wf_id}`);
        }
        
        return {
          success: true,
          wf_id: response.data.wf_id,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to create workflow');
      }
    } catch (error) {
      console.log('Create Workflow API Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create workflow');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}


export function getWorkflowById(workflowId) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Loading workflow...');
    try {
      const response = await apiConnector(
        GET_WORKFLOW_BY_ID.t,
        `${GET_WORKFLOW_BY_ID.e}/${workflowId}`
      );

      if (response.status == 200) {
        toast.success('Workflow loaded successfully');
        return response.data; // Return the workflow data
      } else {
        throw new Error(response.data.message || 'Failed to fetch workflow');
      }
    } catch (error) {
      console.log('Get Workflow By ID API Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to load workflow');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}


export function updateWorkflow(workflowId, updateData) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Updating workflow...');
    try {
      const response = await apiConnector(
        UPDATE_WORKFLOW.t,
        `${UPDATE_WORKFLOW.e}/${workflowId}`,
        updateData
      );

      if (response.data.success) {
        toast.success('Workflow updated successfully!');
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to update workflow');
      }
    } catch (error) {
      console.log('Update Workflow API Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update workflow');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}


export function deleteWorkflow(workflowId, navigate = null) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Archiving workflow...');
    try {
      const response = await apiConnector(
        DELETE_WORKFLOW.t,
        `${DELETE_WORKFLOW.e}/${workflowId}`,
        {}
      );

      if (response.data.success) {
        toast.success('Workflow archived successfully');
        
        // Navigate away from the deleted workflow if navigation function provided
        if (navigate) {
          navigate('/workflows');
        }
        
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to archive workflow');
      }
    } catch (error) {
      console.log('Delete Workflow API Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to archive workflow');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}

export function activateWorkflow(workflowId) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Activating workflow...');
    try {
      const response = await apiConnector(
        ACTIVATE_WORKFLOW.t,
        `${ACTIVATE_WORKFLOW.e}/${workflowId}`,
        {}
      );

      if (response.data.success) {
        toast.success('Workflow activated successfully!');
        return {
          success: true,
          message: response.data.message
        };
      } else {
        throw new Error(response.data.message || 'Failed to activate workflow');
      }
    } catch (error) {
      console.log('Activate Workflow API Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to activate workflow');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}


export function getUserWorkflows() {
  return async (dispatch) => {
    const loadingToast = toast.loading('Loading your workflows...');
    try {
      const response = await apiConnector(
        GET_USER_WORKFLOWS.t,
        GET_USER_WORKFLOWS.e
      );

      if (response.status >= 200 && response.status < 300) {
        toast.success('Workflows loaded successfully');
        return response.data; // Return the workflows array
      } else {
        throw new Error(response.data.message || 'Failed to fetch workflows');
      }
    } catch (error) {
      console.log('Get User Workflows API Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to load workflows');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}


export function getWorkflowCredits(workflowId) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Calculating workflow credits...');
    try {
      const response = await apiConnector(
        GET_WORKFLOW_CREDITS.t,
        `${GET_WORKFLOW_CREDITS.e}/${workflowId}`
      );

      if (response.data.success) {
        toast.success('Credit calculation complete');
        return {
          credits: response.data.credits,
          workflowId
        };
      } else {
        throw new Error(response.data.message || 'Failed to calculate credits');
      }
    } catch (error) {
      console.log('Get Workflow Credits API Error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to calculate credits');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}

export function autoSaveWorkflow(workflowId, data) {
  return async (dispatch) => {
    try {
      const response = await apiConnector(
        UPDATE_WORKFLOW.t,
        `${UPDATE_WORKFLOW.e}/${workflowId}`,
        { data }
      );

      if (response.data.success) {
        return { success: true };
      } else {
        throw new Error(response.data.message || 'Auto-save failed');
      }
    } catch (error) {
      console.log('Auto-save Workflow Error:', error);
      // Silent failure for auto-save - don't show error toast
      return { success: false, error: error.message };
    }
  };
}

export function getMultipleWorkflows(workflowIds) {
  return async (dispatch) => {
    const loadingToast = toast.loading('Loading workflows...');
    try {
      const promises = workflowIds.map(id => 
        apiConnector(GET_WORKFLOW_BY_ID.t, `${GET_WORKFLOW_BY_ID.e}/${id}`)
      );
      
      const responses = await Promise.allSettled(promises);
      
      const successfulWorkflows = responses
        .filter(result => result.status === 'fulfilled' && result.value.data.success)
        .map(result => result.value.data.data);
      
      const failedCount = responses.length - successfulWorkflows.length;
      
      if (failedCount > 0) {
        toast.warning(`${failedCount} workflow(s) could not be loaded`);
      } else {
        toast.success('All workflows loaded successfully');
      }
      
      return successfulWorkflows;
    } catch (error) {
      console.log('Get Multiple Workflows Error:', error);
      toast.error('Failed to load workflows');
      throw error;
    } finally {
      toast.dismiss(loadingToast);
    }
  };
}