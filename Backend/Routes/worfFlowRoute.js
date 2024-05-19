const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../Middlewares/authmiddleware.js");
const workflow = require("../Controllers/workFlowControllers.js");

router.post("/create", authMiddleware, workflow.createWorkFlow);
router.get("/fetch-nodes", authMiddleware, workflow.getNodes);
router.get("/lastWorkflowId", authMiddleware, workflow.getLastWorkFlowId);
router.get("/wfList", authMiddleware, workflow.getWfList);
router.get("/wfDetails/:workflowId", authMiddleware, workflow.getWfDetails);

module.exports = router;