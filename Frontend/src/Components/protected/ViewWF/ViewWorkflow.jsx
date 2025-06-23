import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  Trash2,
  Edit,
  Calendar,
  Activity,
  Zap,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Grid,
  List,
  Plus,
} from "lucide-react";

// Import services
import {
  getUserWorkflows,
  deleteWorkflow,
  activateWorkflow,
  getWorkflowById,
} from "../../../services/repository/BuilderRepo";
import PreviewModal from "./vwf_utils/PreviewModal";
import toast from "react-hot-toast";

const ViewWorkflow = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("updated_at"); // 'name', 'created_at', 'updated_at', 'credits'
  const [filterActive, setFilterActive] = useState("all"); // 'all', 'active', 'inactive'

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    workflowId: null,
    workflowData: null,
    loading: false,
  });
  const [workflowCache, setWorkflowCache] = useState(new Map());

  // Load workflows on component mount
  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await dispatch(getUserWorkflows());
      setWorkflows(data || []);
    } catch (error) {
      console.error("Failed to load workflows:", error);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle workflow activation/deactivation
  const handleToggleActive = async (workflowId, isActive) => {
    try {
      setActionLoading((prev) => ({ ...prev, [workflowId]: "toggle" }));

      if (isActive) {
        // Deactivate workflow using deleteWorkflow
        await dispatch(deleteWorkflow(workflowId));
      } else {
        // Activate workflow
        await dispatch(activateWorkflow(workflowId));
      }

      // Refresh workflows list
      await loadWorkflows();
    } catch (error) {
      console.error("Failed to toggle workflow status:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [workflowId]: null }));
    }
  };

  // Handle workflow deletion (permanent)
  const handleDelete = async (workflowId, workflowName) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${workflowName}"?`
      )
    ) {
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [workflowId]: "delete" }));
      await dispatch(deleteWorkflow(workflowId));
      await loadWorkflows();
    } catch (error) {
      console.error("Failed to delete workflow:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, [workflowId]: null }));
    }
  };

  // Handle workflow edit
  const handleEdit = async (workflowId) => {
    navigate(`/create?edit=${workflowId}`);
  };

  // Handle workflow execution
  const handleExecute = async (workflowId) => {
    navigate(`/execute?wf=${workflowId}`);
  };
  // Add this function to handle workflow preview
  const handlePreviewWorkflow = async (workflowId) => {
    try {
      // Check cache first
      if (workflowCache.has(workflowId)) {
        console.log(`Loading workflow ${workflowId} from cache`);
        setPreviewModal({
          isOpen: true,
          workflowId,
          workflowData: workflowCache.get(workflowId),
          loading: false,
        });
        return;
      }

      // Set loading state
      setPreviewModal({
        isOpen: true,
        workflowId,
        workflowData: null,
        loading: true,
      });

      // Fetch from backend
      console.log(`Fetching workflow ${workflowId} from backend`);
      const workflowData = await dispatch(getWorkflowById(workflowId));

      // Cache the data
      setWorkflowCache((prev) => new Map(prev.set(workflowId, workflowData)));

      // Update modal with data
      setPreviewModal({
        isOpen: true,
        workflowId,
        workflowData,
        loading: false,
      });
    } catch (error) {
      console.error("Failed to load workflow for preview:", error);
      setPreviewModal({
        isOpen: false,
        workflowId: null,
        workflowData: null,
        loading: false,
      });
    }
  };

  // Add this function to close modal
  const handleClosePreview = () => {
    setPreviewModal({
      isOpen: false,
      workflowId: null,
      workflowData: null,
      loading: false,
    });
  };

  // Filter and sort workflows
  const filteredAndSortedWorkflows = workflows
    .filter((workflow) => {
      // Search filter
      const matchesSearch =
        workflow.name.toLowerCase().includes(search.toLowerCase()) ||
        workflow.description.toLowerCase().includes(search.toLowerCase());

      // Active/Inactive filter
      const matchesActiveFilter =
        filterActive === "all" ||
        (filterActive === "active" && workflow.is_active) ||
        (filterActive === "inactive" && !workflow.is_active);

      return matchesSearch && matchesActiveFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "created_at":
          return new Date(b.created_at) - new Date(a.created_at);
        case "updated_at":
          return new Date(b.updated_at) - new Date(a.updated_at);
        case "credits":
          return b.credits - a.credits;
        default:
          return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

  // Separate active and inactive workflows
  const activeWorkflows = filteredAndSortedWorkflows.filter(
    (wf) => wf.is_active
  );
  const inactiveWorkflows = filteredAndSortedWorkflows.filter(
    (wf) => !wf.is_active
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Workflow Card Component
  const WorkflowCard = ({ workflow, isActive }) => (
    <div
      className={`
      relative p-6 rounded-xl border transition-all duration-200 hover:shadow-lg
      ${
        isActive
          ? "bg-[var(--card-bg)] border-[var(--accent-color)] shadow-sm"
          : "bg-[var(--highlight-color)] border-[var(--border-color)] opacity-75"
      }
      ${viewMode === "list" ? "flex items-center justify-between" : ""}
    `}
      onClick={() => {
        // if (!isActive) {
        //   toast.error("Please Activate workflow");
        // }
        handlePreviewWorkflow(workflow.wf_id);
      }}
    >
      {/* Add a preview indicator */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-xs text-[var(--accent-color)] font-medium">
          Click to preview
        </div>
      </div>
      {/* Status indicator */}
      <div
        className={`
        absolute top-3 right-3 w-3 h-3 rounded-full
        ${isActive ? "bg-green-500" : "bg-gray-400"}
      `}
      />

      <div className={viewMode === "list" ? "flex-1" : ""}>
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1 pr-6">
            {workflow.name}
          </h3>
          <p className="text-sm h-[3rem] text-[var(--text-secondary)] line-clamp-2">
            {workflow.description}
          </p>
        </div>

        {/* Stats */}
        <div
          className={`
          grid gap-4 mb-4
          ${viewMode === "list" ? "grid-cols-4" : "grid-cols-2"}
        `}
        >
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-[var(--accent-color)]" />
            <span className="text-sm text-[var(--text-secondary)]">
              {workflow.credits} credits
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-[var(--accent-color)]" />
            <span className="text-sm text-[var(--text-secondary)]">
              {workflow.executed_count} runs
            </span>
          </div>
          {viewMode === "grid" && (
            <>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--accent-color)]" />
                <span className="text-sm text-[var(--text-secondary)]">
                  {formatDate(workflow.created_at)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw size={16} className="text-[var(--accent-color)]" />
                <span className="text-sm text-[var(--text-secondary)]">
                  {formatDate(workflow.updated_at)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div
        className={`
        flex gap-2
        ${viewMode === "list" ? "flex-row" : "flex-wrap items-center justify-end"}
      `}
      >
        {/* Execute Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleExecute(workflow.wf_id);
          }}
          disabled={!isActive || actionLoading[workflow.wf_id]}
          className="px-3 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-1.5 bg-[var(--button-bg)] text-[var(--button-text)] hover:bg-[var(--button-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Execute workflow"
        >
          <Play size={14} />
          {viewMode === "grid" && "Run"}
        </button>

        {/* Edit Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit(workflow.wf_id);
          }}
          disabled={actionLoading[workflow.wf_id]}
          className="px-3 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-1.5 bg-[var(--highlight-color)] text-[var(--text-primary)] hover:bg-[var(--border-color)] border border-[var(--border-color)] disabled:opacity-50"
          title="Edit workflow"
        >
          <Edit size={14} />
          {viewMode === "grid" && "Edit"}
        </button>

        {/* Toggle Active/Inactive */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleActive(workflow.wf_id, isActive);
          }}
          disabled={actionLoading[workflow.wf_id] === "toggle"}
          className={`
            px-3 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-1.5 border disabled:opacity-50
            ${
              isActive
                ? "bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                : "bg-green-500 text-white hover:bg-green-600 border-green-500"
            }
          `}
          title={isActive ? "Deactivate workflow" : "Activate workflow"}
        >
          {actionLoading[workflow.wf_id] === "toggle" ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : isActive ? (
            <Pause size={14} />
          ) : (
            <Play size={14} />
          )}
          {viewMode === "grid" && (isActive ? "Deactivate" : "Activate")}
        </button>

        {/* Delete Button */}
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(workflow.wf_id, workflow.name);
          }}
          disabled={actionLoading[workflow.wf_id] === "delete"}
          className="px-3 py-1.5 text-sm rounded-md transition-all duration-200 flex items-center gap-1.5 bg-red-500 text-white hover:bg-red-600 border border-red-500 disabled:opacity-50"
          title="Delete workflow"
        >
          {actionLoading[workflow.wf_id] === "delete" ? (
            <RefreshCw size={14} className="animate-spin" />
          ) : (
            <Trash2 size={14} />
          )}
          {viewMode === "grid" && "Delete"}
        </button> */}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
        <RefreshCw
          className="animate-spin text-[var(--accent-color)]"
          size={40}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                My Workflows
              </h1>
              <p className="text-[var(--text-secondary)]">
                Manage and execute your automation workflows
              </p>
            </div>
            <button
              onClick={() => navigate("/create")}
              className="px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Create Workflow
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]"
              />
              <input
                type="text"
                placeholder="Search workflows..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              />
            </div>

            {/* Filters and View Controls */}
            <div className="flex flex-wrap gap-2">
              {/* Filter by Active Status */}
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              >
                <option value="updated_at">Recently Updated</option>
                <option value="created_at">Recently Created</option>
                <option value="name">Name</option>
                <option value="credits">Credits</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-[var(--highlight-color)] rounded-lg p-1 border border-[var(--border-color)]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-[var(--accent-color)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-[var(--accent-color)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <List size={18} />
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={loadWorkflows}
                disabled={loading}
                className="p-2 bg-[var(--highlight-color)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--border-color)] transition-colors disabled:opacity-50"
                title="Refresh workflows"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Workflows Content */}
        {filteredAndSortedWorkflows.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle
              size={48}
              className="mx-auto text-[var(--text-secondary)] mb-4"
            />
            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
              No workflows found
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {search || filterActive !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Get started by creating your first workflow."}
            </p>
            {!search && filterActive === "all" && (
              <button
                onClick={() => navigate("/create")}
                className="px-6 py-3 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] transition-colors"
              >
                Create Your First Workflow
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Workflows */}
            {activeWorkflows.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    Active Workflows ({activeWorkflows.length})
                  </h2>
                </div>
                <div
                  className={`
                  gap-6
                  ${
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "flex flex-col"
                  }
                `}
                >
                  {activeWorkflows.map((workflow) => (
                    <WorkflowCard
                      key={workflow.wf_id}
                      workflow={workflow}
                      isActive={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Inactive Workflows */}
            {inactiveWorkflows.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                    Inactive Workflows ({inactiveWorkflows.length})
                  </h2>
                </div>
                <div
                  className={`
                  gap-6
                  ${
                    viewMode === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "flex flex-col"
                  }
                `}
                >
                  {inactiveWorkflows.map((workflow) => (
                    <WorkflowCard
                      key={workflow.wf_id}
                      workflow={workflow}
                      isActive={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Add Preview Modal */}
      <PreviewModal
        isOpen={previewModal.isOpen}
        onClose={handleClosePreview}
        workflowData={previewModal.workflowData}
        loading={previewModal.loading}
        workflowId={previewModal.workflowId}
      />
    </div>
  );
};

export default ViewWorkflow;
