import {toast} from "react-hot-toast";
import { apiConnector } from "../Connector";
import { workFlowEndpoints } from "../Apis";

const { CREATE_WF, FETCH_NODES, FETCH_LAST_WF_ID, FETCH_WF_LIST, FETCH_WF_DETAILS } = workFlowEndpoints;

export function createWorkflow(wfId, selectedNodes, navigate){
    return async (dispatch) => {
        const loder = toast.loading("Creating workflow..!");
        try{
            const response = await apiConnector("POST", CREATE_WF, {wfId, selectedNodes})
            console.log("Create API response : ", response);
            if(response.data.success){
                toast.success("Workflow created.");
                // console.log("Response data : ", response.data);
                navigate("/dashboard");
            }else{
                toast.error("Error creating workflow.");
            }
        }
        catch(err){
            console.log("CREATE API Error....", err);
            toast.dismiss(loder);
            toast.error(err.response?.data?.message);
        }
        toast.dismiss(loder);
    }
}
export async function fetchNodes(){
    const loder = toast.loading("Fetching Nodes..!");
        try{
            const response = await apiConnector("GET", FETCH_NODES)
            console.log("Fetch API response : ", response);
            if(response.data.success){                
                console.log("Response data : ", response.data?.nodesdata);
                let finalNodeData = [];
                response.data?.nodesdata.forEach(element => {
                    const tempdata = {
                        buttonText: element?.title,
                        data: {
                            id: element?.nodes_id,
                            position: { x: element?.position_x, y: element?.position_y },
                            data: {label: element?.title}
                        }
                    }
                    finalNodeData.push(tempdata);
                });
                toast.dismiss(loder);
                return finalNodeData;
            }
            else{
                toast.dismiss(loder);
                throw new Error(response.data?.message);
            }
        }
        catch(err){
            console.log("FETCH NODES API Error....", err);
            toast.dismiss(loder);
            toast.error(err.response?.data?.message);
        }
}
export async function fetchNextWfId(){
    // const loder = toast.loading("Fetching Nodes..!");
        try{
            const response = await apiConnector("GET", FETCH_LAST_WF_ID)
            console.log("Fetch API response : ", response);
            if(response.data.success){                
                console.log("Response data : ", response.data?.workflowId);
                // toast.dismiss(loder);
                var lastWfId = response.data?.workflowId;
                let tempArr = lastWfId.split("_");
                let numericPart = parseInt(tempArr[1]);
                numericPart++;

                let nextWfId = tempArr[0] + "_" + numericPart.toString().padStart(3, '0');
                console.log(nextWfId);
                return nextWfId;
            }
            else{
                // toast.dismiss(loder);
                toast.error(response.data?.message);
                throw new Error(response.data?.message);
            }
        }
        catch(err){
            console.log("FETCH LAST WF ID API Error....", err);
            // toast.dismiss(loder);
            toast.error(err.response?.data?.message);
        }
}
export async function fetchWfData(){
    // const loder = toast.loading("Fetching Nodes..!");
        try{
            const response = await apiConnector("GET", FETCH_WF_LIST)
            console.log("Fetch API response : ", response);
            if(response.data.success){
                let dataWfList = response?.data?.wfList;
                // console.log(dataWfList);
                let finaldata;
                if(Array.isArray(dataWfList)){
                    finaldata = dataWfList.map(option => ({
                        label: option.wf_id,
                        value: option.workflow_id
                      }));
                }
                // console.log("Final data after converting : ", finaldata);
                // toast.dismiss(loder);
                return finaldata;
            }
            else{
                // toast.dismiss(loder);
                toast.error(response.data?.message);
                throw new Error(response.data?.message);
            }
        }
        catch(err){
            console.log("FETCH LAST WF ID API Error....", err);
            // toast.dismiss(loder);
            toast.error(err.response?.data?.message);
        }
}
export async function fetchWfDetails(workflowId){
    const loder = toast.loading("Fetching Workflow Data..!");
        try{
            const endPoint = FETCH_WF_DETAILS + workflowId;
            const response = await apiConnector("GET", endPoint)
            console.log("Fetch API response : ", response);
            if(response.data.success){
                let dataWfDetails = response?.data?.wfDetails;
                // console.log(dataWfList);
                // let finaldata;
                // if(Array.isArray(dataWfList)){
                //     finaldata = dataWfList.map(option => ({
                //         label: option.wf_id,
                //         value: option.workflow_id
                //       }));
                // }
                // console.log("Final data after converting : ", finaldata);
                toast.dismiss(loder);
                return dataWfDetails;
            }
            else{
                toast.dismiss(loder);
                toast.error(response.data?.message);
                throw new Error(response.data?.message);
            }
        }
        catch(err){
            console.log("FETCH WF DETAILS API Error....", err);
            toast.dismiss(loder);
            toast.error(err.response?.data?.message);
        }
}

//from frontend will send the workflow id and using following query will get the data for the created workflow.
//SELECT t1.workflow_id, t3.wf_id, t1.node_id, t2.title, t1.sequence FROM workflow_nodes t1 LEFT JOIN workflow t3 ON t1.workflow_id = t3.workflow_id LEFT JOIN nodes t2 ON t1.node_id = t2.nodes_id WHERE t1.workflow_id = 2;