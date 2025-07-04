import { toast } from "react-hot-toast";
import { apiConnector } from "../Connector";
import { schedulerEndpoints } from "../Apis";

const { GET_DETAIL_LOGS, GET_EXECUTION_STATS, EXECUTE_WF } = schedulerEndpoints;

export const getDetailLogs = async (workflowId) => {
  const loadingToast = toast.loading("Loading logs...");
  try {
    const response = await apiConnector(
      GET_DETAIL_LOGS.t,
      `${GET_DETAIL_LOGS.e}/${workflowId}`,
    );

    console.log("Get Detail Logs API response:", response);

    if (response.data.success) {
      toast.success("Logs loaded successfully");
      return {
        success: true,
        logs: response.data.logs,
        total: response.data.total,
      };
    } else {
      throw new Error(response.data.message || "Failed to load logs");
    }
  } catch (error) {
    console.log("Get Detail Logs API Error:", error);
    toast.error(error.response?.data?.message || "Failed to load logs");
    return {
      success: false,
      logs: [],
      total: 0,
    };
  } finally {
    toast.dismiss(loadingToast);
  }
};

export const getExecutionStats = async (workflowId) => {
  const loadingToast = toast.loading("Loading execution stats...");
  try {
    const response = await apiConnector(
      GET_EXECUTION_STATS.t,
      `${GET_EXECUTION_STATS.e}/${workflowId}`,
      null,
      null
    );

    console.log("Get Execution Stats API response:", response);

    if (response.data.success) {
      toast.success("Execution stats loaded successfully");
      return {
        success: true,
        workflowName: response.data.workflow_name,
        executedCount: response.data.executed_count,
        totalExecutions: response.data.total_executions,
        successfulExecutions: response.data.successful_executions,
        failedExecutions: response.data.failed_executions,
        lastExecution: response.data.last_execution,
        avgExecutionTime: response.data.avg_execution_time,
      };
    } else {
      throw new Error(
        response.data.message || "Failed to load execution stats"
      );
    }
  } catch (error) {
    console.log("Get Execution Stats API Error:", error);
    toast.error(
      error.response?.data?.message || "Failed to load execution stats"
    );
    return {
      success: false,
      workflowName: "",
      executedCount: 0,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      lastExecution: null,
      avgExecutionTime: 0,
    };
  } finally {
    toast.dismiss(loadingToast);
  }
};

export const executeWorkflow = async (workflowId) => {
  const loadingToast = toast.loading("Executing workflow...");
  try {
    const response = await apiConnector(
      EXECUTE_WF.t,
      `${EXECUTE_WF.e}/${workflowId}`,
      {}
    );

    console.log("Execute Workflow API response:", response);

    if (response.data.success) {
      toast.success(response.data.message || "Workflow executed successfully");
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      throw new Error(response.data.message || "Failed to execute workflow");
    }
  } catch (error) {
    console.log("Execute Workflow API Error:", error);
    toast.error(error.response?.data?.message || "Failed to execute workflow");
    return {
      success: false,
      message: error.response?.data?.message || "Failed to execute workflow",
    };
  } finally {
    toast.dismiss(loadingToast);
  }
};
