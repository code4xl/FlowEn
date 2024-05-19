const asyncHandler = require("express-async-handler");
const db = require("../Config/db.js");
const createWorkFlow = asyncHandler(async (req, res) => {
    try{
        console.log("Entered into createworkflow.");
        const {loginId} = req.user;
        console.log(loginId);
        const {wfId, selectedNodes} = req.body;
        console.log(wfId);
        console.log(selectedNodes);
        const createQry = "INSERT INTO workflow (wf_id, created_by, no_of_nodes) VALUES (?, ?, ?);";
        const [result] = await db.query(createQry, [wfId, loginId, selectedNodes?.length])
        const [count] = await db.query('SELECT LAST_INSERT_ID() as id ;');
        console.log(count);
        if(count.length > 0){
            const workflowId = count[0].id;
            if(Array.isArray(selectedNodes)){
                let insertQry = "INSERT INTO workflow_nodes (workflow_id, node_id, sequence) VALUES ";
                let values = "";
                selectedNodes.forEach((element, id) => {
                    values += "("+ workflowId + ", " + element + ", " + id + "),";
                });
                if(values.endsWith(",")){
                    values = values.slice(0, -1);
                }
                insertQry += values;
                console.log(insertQry);
                try{
                    const [InsertRes] = await db.query(insertQry);
                    console.log(InsertRes);
                }
                catch(err){
                    throw new Error("Error while inserting nodes of workflow due to : ", err);
                }
            }
            return res.status(200).send({ success:true, message: "WorkFlow " + wfId + " Created Successfully."});
        }else{
            return res.status(500).send({success: false, message: "Error Creating Workflow " + wfId});
        }
    }catch(err){
        throw new Error(err.message);
    }
});

const getNodes = asyncHandler(async (req, res) => {
    try{
        const selectQry = "SELECT CONVERT(nodes_id, char) AS nodes_id, title, position_x, position_y, description, is_active, created_by FROM nodes WHERE is_active = 0;";
        const [result] = await db.query(selectQry);
        if(result.length > 0){
            return res.status(200).send({ success:true, message: "Nodes Fetched.", nodesdata: result});
        }else{
            return res.status(500).send({success: false, message: "Error Fetching nodes."});
        }
    }catch(err){
        throw new Error(err.message);
    }
});
const getLastWorkFlowId = asyncHandler(async (req, res) => {
    try{
        const selectQry = "SELECT wf_id FROM workflow ORDER BY created_on desc LIMIT 1;";
        const [result] = await db.query(selectQry);
        workflowId = result?.[0].wf_id;
        // console.log(workflowId);
        if(result.length > 0){
            return res.status(200).send({ success:true, message: "Workflow Id Fetched.", workflowId});
        }else{
            return res.status(500).send({success: false, message: "Error Fetching last WF Id."});
        }
    }catch(err){
        throw new Error(err.message);
    }
});
const getWfList = asyncHandler(async (req, res) => {
    try{
        const selectQry = "SELECT workflow_id, wf_id FROM workflow ORDER BY created_on desc;";
        const [wfList] = await db.query(selectQry);
        // console.log(workflowId);
        if(wfList.length > 0){
            return res.status(200).send({ success:true, message: "Workflow data Fetched.", wfList});
        }else{
            return res.status(500).send({success: false, message: "Error Fetching workflow data ."});
        }
    }catch(err){
        throw new Error(err.message);
    }
});
const getWfDetails = asyncHandler(async (req, res) => {
    try{
        const workflowId = req.params.workflowId;
        const selectQry = "SELECT t1.workflow_id, t3.wf_id, t1.node_id, t2.title, t1.sequence FROM workflow_nodes t1 LEFT JOIN workflow t3 ON t1.workflow_id = t3.workflow_id LEFT JOIN nodes t2 ON t1.node_id = t2.nodes_id WHERE t1.workflow_id = ?;";
        const [wfDetails] = await db.query(selectQry, [workflowId]);
        // console.log(workflowId);
        if(wfDetails.length > 0){
            return res.status(200).send({ success:true, message: "Workflow details Fetched.", wfDetails});
        }else{
            return res.status(500).send({success: false, message: "Error Fetching workflow details ."});
        }
    }catch(err){
        throw new Error(err.message);
    }
});


module.exports = { createWorkFlow, getNodes, getLastWorkFlowId, getWfList, getWfDetails };