// import React, { useMemo, useEffect, useState } from "react";
// import {
//   ReactFlow,
//   Background,
//   BackgroundVariant,
//   Controls,
//   MiniMap,
//   useNodesState,
//   useEdgesState,
//   MarkerType,
// } from "@xyflow/react";
// import {
//   X,
//   Loader2,
//   Maximize2,
//   Minimize2,
//   Download,
//   ExternalLink,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import html2canvas from "html2canvas";

// // Import node components (same as in Builder)
// import InputNode from "../../Builder/builder_utils/nodes/InputNode";
// import OutputNode from "../../Builder/builder_utils/nodes/OutputNode";
// import LLMNode from "../../Builder/builder_utils/nodes/LLMNode";
// import ToolNode from "../../Builder/builder_utils/nodes/ToolNode";
// import AgentNode from "../../Builder/builder_utils/nodes/AgentNode";
// import PatternMetaNode from "../../Builder/builder_utils/nodes/PatternMetaNode";
// import { useDispatch, useSelector } from "react-redux";
// import { selectTheme } from "../../../../App/DashboardSlice";
// import { executeWF } from "../../../../Services/Repository/ExecuteRepo";

// const PreviewModal = ({
//   isOpen,
//   onClose,
//   workflowData,
//   loading,
//   workflowId,
// }) => {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const theme = useSelector(selectTheme);

//   // Define node types (read-only versions)
//   const nodeTypes = useMemo(
//     () => ({
//       customInput: (props) => <InputNode {...props} />,
//       customOutput: (props) => <OutputNode {...props} />,
//       llm: (props) => <LLMNode {...props} />,
//       toolNode: (props) => <ToolNode {...props} />,
//       agentNode: (props) => <AgentNode {...props} />,
//       patternMeta: (props) => <PatternMetaNode {...props} />,
//     }),
//     []
//   );

//   // Load workflow data when it changes
//   useEffect(() => {
//     if (workflowData?.data) {
//       // Restore nodes and edges from workflow data
//       const restoredNodes =
//         workflowData.data.nodes?.map((node) => ({
//           ...node,
//           data: {
//             ...node.data,
//             readOnly: true, // Make all nodes read-only
//             // Ensure onNodeDataChange is NOT passed in preview mode
//             onNodeDataChange: undefined,
//           },
//         })) || [];

//       const restoredEdges =
//         workflowData.data.edges?.map((edge) => ({
//           ...edge,
//           style: {
//             stroke: "var(--accent-color)",
//             strokeWidth: 2,
//           },
//           markerEnd: {
//             type: MarkerType.ArrowClosed,
//             color: "var(--accent-color)",
//             width: 15,
//             height: 15,
//           },
//         })) || [];

//       setNodes(restoredNodes);
//       setEdges(restoredEdges);
//     }
//   }, [workflowData, setNodes, setEdges]);

//   // Handle edit workflow
//   const handleEditWorkflow = () => {
//     onClose();
//     navigate(`/create?edit=${workflowId}`);
//   };

//   // Handle execute workflow
//   const handleExecuteWorkflow = () => {
//     // onClose();
//     const response = executeWF(workflowData.data, navigate);
//   };

//   const handleExportWorkflow = async () => {
//     if (!workflowData) return;

//     try {
//       // Show loading state
//       const exportButton = document.querySelector("[data-export-btn]");
//       const originalContent = exportButton?.innerHTML;

//       if (exportButton) {
//         exportButton.innerHTML = `
//         <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
//           <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
//           <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
//         </svg>
//       `;
//         exportButton.disabled = true;
//       }

//       // Find the modal container
//       const modalContainer = document.querySelector("[data-modal-container]"); // We'll add this data attribute

//       if (!modalContainer) {
//         throw new Error("Could not find modal to export");
//       }

//       // Hide the backdrop temporarily for cleaner screenshot
//       const backdrop = document.querySelector(
//         ".fixed.inset-0.bg-black.bg-opacity-50"
//       );
//       const originalBackdropDisplay = backdrop?.style.display;
//       if (backdrop) {
//         backdrop.style.display = "none";
//       }

//       // Take screenshot of the entire modal
//       const canvas = await html2canvas(modalContainer, {
//         backgroundColor:
//           getComputedStyle(document.documentElement)
//             .getPropertyValue("--bg-primary")
//             .trim() || "#ffffff",
//         scale: 2, // High quality
//         useCORS: true,
//         allowTaint: true,
//         foreignObjectRendering: true,
//         width: modalContainer.offsetWidth,
//         height: modalContainer.offsetHeight,
//         onclone: function (clonedDoc) {
//           // Fix SVG elements in the cloned document
//           const svgElements = clonedDoc.querySelectorAll("svg");
//           svgElements.forEach((svg) => {
//             svg.style.display = "block";
//             svg.style.visibility = "visible";
//           });

//           // Fix edge paths specifically
//           const edgePaths = clonedDoc.querySelectorAll(
//             ".react-flow__edge path"
//           );
//           edgePaths.forEach((path) => {
//             if (!path.style.stroke || path.style.stroke === "none") {
//               path.style.stroke =
//                 getComputedStyle(document.documentElement)
//                   .getPropertyValue("--accent-color")
//                   .trim() || "#0fdbff";
//             }
//             if (!path.style.strokeWidth) {
//               path.style.strokeWidth = "2px";
//             }
//             path.style.fill = "none";
//           });

//           // Fix markers (arrow heads)
//           const markers = clonedDoc.querySelectorAll("marker");
//           markers.forEach((marker) => {
//             marker.style.fill =
//               getComputedStyle(document.documentElement)
//                 .getPropertyValue("--accent-color")
//                 .trim() || "#0fdbff";
//           });

//           // Hide export button in screenshot
//           const exportBtn = clonedDoc.querySelector("[data-export-btn]");
//           if (exportBtn) {
//             exportBtn.style.display = "none";
//           }
//         },
//       });

//       // Restore backdrop
//       if (backdrop && originalBackdropDisplay !== undefined) {
//         backdrop.style.display = originalBackdropDisplay;
//       }

//       // Download the image
//       const link = document.createElement("a");
//       link.download = `${
//         workflowData.name.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
//         "workflow"
//       }_preview.png`;
//       link.href = canvas.toDataURL("image/png", 0.95);

//       // Trigger download
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Reset button state
//       if (exportButton && originalContent) {
//         exportButton.innerHTML = originalContent;
//         exportButton.disabled = false;
//       }
//     } catch (error) {
//       console.error("Export failed:", error);
//       alert(`Failed to export workflow: ${error.message}`);

//       // Reset button state on error
//       const exportButton = document.querySelector("[data-export-btn]");
//       if (exportButton) {
//         exportButton.innerHTML =
//           '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';
//         exportButton.disabled = false;
//       }
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-black/10 bg-opacity-50 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div
//         data-modal-container
//         className={`
//         relative bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl
//         transition-all duration-300 flex flex-col
//         ${
//           isFullscreen
//             ? "w-screen h-screen rounded-none"
//             : "w-[90vw] h-[80vh] max-w-6xl"
//         }
//       `}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-t-xl">
//           <div className="flex items-center gap-4">
//             <div>
//               <h2 className="text-xl font-semibold text-[var(--text-primary)]">
//                 {loading
//                   ? "Loading..."
//                   : workflowData?.name || "Workflow Preview"}
//               </h2>
//               {workflowData && (
//                 <p className="text-sm text-[var(--text-secondary)]">
//                   {workflowData.description} • {workflowData.credits} credits
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center gap-2">
//             {!loading && workflowData && isFullscreen && (
//               <>
//                 {/* Export Button */}
//                 <button
//                   onClick={handleExportWorkflow}
//                   data-export-btn
//                   className="p-2 rounded-lg bg-[var(--highlight-color)] border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-colors"
//                   title="Export workflow as PNG image"
//                 >
//                   <Download size={18} className="text-[var(--text-primary)]" />
//                 </button>

//                 {/* Edit Button */}
//                 <button
//                   onClick={handleEditWorkflow}
//                   className="px-3 py-2 rounded-lg bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] transition-colors flex items-center gap-2"
//                 >
//                   <ExternalLink size={16} />
//                   Edit
//                 </button>

//                 {/* Execute Button */}
//                 <button
//                   onClick={handleExecuteWorkflow}
//                   className="px-3 py-2 rounded-lg bg-[var(--accent-color)] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
//                 >
//                   <ExternalLink size={16} />
//                   Execute
//                 </button>
//               </>
//             )}

//             {/* Fullscreen Toggle */}
//             <button
//               onClick={() => setIsFullscreen(!isFullscreen)}
//               className="p-2 rounded-lg bg-[var(--highlight-color)] border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-colors text-[var(--text-primary)]"
//               title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
//             >
//               {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
//             </button>

//             {/* Close Button */}
//             <button
//               onClick={onClose}
//               className="p-2 text-[var(--text-primary)] rounded-lg bg-[var(--highlight-color)] border border-[var(--border-color)] hover:bg-red-500 hover:text-white transition-colors"
//               title="Close preview"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 relative overflow-hidden">
//           {loading ? (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <Loader2
//                   className="animate-spin text-[var(--accent-color)] mb-4"
//                   size={40}
//                 />
//                 <p className="text-[var(--text-secondary)]">
//                   Loading workflow...
//                 </p>
//               </div>
//             </div>
//           ) : workflowData ? (
//             <ReactFlow
//               nodes={nodes}
//               edges={edges}
//               nodeTypes={nodeTypes}
//               onNodesChange={onNodesChange}
//               onEdgesChange={onEdgesChange}
//               fitView
//               defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
//               panOnScroll={true}
//               panOnDrag={true}
//               zoomOnScroll={true}
//               zoomOnPinch={true}
//               zoomOnDoubleClick={false}
//               nodesDraggable={false} // Disable node dragging in preview
//               nodesConnectable={false} // Disable connecting in preview
//               elementsSelectable={true} // Allow selection for viewing
//               className="bg-[var(--bg-primary)]"
//               defaultEdgeOptions={{
//                 style: { stroke: "var(--accent-color)", strokeWidth: 2 },
//                 markerEnd: {
//                   type: MarkerType.ArrowClosed,
//                   color: "var(--accent-color)",
//                 },
//               }}
//             >
//               <Background
//                 variant={BackgroundVariant.Dots}
//                 gap={20}
//                 size={1}
//                 color={theme === "light" ? "#2a2a2a" : "#cfcfcf"}
//               />
//               <Controls showInteractive={false} />
//               <MiniMap
//                 nodeColor="var(--accent-color)"
//                 maskColor="rgba(0,0,0,0.1)"
//                 style={{
//                   backgroundColor: "var(--bg-secondary)",
//                   border: "1px solid var(--border-color)",
//                 }}
//               />
//             </ReactFlow>
//           ) : (
//             <div className="flex items-center justify-center h-full">
//               <div className="text-center">
//                 <p className="text-[var(--text-secondary)] text-lg">
//                   Failed to load workflow data
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer Info */}
//         {!loading && workflowData && (
//           <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-b-xl">
//             <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
//               <div className="flex items-center gap-4">
//                 <span>Nodes: {nodes.length}</span>
//                 <span>Connections: {edges.length}</span>
//                 <span>
//                   Created:{" "}
//                   {new Date(workflowData.created_at).toLocaleDateString()}
//                 </span>
//               </div>
//               <div className="text-xs">
//                 Read-only preview • Click Edit to modify
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PreviewModal;





import React, { useMemo, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import {
  X,
  Loader2,
  Maximize2,
  Minimize2,
  Download,
  ExternalLink,
  Play,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { toast } from "react-hot-toast";

// Import node components (same as in Builder)
import InputNode from "../../Builder/builder_utils/nodes/InputNode";
import OutputNode from "../../Builder/builder_utils/nodes/OutputNode";
import LLMNode from "../../Builder/builder_utils/nodes/LLMNode";
import ToolNode from "../../Builder/builder_utils/nodes/ToolNode";
import AgentNode from "../../Builder/builder_utils/nodes/AgentNode";
import PatternMetaNode from "../../Builder/builder_utils/nodes/PatternMetaNode";
import { useDispatch, useSelector } from "react-redux";
import { selectTheme } from "../../../../App/DashboardSlice";
import { executeWF } from "../../../../Services/Repository/ExecuteRepo";

const PreviewModal = ({
  isOpen,
  onClose,
  workflowData,
  loading,
  workflowId,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [hasExecuted, setHasExecuted] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useSelector(selectTheme);

  // Define node types (read-only versions)
  const nodeTypes = useMemo(
    () => ({
      customInput: (props) => <InputNode {...props} />,
      customOutput: (props) => <OutputNode {...props} />,
      llm: (props) => <LLMNode {...props} />,
      toolNode: (props) => <ToolNode {...props} />,
      agentNode: (props) => <AgentNode {...props} />,
      patternMeta: (props) => <PatternMetaNode {...props} />,
    }),
    []
  );

  // Load workflow data when it changes
  useEffect(() => {
    if (workflowData?.data) {
      // Reset execution state when workflow data changes
      setExecutionResults(null);
      setHasExecuted(false);
      
      // Restore nodes and edges from workflow data
      const restoredNodes =
        workflowData.data.nodes?.map((node) => ({
          ...node,
          data: {
            ...node.data,
            readOnly: true, // Make all nodes read-only
            // Ensure onNodeDataChange is NOT passed in preview mode
            onNodeDataChange: undefined,
          },
        })) || [];

      const restoredEdges =
        workflowData.data.edges?.map((edge) => ({
          ...edge,
          style: {
            stroke: "var(--accent-color)",
            strokeWidth: 2,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "var(--accent-color)",
            width: 15,
            height: 15,
          },
        })) || [];

      setNodes(restoredNodes);
      setEdges(restoredEdges);
    }
  }, [workflowData, setNodes, setEdges]);

  // Update nodes with execution results
  useEffect(() => {
    if (executionResults) {
      console.log("Updating nodes with originalResult:", executionResults.result);
      
      setNodes((currentNodes) => {
        const updatedNodes = currentNodes.map((node) => {
          // Find the result for this specific node using its ID
          const nodeResultKey = Object.keys(executionResults.result).find(key => 
            key.includes(node.id)
          );
          
          if (nodeResultKey) {
            const resultValue = executionResults.result[nodeResultKey];
            console.log(`Updating node ${node.id} with result:`, resultValue);
            
            return {
              ...node,
              data: {
                ...node.data,
                agentOutput: resultValue,
                executionResult: resultValue,
                hasExecuted: true,
              },
            };
          }

          return node;
        });
        
        console.log("Updated nodes:", updatedNodes);
        return updatedNodes;
      });
    }
  }, [executionResults, setNodes]);

  // Handle reset workflow (clear execution results)
  const handleResetWorkflow = () => {
    setExecutionResults(null);
    setHasExecuted(false);
    
    // Reset nodes to original state
    if (workflowData?.data) {
      const restoredNodes =
        workflowData.data.nodes?.map((node) => ({
          ...node,
          data: {
            ...node.data,
            readOnly: true,
            onNodeDataChange: undefined,
            // Clear execution data
            executionResult: undefined,
            hasExecuted: false,
            outputValue: undefined,
            response: undefined,
          },
        })) || [];

      setNodes(restoredNodes);
    }
  };

  // Handle edit workflow
  const handleEditWorkflow = () => {
    onClose();
    navigate(`/create?edit=${workflowId}`);
  };

  // Handle execute workflow
  const handleExecuteWorkflow = async () => {
    if (!workflowData) {
      toast.error("No workflow data available");
      return;
    }

    setIsExecuting(true);
    
    try {

      // Execute the workflow
      const response = await executeWF(workflowData.data, navigate);
      
      if (response.success) {
        setExecutionResults(response);
        setHasExecuted(true);
        toast.success("Workflow executed successfully!");
      } else {
        toast.error(response.error || "Failed to execute workflow");
      }
    } catch (error) {
      console.error("Execution error:", error);
      toast.error("Failed to execute workflow");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExportWorkflow = async () => {
    if (!workflowData) return;

    try {
      // Show loading state
      const exportButton = document.querySelector("[data-export-btn]");
      const originalContent = exportButton?.innerHTML;

      if (exportButton) {
        exportButton.innerHTML = `
        <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
      `;
        exportButton.disabled = true;
      }

      // Find the modal container
      const modalContainer = document.querySelector("[data-modal-container]");

      if (!modalContainer) {
        throw new Error("Could not find modal to export");
      }

      // Hide the backdrop temporarily for cleaner screenshot
      const backdrop = document.querySelector(
        ".fixed.inset-0.bg-black.bg-opacity-50"
      );
      const originalBackdropDisplay = backdrop?.style.display;
      if (backdrop) {
        backdrop.style.display = "none";
      }

      // Take screenshot of the entire modal
      const canvas = await html2canvas(modalContainer, {
        backgroundColor:
          getComputedStyle(document.documentElement)
            .getPropertyValue("--bg-primary")
            .trim() || "#ffffff",
        scale: 2, // High quality
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        width: modalContainer.offsetWidth,
        height: modalContainer.offsetHeight,
        onclone: function (clonedDoc) {
          // Fix SVG elements in the cloned document
          const svgElements = clonedDoc.querySelectorAll("svg");
          svgElements.forEach((svg) => {
            svg.style.display = "block";
            svg.style.visibility = "visible";
          });

          // Fix edge paths specifically
          const edgePaths = clonedDoc.querySelectorAll(
            ".react-flow__edge path"
          );
          edgePaths.forEach((path) => {
            if (!path.style.stroke || path.style.stroke === "none") {
              path.style.stroke =
                getComputedStyle(document.documentElement)
                  .getPropertyValue("--accent-color")
                  .trim() || "#0fdbff";
            }
            if (!path.style.strokeWidth) {
              path.style.strokeWidth = "2px";
            }
            path.style.fill = "none";
          });

          // Fix markers (arrow heads)
          const markers = clonedDoc.querySelectorAll("marker");
          markers.forEach((marker) => {
            marker.style.fill =
              getComputedStyle(document.documentElement)
                .getPropertyValue("--accent-color")
                .trim() || "#0fdbff";
          });

          // Hide export button in screenshot
          const exportBtn = clonedDoc.querySelector("[data-export-btn]");
          if (exportBtn) {
            exportBtn.style.display = "none";
          }
        },
      });

      // Restore backdrop
      if (backdrop && originalBackdropDisplay !== undefined) {
        backdrop.style.display = originalBackdropDisplay;
      }

      // Download the image
      const link = document.createElement("a");
      link.download = `${
        workflowData.name.replace(/[^a-z0-9]/gi, "_").toLowerCase() ||
        "workflow"
      }_preview.png`;
      link.href = canvas.toDataURL("image/png", 0.95);

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Reset button state
      if (exportButton && originalContent) {
        exportButton.innerHTML = originalContent;
        exportButton.disabled = false;
      }
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(`Failed to export workflow: ${error.message}`);

      // Reset button state on error
      const exportButton = document.querySelector("[data-export-btn]");
      if (exportButton) {
        exportButton.innerHTML =
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';
        exportButton.disabled = false;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/10 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        data-modal-container
        className={`
        relative bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl
        transition-all duration-300 flex flex-col
        ${
          isFullscreen
            ? "w-screen h-screen rounded-none"
            : "w-[90vw] h-[80vh] max-w-6xl"
        }
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-t-xl">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {loading
                  ? "Loading..."
                  : workflowData?.name || "Workflow Preview"}
              </h2>
              {workflowData && (
                <p className="text-sm text-[var(--text-secondary)]">
                  {workflowData.description} • {workflowData.credits} credits
                  {hasExecuted && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Executed
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!loading && workflowData && (
              <>
                {/* Execute Button */}
                <button
                  onClick={handleExecuteWorkflow}
                  disabled={isExecuting}
                  className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isExecuting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Play size={16} />
                  )}
                  {isExecuting ? "Executing..." : "Execute"}
                </button>

                {/* Reset Button - show only if executed */}
                {hasExecuted && (
                  <button
                    onClick={handleResetWorkflow}
                    className="px-3 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                )}

                {isFullscreen && (
                  <>
                    {/* Export Button */}
                    <button
                      onClick={handleExportWorkflow}
                      data-export-btn
                      className="p-2 rounded-lg bg-[var(--highlight-color)] border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-colors"
                      title="Export workflow as PNG image"
                    >
                      <Download size={18} className="text-[var(--text-primary)]" />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={handleEditWorkflow}
                      className="px-3 py-2 rounded-lg bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] transition-colors flex items-center gap-2"
                    >
                      <ExternalLink size={16} />
                      Edit
                    </button>
                  </>
                )}
              </>
            )}

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-[var(--highlight-color)] border border-[var(--border-color)] hover:bg-[var(--border-color)] transition-colors text-[var(--text-primary)]"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-primary)] rounded-lg bg-[var(--highlight-color)] border border-[var(--border-color)] hover:bg-red-500 hover:text-white transition-colors"
              title="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2
                  className="animate-spin text-[var(--accent-color)] mb-4"
                  size={40}
                />
                <p className="text-[var(--text-secondary)]">
                  Loading workflow...
                </p>
              </div>
            </div>
          ) : workflowData ? (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
              panOnScroll={true}
              panOnDrag={true}
              zoomOnScroll={true}
              zoomOnPinch={true}
              zoomOnDoubleClick={false}
              nodesDraggable={false} // Disable node dragging in preview
              nodesConnectable={false} // Disable connecting in preview
              elementsSelectable={true} // Allow selection for viewing
              className="bg-[var(--bg-primary)]"
              defaultEdgeOptions={{
                style: { stroke: "var(--accent-color)", strokeWidth: 2 },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: "var(--accent-color)",
                },
              }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color={theme === "light" ? "#2a2a2a" : "#cfcfcf"}
              />
              <Controls showInteractive={false} />
              <MiniMap
                nodeColor="var(--accent-color)"
                maskColor="rgba(0,0,0,0.1)"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              />
            </ReactFlow>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[var(--text-secondary)] text-lg">
                  Failed to load workflow data
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {!loading && workflowData && (
          <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-b-xl">
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
              <div className="flex items-center gap-4">
                <span>Nodes: {nodes.length}</span>
                <span>Connections: {edges.length}</span>
                <span>
                  Created:{" "}
                  {new Date(workflowData.created_at).toLocaleDateString()}
                </span>
                {executionResults && (
                  <span className="text-green-600">
                    Execution ID: {executionResults.execution_id?.slice(0, 8)}...
                  </span>
                )}
              </div>
              <div className="text-xs">
                {hasExecuted 
                  ? "Execution completed • Results displayed in nodes" 
                  : "Click Execute to run workflow • Read-only preview"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewModal;