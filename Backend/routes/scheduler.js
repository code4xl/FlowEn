// routes/scheduler.js - Optional scheduler management routes
const express = require('express');
const authMiddleware = require('../Middlewares/auth');
const { 
  getSchedulerStatus,
  manualTrigger,
  getExecutionLogs,
  getWorkflowStats,
  restartScheduler
} = require('../controllers/scheduler');

const router = express.Router();

// Public status endpoint (no auth required)
router.get('/status', getSchedulerStatus);

// Protected routes require authentication
router.use(authMiddleware);

router.post('/trigger/:workflow_id', manualTrigger);

router.get('/logs/:workflow_id', getExecutionLogs);

router.get('/stats/:workflow_id', getWorkflowStats);

// Admin routes
router.post('/restart', restartScheduler);

module.exports = router;