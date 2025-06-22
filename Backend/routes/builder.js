const express = require('express');
const authMiddleware = require('../Middlewares/auth');
const { 
  getNodes,
  createWorkflow,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
  getUserWorkflows,
  getWorkflowCredits
} = require('../controllers/builder');
const { activateWorkflow } = require('../controllers/builder');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Builder API routes
router.get('/nodes', getNodes);
router.post('/workflow/create', createWorkflow);
router.get('/workflow/:id', getWorkflowById);
router.put('/workflow/update/:id', updateWorkflow);
router.delete('/workflow/delete/:id', deleteWorkflow);
router.put('/workflow/activate/:id', activateWorkflow);
router.get('/workflows', getUserWorkflows);
router.get('/workflow/credits/:id', getWorkflowCredits);

module.exports = router;