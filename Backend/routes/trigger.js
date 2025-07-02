const express = require('express');
const authMiddleware = require('../Middlewares/auth');
const { 
  getAllTriggers,
  getTriggerById,
  getTriggerByWorkflow,
  createTrigger,
  updateTrigger,
  getAvailableWorkflows
} = require('../controllers/trigger');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Triggers API routes
router.get('/', getAllTriggers);
router.get('/available-workflows', getAvailableWorkflows);
router.get('/:trigger_id', getTriggerById);
router.get('/workflow/:workflow_id', getTriggerByWorkflow);
router.post('/', createTrigger);
router.put('/:trigger_id', updateTrigger);

module.exports = router;