const builderService = require('../Services/builder');

const getNodes = async (req, res) => {
  try {
    const nodes = await builderService.getAllNodes();
    res.status(200).json(nodes);
  } catch (error) {
    console.error('Error in getNodes controller:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const createWorkflow = async (req, res) => {
  try {
    const { name, description, credits, data } = req.body;
    // console.log('Creating workflow with data:', req.body);
    const userId = req.user.id;
    
    if (!name || !data) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and data are required' 
      });
    }

    const workflowId = await builderService.createWorkflow({
      name,
      description,
      credits: credits || 0,
      created_by: userId,
      data
    });

    res.status(201).json({
      success: true,
      wf_id: workflowId,
      message: 'Workflow created'
    });
  } catch (error) {
    console.error('Error in createWorkflow controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getWorkflowById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid workflow ID is required' 
      });
    }

    const workflow = await builderService.getWorkflowById(id, userId);
    res.status(200).json(workflow);
  } catch (error) {
    console.error('Error in getWorkflowById controller:', error);
    res.status(404).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const updateWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid workflow ID is required' 
      });
    }

    await builderService.updateWorkflow(id, updates, userId);
    res.status(200).json({
      success: true,
      message: 'Workflow updated.'
    });
  } catch (error) {
    console.error('Error in updateWorkflow controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const deleteWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid workflow ID is required' 
      });
    }

    await builderService.deleteWorkflow(id, userId);
    res.status(200).json({
      success: true,
      message: 'Workflow archived.'
    });
  } catch (error) {
    console.error('Error in deleteWorkflow controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const activateWorkflow = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid workflow ID is required' 
      });
    }

    await builderService.activateWorkflow(id, userId);
    res.status(200).json({
      success: true,
      message: 'Workflow activated.'
    });
  } catch (error) {
    console.error('Error in activateWorkflow controller:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getUserWorkflows = async (req, res) => {
  try {
    const userId = req.user.id;
    const workflows = await builderService.getUserWorkflows(userId);
    res.status(200).json(workflows);
  } catch (error) {
    console.error('Error in getUserWorkflows controller:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

const getWorkflowCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    if (!id || isNaN(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid workflow ID is required' 
      });
    }

    const credits = await builderService.getWorkflowCredits(id, userId);
    res.status(200).json({ credits });
  } catch (error) {
    console.error('Error in getWorkflowCredits controller:', error);
    res.status(404).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = { 
  getNodes,
  createWorkflow,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
  activateWorkflow,
  getUserWorkflows,
  getWorkflowCredits
};