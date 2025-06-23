const { supabase } = require("../config/config");

const nodesTable = "nodes";
const workflowsTable = "workflows";

// Get all available node templates
const getAllNodes = async () => {
  try {
    const { data, error } = await supabase
      .from(nodesTable)
      .select("node_id, name, description, type, category, required, is_static, credits, node_component_name")
      .eq("is_active", true)
      .order("node_id", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getAllNodes:", error);
    throw new Error(error.message || "Failed to fetch nodes");
  }
};

// Create a new workflow
const createWorkflow = async (workflowData) => {
  try {
    const { name, description, credits, created_by, data } = workflowData;

    const { data: workflow, error } = await supabase
      .from(workflowsTable)
      .insert([{
        name,
        description: description || null,
        created_by,
        credits: credits || 0,
        data: data, // JSON object containing nodes and edges
        is_active: true,
        executed_count: 0
      }])
      .select("wf_id")
      .single();

    if (error) throw error;
    return workflow.wf_id;
  } catch (error) {
    console.error("Error in createWorkflow:", error);
    throw new Error(error.message || "Failed to create workflow");
  }
};

// Get workflow by ID
const getWorkflowById = async (workflowId, userId) => {
  try {
    const { data, error } = await supabase
      .from(workflowsTable)
      .select("wf_id, name, description, credits, data, created_at, updated_at, is_active")
      .eq("wf_id", workflowId)
      .eq("created_by", userId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Workflow not found or access denied");

    return data;
  } catch (error) {
    console.error("Error in getWorkflowById:", error);
    throw new Error(error.message || "Workflow not found");
  }
};

// Update workflow
const updateWorkflow = async (workflowId, updates, userId) => {
  try {
    // Filter allowed fields for update
    const allowedFields = ['name', 'description', 'credits', 'data'];
    const filteredUpdates = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    filteredUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(workflowsTable)
      .update(filteredUpdates)
      .eq("wf_id", workflowId)
      .eq("created_by", userId)
      .eq("is_active", true)
      .select("wf_id")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Workflow not found or access denied");

  } catch (error) {
    console.error("Error in updateWorkflow:", error);
    throw new Error(error.message || "Failed to update workflow");
  }
};

// Delete workflow (soft delete)
const deleteWorkflow = async (workflowId, userId) => {
  try {
    const { data, error } = await supabase
      .from(workflowsTable)
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq("wf_id", workflowId)
      .eq("created_by", userId)
      .eq("is_active", true)
      .select("wf_id")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Workflow not found or access denied");

  } catch (error) {
    console.error("Error in deleteWorkflow:", error);
    throw new Error(error.message || "Failed to delete workflow");
  }
};

// Activate workflow (undo soft delete)
const activateWorkflow = async (workflowId, userId) => {
  try {
    const { data, error } = await supabase
      .from(workflowsTable)
      .update({ 
        is_active: true,
        updated_at: new Date().toISOString()
      })
      .eq("wf_id", workflowId)
      .eq("created_by", userId)
      .eq("is_active", false)
      .select("wf_id")
      .single();

    if (error) throw error;
    if (!data) throw new Error("Workflow not found or access denied");

  } catch (error) {
    console.error("Error in activateWorkflow:", error);
    throw new Error(error.message || "Failed to activate workflow");
  }
};

// Get all workflows for a user
const getUserWorkflows = async (userId) => {
  try {
    const { data, error } = await supabase
      .from(workflowsTable)
      .select("wf_id, name, description, credits, is_active, executed_count, created_at, updated_at")
      .eq("created_by", userId)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error in getUserWorkflows:", error);
    throw new Error(error.message || "Failed to fetch workflows");
  }
};

// Get workflow credits
const getWorkflowCredits = async (workflowId, userId) => {
  try {
    const { data, error } = await supabase
      .from(workflowsTable)
      .select("credits")
      .eq("wf_id", workflowId)
      .eq("created_by", userId)
      .eq("is_active", true)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Workflow not found or access denied");

    return data.credits;
  } catch (error) {
    console.error("Error in getWorkflowCredits:", error);
    throw new Error(error.message || "Failed to get workflow credits");
  }
};

module.exports = {
  getAllNodes,
  createWorkflow,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
  activateWorkflow,
  getUserWorkflows,
  getWorkflowCredits
};