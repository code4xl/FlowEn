const triggersService = require('../Services/trigger');

const getAllTriggers = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workflow_id, active_only } = req.query;
    
    let triggers;
    if (active_only === 'true') {
      triggers = await triggersService.getActiveTriggers(userId);
    } else {
      triggers = await triggersService.getAllTriggers(userId, workflow_id);
    }
    
    res.status(200).json(triggers);
  } catch (error) {
    console.error('Error in getAllTriggers controller:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getTriggerById = async (req, res) => {
  try {
    const { trigger_id } = req.params;
    const userId = req.user.id;
    
    if (!trigger_id || isNaN(trigger_id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid trigger ID is required' 
      });
    }

    const trigger = await triggersService.getTriggerById(trigger_id, userId);
    res.status(200).json(trigger);
  } catch (error) {
    console.error('Error in getTriggerById controller:', error);
    res.status(404).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getTriggerByWorkflow = async (req, res) => {
  try {
    const { workflow_id } = req.params;
    const userId = req.user.id;
    
    if (!workflow_id || isNaN(workflow_id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid workflow ID is required' 
      });
    }

    const trigger = await triggersService.getTriggerByWorkflow(workflow_id, userId);
    
    if (!trigger) {
      return res.status(200).json({ 
        trigger_found: false,
        message: 'No trigger found for this workflow'
      });
    }

    res.status(200).json({
      trigger_found: true,
      ...trigger
    });
  } catch (error) {
    console.error('Error in getTriggerByWorkflow controller:', error);
    res.status(404).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createTrigger = async (req, res) => {
  try {
    const { wf_id, schedule_type, days, time, is_notify_before, is_notify_after } = req.body;
    const userId = req.user.id;
    
    if (!wf_id || !schedule_type || !time) {
      return res.status(400).json({ 
        success: false, 
        message: 'Workflow ID, schedule type, and time are required' 
      });
    }

    const triggerData = {
      wf_id,
      schedule_type,
      days: days || [],
      time,
      is_notify_before: is_notify_before || false,
      is_notify_after: is_notify_after || false
    };

    const trigger = await triggersService.createTrigger(triggerData, userId);
    
    res.status(200).json({
      success: true,
      message: 'Trigger created successfully',
      trigger
    });
  } catch (error) {
    console.error('Error in createTrigger controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateTrigger = async (req, res) => {
  try {
    const { trigger_id } = req.params;
    const updates = req.body;
    const userId = req.user.id;
    
    if (!trigger_id || isNaN(trigger_id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid trigger ID is required' 
      });
    }

    const updatedTrigger = await triggersService.updateTrigger(trigger_id, updates, userId);
    
    res.status(200).json({
      success: true,
      message: 'Trigger updated successfully',
      trigger: updatedTrigger
    });
  } catch (error) {
    console.error('Error in updateTrigger controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getAvailableWorkflows = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const workflows = await triggersService.getWorkflowsWithoutTriggers(userId);
    res.status(200).json(workflows);
  } catch (error) {
    console.error('Error in getAvailableWorkflows controller:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const toggleTriggerStatus = async (req, res) => {
  try {
    const { trigger_id } = req.params;
    const userId = req.user.id;
    
    if (!trigger_id || isNaN(trigger_id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid trigger ID is required' 
      });
    }

    const result = await triggersService.toggleTriggerStatus(trigger_id, userId);
    
    res.status(200).json({
      success: true,
      message: `Trigger ${result.status_changed_to}`,
      is_active: result.is_active
    });
  } catch (error) {
    console.error('Error in toggleTriggerStatus controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteTrigger = async (req, res) => {
  try {
    const { trigger_id } = req.params;
    const userId = req.user.id;
    
    if (!trigger_id || isNaN(trigger_id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid trigger ID is required' 
      });
    }

    await triggersService.deleteTrigger(trigger_id, userId);
    
    res.status(200).json({
      success: true,
      message: 'Trigger deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteTrigger controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { 
  getAllTriggers,
  getTriggerById,
  getTriggerByWorkflow,
  createTrigger,
  updateTrigger,
  getAvailableWorkflows,
  toggleTriggerStatus,
  deleteTrigger
};