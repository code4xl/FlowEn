import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  SelectionMode,
  ControlButton,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  BrainCircuit,
  Puzzle,
  ArrowRightCircle,
  PanelLeftOpen,
  PanelLeftClose,
  Share2,
  Upload,
  Loader2,
  Group,
  Settings,
  Zap,
  Menu,
  X,
  MagnetIcon,
} from "lucide-react";

// Import utility components
import InputNode from "./builder_utils/nodes/InputNode";
import OutputNode from "./builder_utils/nodes/OutputNode";
import LLMNode from "./builder_utils/nodes/LLMNode";
import ToolNode from "./builder_utils/nodes/ToolNode";
import AgentNode from "./builder_utils/nodes/AgentNode";
import FlowingEdge from "./builder_utils/nodes/FlowingEdge";
import PatternMetaNode from "./builder_utils/nodes/PatternMetaNode";

// Import services
import {
  getNodes,
  createWorkflow,
  updateWorkflow,
} from "../../../Services/repository/BuilderRepo";
import { selectTheme } from "../../../App/DashboardSlice";

const Builder = () => {
  // Helper function to create unique IDs
  const getUniqueNodeId = (type) =>
    `${type}_${Math.random().toString(36).substr(2, 9)}`;

  // State management
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [clipboardNodes, setClipboardNodes] = useState(null);
  const [search, setSearch] = useState("");
  const [dropAsMetaNode, setDropAsMetaNode] = useState(false);
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [editingName, setEditingName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nodeTemplates, setNodeTemplates] = useState([]);

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const theme = useSelector(selectTheme);
  // const = isOpen = useSelector()

  // Helper function to get icon based on category
  const getNodeIcon = (category) => {
    switch (category) {
      case "input":
        return <MessageSquare size={18} />;
      case "llm":
        return <BrainCircuit size={18} />;
      case "tool":
        return <Puzzle size={18} />;
      case "output":
        return <ArrowRightCircle size={18} />;
      case "agent":
        return <Group size={18} />;
      case "pattern":
        return <Settings size={18} />;
      default:
        return <Zap size={18} />;
    }
  };

  const getDefaultDataForNode = (template) => {
    const defaultData = {};

    template.required?.forEach((field) => {
      switch (field.type) {
        case "dropdown":
          defaultData[field.name] = field.options?.[0] || "";
          break;
        case "multi-select":
          defaultData[field.name] = [];
          break;
        case "boolean":
          defaultData[field.name] = false;
          break;
        default:
          defaultData[field.name] = "";
      }
    });

    return defaultData;
  };

  // Load node templates on component mount
  useEffect(() => {
    const loadNodeTemplates = async () => {
      try {
        const templates = await dispatch(getNodes());
        setNodeTemplates(templates);
      } catch (error) {
        console.error("Failed to load node templates:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNodeTemplates();
  }, [dispatch]);

  // Node data change handler
  const onNodeDataChange = useCallback(
    (id, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Define node types
  const nodeTypes = useMemo(
    () => ({
      customInput: (props) => (
        <InputNode {...props} data={{ ...props.data, onNodeDataChange }} />
      ),
      customOutput: OutputNode,
      llm: (props) => (
        <LLMNode {...props} data={{ ...props.data, onNodeDataChange }} />
      ),
      toolNode: (props) => (
        <ToolNode {...props} data={{ ...props.data, onNodeDataChange }} />
      ),
      agentNode: (props) => (
        <AgentNode {...props} data={{ ...props.data, onNodeDataChange }} />
      ),
      patternMeta: PatternMetaNode,
    }),
    [onNodeDataChange]
  );

  // Define edge types
  const edgeTypes = useMemo(
    () => ({
      flowing: FlowingEdge,
    }),
    []
  );

  // Create sidebar items from node templates
  const sidebarNodeTypes = useMemo(() => {
    return nodeTemplates.map((template) => ({
      type: template.node_component_name,
      label: template.name,
      icon: getNodeIcon(template.category),
      defaultData: {
        label: template.name,
        ...getDefaultDataForNode(template),
      },
      template,
    }));
  }, [nodeTemplates]);

  // Pattern configurations
  const patternTypes = [
    {
      key: "augmented-llm",
      label: "Augmented LLM",
      icon: (
        <span className="text-lg font-bold text-[var(--text-primary)]">A</span>
      ),
      description: "Input → LLM+Tools → Output",
    },
    {
      key: "prompt-chaining",
      label: "Prompt Chaining",
      icon: (
        <span className="text-lg font-bold text-[var(--text-primary)]">C</span>
      ),
      description: "Input → Agent 1 → Agent 2 → Output",
    },
    {
      key: "routing",
      label: "Routing",
      icon: (
        <span className="text-lg font-bold text-[var(--text-primary)]">R</span>
      ),
      description: "Input → Router → Agent 1/2 → Output",
    },
  ];

  const allSidebarItems = [
    ...sidebarNodeTypes.map((n) => ({
      key: n.type,
      label: n.label,
      icon: n.icon,
      description: n.template.description,
      dragType: "node",
      dragData: {
        nodeType: n.type,
        nodeLabel: n.label,
        initialData: n.defaultData,
        template: n.template,
      },
    })),
    ...patternTypes.map((p) => ({
      key: p.key,
      label: p.label,
      icon: p.icon,
      description: p.description,
      dragType: "pattern",
      dragData: { pattern: p.key },
    })),
  ];

  const filteredSidebarItems = allSidebarItems.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  // Drag and drop handlers
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDragStart = (event, nodeType, nodeLabel, initialData, template) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.setData(
      "application/nodeInitialData",
      JSON.stringify(initialData)
    );
    event.dataTransfer.setData(
      "application/nodeTemplate",
      JSON.stringify(template)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!rfInstance) return;

      // Pattern drop logic
      const patternType = event.dataTransfer.getData("application/pattern");
      if (patternType) {
        const position = rfInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        // Handle pattern creation here
        return;
      }

      // Node drop logic
      const type = event.dataTransfer.getData("application/reactflow");
      const initialNodeDataJSON = event.dataTransfer.getData(
        "application/nodeInitialData"
      );
      const templateJSON = event.dataTransfer.getData(
        "application/nodeTemplate"
      );

      if (!type) return;

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const initialNodeData = JSON.parse(initialNodeDataJSON || "{}");
      const template = JSON.parse(templateJSON || "{}");

      let nodeData = {
        ...initialNodeData,
        onNodeDataChange,
        template,
      };

      const newNode = {
        id: getUniqueNodeId(type),
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [rfInstance, setNodes, onNodeDataChange]
  );

  // Connection handler
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Save workflow
  const handleSaveWorkflow = async () => {
  try {
    // Create clean workflow data with only user-entered values
    const workflowData = {
      nodes: nodes.map(node => {
        // Extract only the user-entered data, exclude template and functions
        const cleanData = {};
        
        // Get the template to know which fields to extract
        const template = node.data.template;
        
        // Extract user values for each required field
        if (template?.required) {
          template.required.forEach(field => {
            if (node.data[field.name] !== undefined) {
              cleanData[field.name] = node.data[field.name];
            }
          });
        }
        
        // Also include basic node info
        cleanData.label = node.data.label;
        cleanData.nodeId = template?.node_id; // Reference to template
        cleanData.nodeType = template?.node_component_name;
        
        return {
          id: node.id,
          type: node.type,
          position: node.position,
          data: cleanData // Only user data, no template or functions
        };
      }),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type
      }))
    };

    await dispatch(createWorkflow(
      workflowName,
      'Workflow created using builder',
      calculateCredits(),
      workflowData
    ));
  } catch (error) {
    console.error('Failed to save workflow:', error);
  }
};

  // Calculate total credits
  const calculateCredits = () => {
    return nodes.reduce((total, node) => {
      return total + (node.data.template?.credits || 0);
    }, 0);
  };

  // Run workflow
  const handleRunWorkflow = async () => {
    const inputNode = nodes.find((node) => node.type === "customInput");
    if (!inputNode?.data?.query) {
      alert("Please provide a query in an Input Node.");
      return;
    }

    setIsAgentRunning(true);
    try {
      // Simulate workflow execution
      setTimeout(() => {
        setNodes((nds) =>
          nds.map((node) =>
            node.type === "customOutput"
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    agentOutput: "Workflow executed successfully!",
                  },
                }
              : node
          )
        );
        setIsAgentRunning(false);
      }, 3000);
    } catch (error) {
      console.error("Workflow execution failed:", error);
      setIsAgentRunning(false);
    }
  };

  // File upload/download handlers
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target?.result;
      if (typeof text !== 'string') throw new Error('Failed to read file content.');

      const parsedGraph = JSON.parse(text);

      if (!parsedGraph || !Array.isArray(parsedGraph.nodes) || !Array.isArray(parsedGraph.edges)) {
        throw new Error('Invalid workflow file format.');
      }

      // Restore nodes by merging saved data with templates
      const restoredNodes = parsedGraph.nodes.map((savedNode) => {
        // Find the template for this node
        const template = nodeTemplates.find(t => t.node_id === savedNode.data.nodeId);
        
        if (!template) {
          console.warn(`Template not found for node: ${savedNode.data.nodeType}`);
          return {
            ...savedNode,
            data: { 
              ...savedNode.data, 
              onNodeDataChange,
              template: null 
            }
          };
        }

        return {
          ...savedNode,
          data: { 
            ...savedNode.data, 
            onNodeDataChange,
            template 
          }
        };
      });

      setNodes(restoredNodes);
      setEdges(parsedGraph.edges);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      alert('Workflow loaded successfully!');
    } catch (error) {
      console.error('Error loading workflow:', error);
      alert(`Failed to load workflow: ${error.message}`);
    }
  };
  reader.readAsText(file);
};

  const handleShareWorkflow = () => {
  const workflowData = {
    nodes: nodes.map(node => {
      const cleanData = {};
      const template = node.data.template;
      
      if (template?.required) {
        template.required.forEach(field => {
          if (node.data[field.name] !== undefined) {
            cleanData[field.name] = node.data[field.name];
          }
        });
      }
      
      cleanData.label = node.data.label;
      cleanData.nodeId = template?.node_id;
      cleanData.nodeType = template?.node_component_name;
      
      return {
        id: node.id,
        type: node.type,
        position: node.position,
        data: cleanData
      };
    }),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type
    }))
  };
  
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(workflowData, null, 2)
  )}`;
  const link = document.createElement('a');
  link.href = jsonString;
  link.download = `${workflowName}.json`;
  link.click();
};

  // Selection handlers
  const onSelectionChange = useCallback(({ nodes: selected }) => {
    setSelectedNodes(selected);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveWorkflow();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nodes, edges, workflowName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-[var(--bg-primary)]">
        <Loader2
          className="animate-spin text-[var(--accent-color)]"
          size={40}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] w-full overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Top Bar */}
      <header className="h-16 flex items-center justify-between px-6 shrink-0 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 rounded-md transition-all duration-200 hover:bg-[var(--highlight-color)] hover:scale-105 text-[var(--text-primary)]"
            title="Back to Dashboard"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {editingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditingName(false);
              }}
              className="ml-2"
            >
              <input
                autoFocus
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                onBlur={() => setEditingName(false)}
                className="text-xl font-semibold bg-transparent border-b border-[var(--accent-color)] text-[var(--text-primary)] focus:outline-none px-1 w-48"
              />
            </form>
          ) : (
            <span
              className="text-xl font-semibold text-[var(--text-primary)] ml-2 cursor-pointer hover:text-[var(--accent-color)]"
              onDoubleClick={() => setEditingName(true)}
              title="Double click to rename"
            >
              {workflowName}
            </span>
          )}
          <span className="text-sm text-[var(--text-secondary)] ml-4">
            Credits: {calculateCredits()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareWorkflow}
            className="px-3 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-1.5 hover:bg-[var(--highlight-color)] hover:scale-105 bg-[var(--button-bg)] text-[var(--button-text)]"
            title="Download workflow as JSON"
          >
            <Share2 size={16} /> Share
          </button>
          <button
            onClick={handleUploadClick}
            className="px-3 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-1.5 hover:bg-[var(--highlight-color)] hover:scale-105 bg-[var(--button-bg)] text-[var(--button-text)]"
            title="Load workflow from JSON file"
          >
            <Upload size={16} /> Upload
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            style={{ display: "none" }}
          />
          <button
            onClick={handleSaveWorkflow}
            className="px-3 py-1.5 text-sm rounded-md transition-all duration-200 hover:bg-[var(--button-hover)] bg-[var(--button-bg)] text-[var(--button-text)]"
          >
            Save Workflow
          </button>
        </div>
      </header>

      <div className="flex flex-grow min-h-0">
        <div className="flex relative">
          {/* Left Sidebar */}
          <aside
            className={`flex flex-col shrink-0 overflow-y-auto transition-all duration-300 ease-in-out ${
              isLeftSidebarOpen ? "w-72 p-4" : "w-0 p-0 overflow-hidden"
            } bg-[var(--bg-secondary)] border-r border-[var(--border-color)]`}
          >
            {isLeftSidebarOpen && (
              <>
                <div className="sticky top-0 z-20 pb-2 mb-3 flex flex-col gap-2 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
                  <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                    Node Library
                  </span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search nodes or patterns..."
                    className="mt-1 px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                  />
                </div>
                <div className="flex flex-col gap-4 flex-grow overflow-y-auto pb-4 scrollbar-hide">
                  {filteredSidebarItems.map((item) => (
                    <div
                      key={item.key}
                      onDragStart={(event) => {
                        if (item.dragType === "node") {
                          const nodeData = item.dragData;
                          onDragStart(
                            event,
                            nodeData.nodeType,
                            nodeData.nodeLabel,
                            nodeData.initialData,
                            nodeData.template
                          );
                        } else if (item.dragType === "pattern") {
                          const patternData = item.dragData;
                          event.dataTransfer.setData(
                            "application/pattern",
                            patternData.pattern
                          );
                          event.dataTransfer.effectAllowed = "move";
                        }
                      }}
                      draggable
                      className="group relative p-4 rounded-xl cursor-grab active:scale-[0.97] transition-all duration-200 bg-[var(--card-bg)] border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-md"
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-1 bg-[var(--highlight-color)]">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {item.label}
                        </span>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </aside>
          {/* Sidebar Toggle */}
          <div className="absolute -right-12 z-40 flex items-start h-[6%] px-2 mt-4 rounded-r-full py-1 bg-[var(--bg-secondary)] border-b border-[var(--border-color)]">
            <button
              onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
              className="p-1.5 rounded-md transition-all duration-200 hover:bg-[var(--highlight-color)] hover:scale-105 text-[var(--text-primary)]"
              title={
                isLeftSidebarOpen ? "Close Left Sidebar" : "Open Left Sidebar"
              }
            >
              {isLeftSidebarOpen ? (
                <PanelLeftClose size={20} />
              ) : (
                <PanelLeftOpen size={20} />
              )}
            </button>
          </div>
        </div>
        {/* React Flow Canvas */}
        <main
          className="flex-grow h-[calc(100vh-8rem)] relative bg-[var(--bg-primary)]"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges.map((edge) => ({
              ...edge,
              type: isAgentRunning ? "flowing" : "default",
              style: {
                stroke: "#0fdbff",
                strokeWidth: 2,
                ...edge.style,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#0fdbff",
                width: 15,
                height: 15,
              },
            }))}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setRfInstance}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
            panOnScroll={true}
            selectionOnDrag={true}
            panOnDrag={[1, 2]}
            selectionMode={SelectionMode.Partial}
            snapToGrid={true}
            snapGrid={[20, 20]}
            className="relative z-10"
            defaultEdgeOptions={{
              style: { stroke: "#0fdbff", strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "#0fdbff",
                width: 15,
                height: 15,
              },
              type: "default",
            }}
            onSelectionChange={onSelectionChange}
          >
            <Controls className="text-[#000000] bg-[var(--bg-secondary)] rounded-xl">
              {/* <ControlButton
                onClick={() => alert("Something magical just happened. ✨")}
              >
                <MagnetIcon />
              </ControlButton> */}
            </Controls>
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color={theme === "light" ? "#2a2a2a" : "#cfcfcf"}
            />
          </ReactFlow>

          {/* Run Button */}
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
            <button
              onClick={handleRunWorkflow}
              disabled={isAgentRunning}
              className="px-6 py-3 text-base font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] disabled:opacity-60 disabled:cursor-not-allowed border border-[var(--border-color)]"
              title="Run Workflow"
            >
              {isAgentRunning ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Running...</span>
                </>
              ) : (
                <span>Run Workflow</span>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Builder;
