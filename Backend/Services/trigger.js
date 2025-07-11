const { supabase } = require("../config/config");
const workflowScheduler = require('./scheduler');

const triggersTable = "trigger_schedule";
const workflowsTable = "workflows";

// Utility function to generate cron expression
const generateCronExpression = (scheduleType, days, time) => {
  const [hour, minute] = time.split(":");

  switch (scheduleType) {
    case "daily":
      return `${minute} ${hour} * * *`;

    case "weekly":
      // Days array: [0=Sunday, 1=Monday, ..., 6=Saturday]
      const cronDays = days.length > 0 ? days.join(",") : "*";
      return `${minute} ${hour} * * ${cronDays}`;

    case "monthly":
      // For monthly, days array represents dates of month [1-31]
      const cronDates = days.length > 0 ? days.join(",") : "1";
      return `${minute} ${hour} ${cronDates} * *`;

    default:
      return `${minute} ${hour} * * *`; // Default to daily
  }
};

// Get all triggers for a user
const getAllTriggers = async (userId, workflowId = null) => {
  try {
    let query = supabase
      .from(triggersTable)
      .select(
        `
        ts_id,
        wf_id,
        schedule_type,
        days,
        time,
        cron_expression,
        is_notify_before,
        is_notify_after,
        is_active,
        created_at,
        updated_at,
        workflows!inner(name, description, created_by)
      `
      )
      .eq("workflows.created_by", userId);

    // Filter by workflow_id if provided
    if (workflowId) {
      query = query.eq("wf_id", workflowId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    // Transform data for cleaner response
    const triggers =
      data?.map((trigger) => ({
        ts_id: trigger.ts_id,
        wf_id: trigger.wf_id,
        workflow_name: trigger.workflows.name,
        workflow_description: trigger.workflows.description,
        schedule_type: trigger.schedule_type,
        days: trigger.days,
        time: trigger.time,
        cron_expression: trigger.cron_expression,
        is_notify_before: trigger.is_notify_before,
        is_notify_after: trigger.is_notify_after,
        is_active: trigger.is_active,
        created_at: trigger.created_at,
        updated_at: trigger.updated_at,
      })) || [];

    return triggers;
  } catch (error) {
    console.error("Error in getAllTriggers:", error);
    throw new Error(error.message || "Failed to fetch triggers");
  }
};

// Get trigger by ID
const getTriggerById = async (triggerId, userId) => {
  try {
    const { data, error } = await supabase
      .from(triggersTable)
      .select(
        `
        ts_id,
        wf_id,
        schedule_type,
        days,
        time,
        cron_expression,
        is_notify_before,
        is_notify_after,
        is_active,
        created_at,
        updated_at,
        workflows!inner(name, description, created_by)
      `
      )
      .eq("ts_id", triggerId)
      .eq("workflows.created_by", userId)
      .single();

    if (error) throw error;
    if (!data) throw new Error("Trigger not found or access denied");

    return {
      ts_id: data.ts_id,
      wf_id: data.wf_id,
      workflow_name: data.workflows.name,
      workflow_description: data.workflows.description,
      schedule_type: data.schedule_type,
      days: data.days,
      time: data.time,
      cron_expression: data.cron_expression,
      is_notify_before: data.is_notify_before,
      is_notify_after: data.is_notify_after,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (error) {
    console.error("Error in getTriggerById:", error);
    throw new Error(error.message || "Trigger not found");
  }
};

// Get trigger by workflow ID
const getTriggerByWorkflow = async (workflowId, userId) => {
  try {
    // First verify user owns the workflow
    const { data: workflow, error: workflowError } = await supabase
      .from(workflowsTable)
      .select("wf_id")
      .eq("wf_id", workflowId)
      .eq("created_by", userId)
      .eq("is_active", true)
      .single();

    if (workflowError || !workflow) {
      throw new Error("Workflow not found or access denied");
    }

    const { data, error } = await supabase
      .from(triggersTable)
      .select(
        `
        ts_id,
        wf_id,
        schedule_type,
        days,
        time,
        cron_expression,
        is_notify_before,
        is_notify_after,
        is_active,
        created_at,
        updated_at
      `
      )
      .eq("wf_id", workflowId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned"
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error("Error in getTriggerByWorkflow:", error);
    if (error.message.includes("access denied")) {
      throw error;
    }
    return null; // Return null if no trigger found (not an error)
  }
};

// Create new trigger
const createTrigger = async (triggerData, userId) => {
  try {
    const {
      wf_id,
      schedule_type,
      days,
      time,
      is_notify_before,
      is_notify_after,
    } = triggerData;

    // Verify user owns the workflow
    const { data: workflow, error: workflowError } = await supabase
      .from(workflowsTable)
      .select("wf_id")
      .eq("wf_id", wf_id)
      .eq("created_by", userId)
      .eq("is_active", true)
      .single();

    if (workflowError || !workflow) {
      throw new Error("Workflow not found or access denied");
    }

    // Check if trigger already exists for this workflow
    const existingTrigger = await getTriggerByWorkflow(wf_id, userId);
    if (existingTrigger) {
      throw new Error("Trigger already exists for this workflow");
    }

    // Generate cron expression
    const cronExpression = generateCronExpression(schedule_type, days, time);

    const { data, error } = await supabase
      .from(triggersTable)
      .insert([
        {
          wf_id,
          schedule_type,
          days,
          time,
          cron_expression: cronExpression,
          is_notify_before,
          is_notify_after,
          is_active: true, // Default to active when creating
        },
      ])
      .select("*")
      .single();

    if (error) throw error;
    // Add to scheduler if it's initialized
        if (workflowScheduler.getStatus().isInitialized) {
          await workflowScheduler.addTrigger(data.ts_id);
        }

    return data;
  } catch (error) {
    console.error("Error in createTrigger:", error);
    throw new Error(error.message || "Failed to create trigger");
  }
};

// Update trigger
const updateTrigger = async (triggerId, updates, userId) => {
  try {
    // Verify user owns the trigger
    const existingTrigger = await getTriggerById(triggerId, userId);
    if (!existingTrigger) {
      throw new Error("Trigger not found or access denied");
    }

    // Filter allowed fields for update
    const allowedFields = [
      "schedule_type",
      "days",
      "time",
      "is_notify_before",
      "is_notify_after",
      "is_active",
    ];
    const filteredUpdates = {};

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    });

    if (Object.keys(filteredUpdates).length === 0) {
      throw new Error("No valid fields provided for update");
    }

    // Regenerate cron expression if schedule-related fields are updated
    if (
      filteredUpdates.schedule_type ||
      filteredUpdates.days ||
      filteredUpdates.time
    ) {
      const scheduleType =
        filteredUpdates.schedule_type || existingTrigger.schedule_type;
      const days =
        filteredUpdates.days !== undefined
          ? filteredUpdates.days
          : existingTrigger.days;
      const time = filteredUpdates.time || existingTrigger.time;

      filteredUpdates.cron_expression = generateCronExpression(
        scheduleType,
        days,
        time
      );
    }

    filteredUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(triggersTable)
      .update(filteredUpdates)
      .eq("ts_id", triggerId)
      .select("*")
      .single();

    if (error) throw error;

    // Update scheduler if it's initialized
        if (workflowScheduler.getStatus().isInitialized) {
          await workflowScheduler.updateTrigger(triggerId);
        }

    return data;
  } catch (error) {
    console.error("Error in updateTrigger:", error);
    throw new Error(error.message || "Failed to update trigger");
  }
};

// Get workflows without triggers
const getWorkflowsWithoutTriggers = async (userId) => {
  try {
    // Get all workflows for the user
    const { data: workflows, error: workflowsError } = await supabase
      .from(workflowsTable)
      .select("wf_id, name, description, created_at")
      .eq("created_by", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (workflowsError) throw workflowsError;

    if (!workflows || workflows.length === 0) {
      return [];
    }

    // Get all workflow IDs that have triggers
    const { data: triggers, error: triggersError } = await supabase
      .from(triggersTable)
      .select("wf_id")
      .in(
        "wf_id",
        workflows.map((w) => w.wf_id)
      );

    if (triggersError) throw triggersError;

    const workflowsWithTriggers = new Set(triggers?.map((t) => t.wf_id) || []);

    // Filter out workflows that already have triggers
    const availableWorkflows = workflows.filter(
      (workflow) => !workflowsWithTriggers.has(workflow.wf_id)
    );

    return availableWorkflows;
  } catch (error) {
    console.error("Error in getWorkflowsWithoutTriggers:", error);
    throw new Error(error.message || "Failed to fetch available workflows");
  }
};

// Toggle trigger active status
const toggleTriggerStatus = async (triggerId, userId) => {
  try {
    // Get current trigger status
    const existingTrigger = await getTriggerById(triggerId, userId);
    if (!existingTrigger) {
      throw new Error("Trigger not found or access denied");
    }

    const newStatus = !existingTrigger.is_active;

    const { data, error } = await supabase
      .from(triggersTable)
      .update({
        is_active: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("ts_id", triggerId)
      .select("*")
      .single();

    if (error) throw error;

    // Update scheduler
        if (workflowScheduler.getStatus().isInitialized) {
          if (newStatus) {
            await workflowScheduler.addTrigger(triggerId);
          } else {
            workflowScheduler.removeTrigger(triggerId);
          }
        }

    return { ...data, status_changed_to: newStatus ? "active" : "inactive" };
  } catch (error) {
    console.error("Error in toggleTriggerStatus:", error);
    throw new Error(error.message || "Failed to toggle trigger status");
  }
};

// Delete trigger (hard delete)
const deleteTrigger = async (triggerId, userId) => {
  try {
    // Verify user owns the trigger
    const existingTrigger = await getTriggerById(triggerId, userId);
    if (!existingTrigger) {
      throw new Error("Trigger not found or access denied");
    }

    // Remove from scheduler first
        if (workflowScheduler.getStatus().isInitialized) {
          workflowScheduler.removeTrigger(triggerId);
        }

    const { error } = await supabase
      .from(triggersTable)
      .delete()
      .eq("ts_id", triggerId);

    if (error) throw error;
  } catch (error) {
    console.error("Error in deleteTrigger:", error);
    throw new Error(error.message || "Failed to delete trigger");
  }
};

// Get active triggers only
const getActiveTriggers = async (userId) => {
  try {
    const { data, error } = await supabase
      .from(triggersTable)
      .select(
        `
        ts_id,
        wf_id,
        schedule_type,
        days,
        time,
        cron_expression,
        is_notify_before,
        is_notify_after,
        is_active,
        created_at,
        updated_at,
        workflows!inner(name, description, created_by)
      `
      )
      .eq("workflows.created_by", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const triggers =
      data?.map((trigger) => ({
        ts_id: trigger.ts_id,
        wf_id: trigger.wf_id,
        workflow_name: trigger.workflows.name,
        workflow_description: trigger.workflows.description,
        schedule_type: trigger.schedule_type,
        days: trigger.days,
        time: trigger.time,
        cron_expression: trigger.cron_expression,
        is_notify_before: trigger.is_notify_before,
        is_notify_after: trigger.is_notify_after,
        is_active: trigger.is_active,
        created_at: trigger.created_at,
        updated_at: trigger.updated_at,
      })) || [];

    return triggers;
  } catch (error) {
    console.error("Error in getActiveTriggers:", error);
    throw new Error(error.message || "Failed to fetch active triggers");
  }
};

module.exports = {
  getAllTriggers,
  getTriggerById,
  getTriggerByWorkflow,
  createTrigger,
  updateTrigger,
  getWorkflowsWithoutTriggers,
  toggleTriggerStatus,
  deleteTrigger,
  getActiveTriggers,
};
