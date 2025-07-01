import {toast} from 'react-hot-toast';
import { apiConnector } from '../Connector';

import { executeEndpoints } from '../Apis';

const {EXECUTE_WF} = executeEndpoints;

export async function executeWF(workflowData, navigate) {
  const loadingToast = toast.loading('Executing workflow...');
  
  try {
    const response = await apiConnector(
      EXECUTE_WF.t,
      EXECUTE_WF.e,
      workflowData
    );

    if (response.data.success) {
      toast.success('Workflow executed successfully!');
      
      return response.data;
      
    } else {
      throw new Error(response.data.message || 'Failed to execute workflow');
    }
    
  } catch (error) {
    console.log('Execute Workflow API Error:', error);
    toast.error(error.response?.data?.message || error.message || 'Failed to execute workflow');
    
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to execute workflow',
      result: null,
      execution_id: null
    };
    
  } finally {
    toast.dismiss(loadingToast);
  }
}