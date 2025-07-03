// Services/scheduler.js
const cron = require("node-cron");
const { supabase } = require("../config/config");
const axios = require("axios");

const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000";

const mailSender = require("./Mail/mailSender");
const workflowBeforeTemplate = require("./Mail/Mail/Templates/WorkflowBeforeTemplate");
const workflowSuccessTemplate = require("./Mail/Mail/Templates/WorkflowSuccessTemplate");
const workflowFailureTemplate = require("./Mail/Mail/Templates/WorkflowFailureTemplate");

class WorkflowScheduler {
  constructor() {
    this.scheduledJobs = new Map(); // Store active cron jobs
    this.isInitialized = false;
  }

  // Initialize the scheduler
  async initialize() {
    try {
      console.log("🚀 Initializing Workflow Scheduler...");
      await this.loadAndScheduleAllTriggers();
      this.isInitialized = true;
      console.log("✅ Workflow Scheduler initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize scheduler:", error);
      throw error;
    }
  }

  // Load all active triggers and schedule them
  async loadAndScheduleAllTriggers() {
    try {
      const { data: triggers, error } = await supabase
        .from("trigger_schedule")
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
          workflows!inner(
            wf_id,
            name,
            created_by,
            credits,
            data,
            is_active
          )
        `
        )
        .eq("is_active", true)
        .eq("workflows.is_active", true);

      if (error) throw error;

      console.log(
        `📅 Found ${triggers?.length || 0} active triggers to schedule`
      );

      // Schedule each trigger
      for (const trigger of triggers || []) {
        await this.scheduleWorkflow(trigger);
      }
    } catch (error) {
      console.error("Error loading triggers:", error);
      throw error;
    }
  }

  // Schedule a single workflow
  async scheduleWorkflow(trigger) {
    try {
      const { ts_id, cron_expression, workflows } = trigger;

      if (!cron_expression) {
        console.warn(`⚠️ No cron expression for trigger ${ts_id}`);
        return;
      }

      // Validate cron expression
      if (!cron.validate(cron_expression)) {
        console.error(
          `❌ Invalid cron expression for trigger ${ts_id}: ${cron_expression}`
        );
        return;
      }

      // Create the cron job
      const job = cron.schedule(
        cron_expression,
        async () => {
          await this.executeWorkflow(trigger);
        },
        {
          scheduled: true,
          timezone: process.env.TIMEZONE || "Asia/Kolkata",
        }
      );

      // Store the job reference
      this.scheduledJobs.set(ts_id, job);

      console.log(
        `✅ Scheduled workflow "${workflows.name}" (Trigger: ${ts_id}) with cron: ${cron_expression}`
      );
    } catch (error) {
      console.error(
        `Error scheduling workflow for trigger ${trigger.ts_id}:`,
        error
      );
    }
  }

  // Execute a workflow
  async executeWorkflow(trigger) {
    const startTime = Date.now();
    const { ts_id, wf_id, workflows, is_notify_before, is_notify_after } =
      trigger;

    console.log(`🔄 Executing workflow "${workflows.name}" (ID: ${wf_id})`);

    try {
      // Pre-execution notification
      if (is_notify_before) {
        await this.sendNotification(
          workflows.created_by,
          "before",
          workflows.name
        );
      }

      // Check user credits
      const hasCredits = await this.checkUserCredits(
        workflows.created_by,
        workflows.credits
      );
      if (!hasCredits) {
        throw new Error("Insufficient credits");
      }

      // Execute the workflow via FastAPI
      const result = await this.callFastAPIWorkflow(workflows);

      // Deduct credits on successful execution
      await this.deductCredits(workflows.created_by, workflows.credits);

      // Update workflow execution count
      await this.updateWorkflowExecutionCount(wf_id);

      // Log success
      const executionTime = Date.now() - startTime;
      await this.logExecution(
        wf_id,
        ts_id,
        true,
        "Workflow executed successfully",
        `${executionTime}ms`
      );

      // Post-execution notification
      if (is_notify_after) {
        await this.sendNotification(
          workflows.created_by,
          "after",
          workflows.name,
          true,
          null,
          result,
          `${executionTime}ms`
        );
      }

      console.log(
        `✅ Workflow "${workflows.name}" executed successfully in ${executionTime}ms`
      );
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error.message || "Unknown error";

      console.error(`❌ Workflow "${workflows.name}" failed:`, errorMessage);

      // Log failure
      await this.logExecution(
        wf_id,
        ts_id,
        false,
        errorMessage,
        `${executionTime}ms`
      );

      // Post-execution failure notification
      if (is_notify_after) {
        await this.sendNotification(
          workflows.created_by,
          "after",
          workflows.name,
          false,
          errorMessage,
          null,
          `${executionTime}ms`
        );
      }
    }
  }

  // Check if user has sufficient credits
  async checkUserCredits(userId, requiredCredits) {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("credits")
        .eq("u_id", userId)
        .single();

      if (error || !user) {
        console.error(`User ${userId} not found`);
        return false;
      }

      return user.credits >= requiredCredits;
    } catch (error) {
      console.error("Error checking user credits:", error);
      return false;
    }
  }

  // Deduct credits from user
  async deductCredits(userId, amount) {
    try {
      const { error } = await supabase.rpc("deduct_user_credits", {
        user_id: userId,
        credit_amount: amount,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error deducting credits:", error);
      throw error;
    }
  }

  // Update workflow execution count
  async updateWorkflowExecutionCount(workflowId) {
    try {
      const { error } = await supabase.rpc("increment_workflow_execution", {
        workflow_id: workflowId,
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error updating execution count:", error);
    }
  }

  // Call FastAPI workflow execution endpoint
  async callFastAPIWorkflow(workflow) {
    try {
      //   const fastApiUrl = process.env.FASTAPI_URL || "http://localhost:8000";
      const response = await axios.post(
        `${fastApiUrl}workflow/execute`,
        {
          ...workflow.data,
        },
        // {
        //   workflow_id: workflow.wf_id,
        //   workflow_data: workflow.data,
        //   user_id: workflow.created_by,
        // },
        {
          timeout: 300000, // 5 minutes timeout
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.FASTAPI_SECRET}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `FastAPI Error: ${error.response.status} - ${
            error.response.data.message || "Unknown error"
          }`
        );
      } else if (error.request) {
        throw new Error("FastAPI service unavailable");
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  //Log Execution
  async logExecution(workflowId, triggerId, status, remark, executionTime) {
    try {
      const { error } = await supabase.from("trigger_log").insert([
        {
          wf_id: workflowId,
          ts_id: triggerId,
          status,
          remark,
          execution_time: executionTime,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error logging execution:", error);
    }
  }

  // Send notification to user
  async sendNotification(
    userId,
    type,
    workflowName,
    success = null,
    errorMessage = null,
    output = null,
    executionTime = null
  ) {
    try {
      // Get user email and name
      const { data: user, error } = await supabase
        .from("users")
        .select("email, name")
        .eq("u_id", userId)
        .single();

      if (error || !user) {
        console.warn(`User ${userId} not found for notification`);
        return;
      }

      let subject, htmlContent;
      const currentTime = new Date().toLocaleString("en-US", {
        timeZone: process.env.TIMEZONE || "UTC",
        dateStyle: "full",
        timeStyle: "short",
      });

      if (type === "before") {
        // Before execution notification
        subject = `🚀 Workflow Starting: ${workflowName}`;
        htmlContent = workflowBeforeTemplate(
          user.name,
          workflowName,
          currentTime
        );
      } else if (type === "after") {
        if (success) {
          // Success notification
          subject = `✅ Workflow Completed: ${workflowName}`;
          htmlContent = workflowSuccessTemplate(
            user.name,
            workflowName,
            executionTime || "Unknown",
            output
          );
        } else {
          // Failure notification
          subject = `❌ Workflow Failed: ${workflowName}`;
          htmlContent = workflowFailureTemplate(
            user.name,
            workflowName,
            executionTime || "Unknown",
            errorMessage
          );
        }
      }

      // Send email using your existing mailSender
      const mailResponse = await mailSender(user.email, subject, htmlContent);

      console.log(`📧 Email notification sent to ${user.email}: ${subject}`);
      return mailResponse;
    } catch (error) {
      console.error("Error sending email notification:", error);
      // Don't throw error to prevent breaking workflow execution
    }
  }

  // Add new trigger to scheduler
  async addTrigger(triggerId) {
    try {
      const { data: trigger, error } = await supabase
        .from("trigger_schedule")
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
          workflows!inner(
            wf_id,
            name,
            created_by,
            credits,
            data,
            is_active
          )
        `
        )
        .eq("ts_id", triggerId)
        .eq("is_active", true)
        .eq("workflows.is_active", true)
        .single();

      if (error || !trigger) {
        console.warn(`Trigger ${triggerId} not found or inactive`);
        return;
      }

      await this.scheduleWorkflow(trigger);
    } catch (error) {
      console.error(`Error adding trigger ${triggerId}:`, error);
    }
  }

  // Remove trigger from scheduler
  removeTrigger(triggerId) {
    try {
      const job = this.scheduledJobs.get(triggerId);
      if (job) {
        job.stop();
        job.destroy();
        this.scheduledJobs.delete(triggerId);
        console.log(`🗑️ Removed trigger ${triggerId} from scheduler`);
      }
    } catch (error) {
      console.error(`Error removing trigger ${triggerId}:`, error);
    }
  }

  // Update existing trigger
  async updateTrigger(triggerId) {
    this.removeTrigger(triggerId);
    await this.addTrigger(triggerId);
  }

  // Get scheduler status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      activeJobs: this.scheduledJobs.size,
      jobIds: Array.from(this.scheduledJobs.keys()),
    };
  }

  // Graceful shutdown
  shutdown() {
    console.log("🛑 Shutting down scheduler...");
    for (const [triggerId, job] of this.scheduledJobs) {
      job.stop();
      job.destroy();
    }
    this.scheduledJobs.clear();
    this.isInitialized = false;
    console.log("✅ Scheduler shutdown complete");
  }
}

// Create singleton instance
const workflowScheduler = new WorkflowScheduler();

module.exports = workflowScheduler;
