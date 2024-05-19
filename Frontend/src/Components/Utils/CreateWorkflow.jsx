import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
MiniMap,
Controls,
Background,
useNodesState,
useEdgesState,
addEdge,
} from 'reactflow';
import {toast} from "react-hot-toast";

import 'reactflow/dist/style.css';
import { createWorkflow, fetchNextWfId, fetchNodes } from '../../Services/Repository/WorkFlowRepo';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const CreateWorkflow = () => {
    //get the data_id of the last created Workflow and create the next workflow Id. And show on the screen.
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const SeparateNodeData = [
        {
            buttonText: "Start",
            data: {
                id: "4",
                position: { x: 200, y: 150 },
                data: {label: "Start"}
            }
        },
        {
            buttonText: "Filter Data",
            data: {
                id: "5",
                position: { x: 200, y: 150 },
                data: {label: "Filter Data"}
            }
        },
        {
            buttonText: "Wait",
            data: {
                id: "7",
                position: { x: 200, y: 150 },
                data: {label: "Wait"}
            }
        },
        {
            buttonText: "Convert Format",
            data: {
                id: "8",
                position: { x: 200, y: 150 },
                data: {label: "Convert Format"}
            }
        },
        {
            buttonText: "Send POST Request",
            data: {
                id: "9",
                position: { x: 200, y: 150 },
                data: {label: "Send POST Request"}
            }
        },
        {
            buttonText: "END",
            data: {
                id: "10",
                position: { x: 200, y: 150 },
                data: {label: "END"}
            }
        },
    ];
    const [nodedata, setNodeData] = useState([]);
    const [nextWF_id, setNextWFId] = useState("");
    useEffect(()=>{
        const fetchNodeFunc = async () =>{
            try{
                const nodeTempdata = await fetchNodes();
                const nextNodeId = await fetchNextWfId();

                setNodeData(nodeTempdata);
                setNextWFId(nextNodeId);
            }
            catch(err){
                console.error("Error while fetching the nodes data at frontend side : ", err);
            }
        }

        fetchNodeFunc();
    },[]);
    useEffect(()=>{
        console.log(nodedata);
    },[nodedata])
    const [initialNodes, setInitialNode] = useState([]);
    
    const initialEdges = [];
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    
    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
    const addNode = (data) => {
        console.log("add node clicked..!", data);
        // console.log(initialNodes);
        const newnode = data;
        setInitialNode([...nodes, newnode]);
        // console.log(initialNodes);
    }

    useEffect(() => {
        // Force re-render of ReactFlow component after initialNodes state update
        setNodes(initialNodes);
    }, [initialNodes, setNodes]);
    useEffect(()=>{
        console.log(edges);
    }, [edges]);
    const [allClearToCreate, setAllClearToCreate] = useState(true);
    const [selectedNodes, setSelectedNodes] = useState();
    const createWorkFlowClick = () =>{
        console.log("Create workflow button clicked..!");
        let series = "";
        if(edges.length > 0){
            for(let i = 0; i < edges.length; i++){
                if(i === 0){
                    series += (edges[i].source + "-");
                    series += (edges[i].target + "-");
                }else{
                    series += (edges[i].target + "-");
                }
            }
            if(series.endsWith("-")){
                series = series.slice(0, -1);
            }
            console.log("Series of Workflow is : ", series);
            const nodeIds = series.split("-");
            setSelectedNodes(nodeIds);
            if(nodeIds.length >= 2){
                //check if the last node is end node if not give error.
                const idToCheck = nodeIds[nodeIds.length-1];
                var isEndPresent = false;
                nodedata.forEach(item => {
                    if(item.data.id === idToCheck){
                        if(item.buttonText.toLowerCase() === "end"){
                            isEndPresent = true;
                        }
                    }
                })
                if(isEndPresent){
                    console.log("End node exists.");
                    setAllClearToCreate(true);
                }else{
                    console.log("End node is absent.");
                    setAllClearToCreate(false);
                }
            }else{
                //give error there should be atleast 2 nodes in workflow.
                toast.error("Atleast 2 nodes required in Workflow");
                setAllClearToCreate(false);
            }
            if(allClearToCreate){
                // toast.success("hurray..! all set to create the create workflow backend.");
                //send the selectedNodes array and next workflow Id.
                console.log(selectedNodes);
                dispatch(createWorkflow(nextWF_id, selectedNodes, navigate));
            }else{
                toast.error("ohhNooo..! failed to create the workflow.");
            }
        }
    }
    return (
        <div className=" w-screen flex flex-row items-center justify-center gap-3">
            <div className="h-[70vh] w-[20vw] flex flex-col items-center justify-between  rounded-[1rem] shadow-lg border-[.2rem] p-5 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col items-center justify-center gap-5">
                    {
                        Array.isArray(nodedata) && nodedata.map((item, id) => (
                            <button onClick={()=>{addNode(item.data)}} key={id} className="w-full">
                                {item.buttonText}
                            </button>
                        ))
                    }
                </div>
                <div className="w-full flex items-center justify-center">
                    <button className="w-full" onClick={createWorkFlowClick}>CREATE WORKFLOW</button>
                </div>
            </div>
            <div className="h-[70vh] w-[70vw] rounded-[1rem] shadow-lg border-[.2rem] p-2">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                >
                    <div className="absolute top-0 left-5 bg-white shadow-lg rounded-[1rem]  border-[.2rem]">
                        <p className="px-2 py-1">{nextWF_id}</p>
                    </div>
                    <MiniMap />
                    <Controls />
                    <Background />
                </ReactFlow>
            </div>
            {/* styles={customStyles} */}
            
        </div>
    );
};

export default CreateWorkflow;

// import React, { useCallback } from 'react';
// import ReactFlow, {
//   addEdge,
//   MiniMap,
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
// } from 'reactflow';

// import {
//   nodes as initialNodes,
//   edges as initialEdges,
// } from '../Try/initial-elements.jsx';
// import AnnotationNode from '../Try/AnnotationNode';
// import ToolbarNode from '../Try/ToolbarNode';
// import ResizerNode from '../Try/ResizerNode';
// import CircleNode from '../Try/CircleNode';
// import TextNode from '../Try/TextNode';
// import ButtonEdge from '../Try/ButtonEdge';

// import 'reactflow/dist/style.css';
// import '../Try/overview.css';

// const nodeTypes = {
//   annotation: AnnotationNode,
//   tools: ToolbarNode,
//   resizer: ResizerNode,
//   circle: CircleNode,
//   textinput: TextNode,
// };

// const edgeTypes = {
//   button: ButtonEdge,
// };

// const nodeClassName = (node) => node.type;

// const CreateWorkflow = () => {
//   const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
//   const onConnect = useCallback(
//     (params) => setEdges((eds) => addEdge(params, eds)),
//     [],
//   );

//   return (
//     <div className="w-screen h-screen flex items-center justify-center">
//         <div className="w-[70vw] h-[70vh]">
//             <ReactFlow
//             nodes={nodes}
//             edges={edges}
//             onNodesChange={onNodesChange}
//             onEdgesChange={onEdgesChange}
//             onConnect={onConnect}
//             fitView
//             attributionPosition="top-right"
//             nodeTypes={nodeTypes}
//             edgeTypes={edgeTypes}
//             className="overview"
//             >
//             <MiniMap zoomable pannable nodeClassName={nodeClassName} />
//             <Controls />
//             <Background />
//             </ReactFlow>
//         </div>
//     </div>
//   );
// };

// export default CreateWorkflow;

