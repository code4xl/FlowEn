const workflowScheduler = require('../Services/scheduler');

// Get scheduler status and statistics
const getSchedulerStatus = async (req, res) => {
  try {
    const status = workflowScheduler.getStatus();
    res.status(200).json({
      success: true,
      ...status,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get scheduler status' 
    });
  }
};

// Manually trigger a workflow (for testing)
const manualTrigger = async (req, res) => {
  try {
    const { workflow_id } = req.params;
    const userId = req.user.id;

    // Get workflow and trigger data
    const { supabase } = require('../config/config');
    const { data: trigger, error } = await supabase
      .from('trigger_schedule')
      .select(`
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
      `)
      .eq('wf_id', workflow_id)
      .eq('workflows.created_by', userId)
      .eq('is_active', true)
      .eq('workflows.is_active', true)
      .single();

    if (error || !trigger) {
      return res.status(404).json({
        success: false,
        message: 'Workflow or trigger not found'
      });
    }

    // Execute the workflow manually
    await workflowScheduler.executeWorkflow(trigger);

    res.status(200).json({
      success: true,
      message: `Workflow "${trigger.workflows.name}" executed manually`
    });

  } catch (error) {
    console.error('Error in manual trigger:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get execution logs for a workflow
const getExecutionLogs = async (req, res) => {
  try {
    const { workflow_id } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;

    const { supabase } = require('../config/config');

    // First verify user owns the workflow
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('wf_id')
      .eq('wf_id', workflow_id)
      .eq('created_by', userId)
      .single();

    if (workflowError || !workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found or access denied'
      });
    }

    // Get execution logs
    const { data: logs, error } = await supabase
      .from('trigger_log')
      .select('*')
      .eq('wf_id', workflow_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.status(200).json({
      success: true,
      logs: logs || [],
      total: logs?.length || 0
    });

  } catch (error) {
    console.error('Error getting execution logs:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get workflow execution statistics
const getWorkflowStats = async (req, res) => {
  try {
    const { workflow_id } = req.params;
    const userId = req.user.id;

    const { supabase } = require('../config/config');

    // First verify user owns the workflow
    const { data: workflow, error: workflowError } = await supabase
      .from('workflows')
      .select('wf_id, name, executed_count')
      .eq('wf_id', workflow_id)
      .eq('created_by', userId)
      .single();

    if (workflowError || !workflow) {
      return res.status(404).json({
        success: false,
        message: 'Workflow not found or access denied'
      });
    }

    // Get detailed statistics using the database function
    const { data: stats, error: statsError } = await supabase
      .rpc('get_workflow_execution_stats', { workflow_id: parseInt(workflow_id) });

    if (statsError) throw statsError;

    const statistics = stats[0] || {
      total_executions: 0,
      successful_executions: 0,
      failed_executions: 0,
      last_execution: null,
      avg_execution_time: 0
    };

    res.status(200).json({
      success: true,
      workflow_name: workflow.name,
      executed_count: workflow.executed_count,
      ...statistics
    });

  } catch (error) {
    console.error('Error getting workflow stats:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Restart scheduler (admin only - implement proper auth check)
const restartScheduler = async (req, res) => {
  try {
    // Add admin auth check here
    // if (!req.user.isAdmin) return res.status(403).json({...});

    console.log('🔄 Restarting scheduler...');
    workflowScheduler.shutdown();
    await workflowScheduler.initialize();

    res.status(200).json({
      success: true,
      message: 'Scheduler restarted successfully',
      status: workflowScheduler.getStatus()
    });

  } catch (error) {
    console.error('Error restarting scheduler:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to restart scheduler' 
    });
  }
};

module.exports = {
  getSchedulerStatus,
  manualTrigger,
  getExecutionLogs,
  getWorkflowStats,
  restartScheduler
};