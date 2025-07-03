import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Clock,
  Save,
  Edit3,
  Bell,
  ChevronDown,
  Workflow,
  Info,
  AlertCircle,
  CheckCircle2,
  Grid3X3,
  List,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  createTrigger,
  updateTrigger,
  getTriggerForWorkflow,
  getWorkflowsWithoutTriggers,
  getAllTriggers,
  deleteTrigger,
  validateTriggerData,
  toggleTrigger,
  hardDeleteTrigger,
} from "../../../Services/Repository/TriggerRepo";
import {
  getTimeTypeFromTime,
  formatTimeType,
  formatSelectedDays,
  getNextExecutionTime,
  formatExecutionTime,
  getTriggerStatus,
  getStatusColor,
  getStatusBackground,
  DAYS_OF_WEEK,
} from "./t_utils/TriggerUtils";

const Trigger = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const workflowIdParam = searchParams.get("workflow_id");

  // View States
  const [currentView, setCurrentView] = useState("overview"); // overview, create, edit
  const [activeTab, setActiveTab] = useState("active"); // active, inactive, all
  const [viewMode, setViewMode] = useState("card"); // card, list
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [workflowsWithoutTriggersCount, setWorkflowsWithoutTriggersCount] =
    useState(0);

  // Data States
  const [allTriggers, setAllTriggers] = useState([]);
  const [availableWorkflows, setAvailableWorkflows] = useState([]);
  const [selectedTrigger, setSelectedTrigger] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [showWorkflowDropdown, setShowWorkflowDropdown] = useState(false);

  // Form States
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    wf_id: null,
    schedule_type: "weekly",
    days: [],
    time: "09:00:00",
    is_notify_before: true,
    is_notify_after: false,
  });

  // Filters
  const [filters, setFilters] = useState({
    timeType: "all",
    scheduleType: "all",
    notificationStatus: "all",
  });

  // Delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [triggerToDelete, setTriggerToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState("soft");

  useEffect(() => {
    initializeComponent();
  }, []);

  useEffect(() => {
    if (workflowIdParam) {
      handleDirectWorkflowAccess(workflowIdParam);
    }
  }, [workflowIdParam]);

  const initializeComponent = async () => {
    setIsLoading(true);
    await Promise.all([loadAllTriggers(), loadAvailableWorkflows()]);
    setIsLoading(false);
  };

  const handleDirectWorkflowAccess = async (workflowId) => {
    const trigger = await dispatch(getTriggerForWorkflow(workflowId));
    if (trigger) {
      setSelectedTrigger(trigger);
      setCurrentView("edit");
      setFormData({
        wf_id: trigger.wf_id,
        schedule_type: trigger.schedule_type || "weekly",
        days: trigger.days || [],
        time: trigger.time || "09:00:00",
        is_notify_before: trigger.is_notify_before ?? true,
        is_notify_after: trigger.is_notify_after ?? false,
      });
    } else {
      setCurrentView("create");
      setFormData((prev) => ({ ...prev, wf_id: parseInt(workflowId) }));
    }
  };

  const loadAllTriggers = async () => {
    try {
      const triggers = await getAllTriggers();
      setAllTriggers(triggers || []);
    } catch (error) {
      console.error("Error loading triggers:", error);
    }
  };

  const loadAvailableWorkflows = async () => {
    try {
      const workflows = await getWorkflowsWithoutTriggers();
      setAvailableWorkflows(workflows || []);
      setWorkflowsWithoutTriggersCount(workflows?.length || 0); // Add this line
    } catch (error) {
      console.error("Error loading workflows:", error);
      setWorkflowsWithoutTriggersCount(0); // Add this line for error case
    }
  };

  const handleCreateNew = () => {
    setCurrentView("create");
    setSelectedTrigger(null);
    setSelectedWorkflow(null);
    setFormData({
      wf_id: null,
      schedule_type: "weekly",
      days: [],
      time: "09:00:00",
      is_notify_before: true,
      is_notify_after: false,
    });
    setIsEditing(true);
  };

  const handleEditTrigger = (trigger) => {
    setSelectedTrigger(trigger);
    setCurrentView("edit");
    setFormData({
      wf_id: trigger.wf_id,
      schedule_type: trigger.schedule_type || "weekly",
      days: trigger.days || [],
      time: trigger.time || "09:00:00",
      is_notify_before: trigger.is_notify_before ?? true,
      is_notify_after: trigger.is_notify_after ?? false,
    });
    setIsEditing(false);
  };

  const handleDeleteTrigger = async (triggerId) => {
    if (window.confirm("Are you sure you want to delete this trigger?")) {
      try {
        await dispatch(deleteTrigger(triggerId));
        await loadAllTriggers();
        if (selectedTrigger?.ts_id === triggerId) {
          setCurrentView("overview");
        }
      } catch (error) {
        console.error("Error deleting trigger:", error);
      }
    }
  };

  const handleWorkflowSelect = (workflow) => {
    console.log(workflow);
    setSelectedWorkflow(workflow);
    setShowWorkflowDropdown(false);
    setFormData((prev) => ({ ...prev, wf_id: workflow.wf_id }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateTriggerData(formData)) return;

    try {
      if (selectedTrigger) {
        await dispatch(updateTrigger(selectedTrigger.ts_id, formData));
      } else {
        await dispatch(createTrigger(formData));
      }
      await loadAllTriggers();
      await loadAvailableWorkflows();
      setCurrentView("overview");
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving trigger:", error);
    }
  };

  const handleDayToggle = (dayIndex) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(dayIndex)
        ? prev.days.filter((d) => d !== dayIndex)
        : [...prev.days, dayIndex].sort(),
    }));
  };

  const handleToggleTrigger = async (triggerId) => {
    try {
      await toggleTrigger(triggerId);
      await loadAllTriggers(); // Refresh the list
    } catch (error) {
      console.error("Error toggling trigger:", error);
    }
  };

  const handleDeleteClick = (trigger, isHardDelete = false) => {
    setTriggerToDelete(trigger);
    setDeleteType(isHardDelete ? "hard" : "soft");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!triggerToDelete) return;

    try {
      if (deleteType === "hard") {
        await hardDeleteTrigger(triggerToDelete.ts_id);
      } else {
        await dispatch(deleteTrigger(triggerToDelete.ts_id));
      }
      await loadAllTriggers();
      if (selectedTrigger?.ts_id === triggerToDelete.ts_id) {
        setCurrentView("overview");
      }
    } catch (error) {
      console.error("Error deleting trigger:", error);
    }

    setShowDeleteModal(false);
    setTriggerToDelete(null);
  };

  // Filter and search logic
  const filteredTriggers = allTriggers.filter((trigger) => {
    const matchesSearch =
      trigger.workflow_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      trigger.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "active" && trigger.is_active) ||
      (activeTab === "inactive" && !trigger.is_active);

    const timeType = getTimeTypeFromTime(trigger.time);
    const matchesTimeType =
      filters.timeType === "all" || timeType === filters.timeType;

    const matchesScheduleType =
      filters.scheduleType === "all" ||
      trigger.schedule_type === filters.scheduleType;

    const matchesNotification =
      filters.notificationStatus === "all" ||
      (filters.notificationStatus === "before" && trigger.is_notify_before) ||
      (filters.notificationStatus === "after" && trigger.is_notify_after) ||
      (filters.notificationStatus === "both" &&
        trigger.is_notify_before &&
        trigger.is_notify_after);

    return (
      matchesSearch &&
      matchesTab &&
      matchesTimeType &&
      matchesScheduleType &&
      matchesNotification
    );
  });

  const TriggerCard = ({ trigger }) => {
    const timeType = getTimeTypeFromTime(trigger.time);
    const status = getTriggerStatus(trigger);
    const nextExecution = getNextExecutionTime(trigger);

    return (
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-[var(--accent-color)]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)] text-lg mb-1">
              {trigger.workflow_name}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mb-2">
              {trigger.description}
            </p>
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusBackground(
                status.type
              )} ${getStatusColor(status.type)}`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  status.type === "scheduled"
                    ? "bg-green-500"
                    : status.type === "today"
                    ? "bg-blue-500"
                    : status.type === "imminent"
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
              ></div>
              {status.message}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleTrigger(trigger.ts_id)}
              className={`p-2 rounded-lg transition-colors ${
                trigger.is_active
                  ? "hover:bg-orange-100 text-orange-600"
                  : "hover:bg-green-100 text-green-600"
              }`}
              title={
                trigger.is_active ? "Deactivate Trigger" : "Activate Trigger"
              }
            >
              {trigger.is_active ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => handleEditTrigger(trigger)}
              className="p-2 hover:bg-[var(--highlight-color)] rounded-lg transition-colors"
              title="Edit Trigger"
            >
              <Edit3 className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            <div className="relative group">
              <button
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                title="Delete Options"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[140px]">
                {/* <button
                  onClick={() => handleDeleteClick(trigger, false)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  Soft Delete
                </button> */}
                <button
                  onClick={() => handleDeleteClick(trigger, true)}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Hard Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Schedule
            </div>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              {formatSelectedDays(trigger.days)}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-secondary)] mb-1">
              Time
            </div>
            <div className="text-sm font-medium text-[var(--text-primary)]">
              {trigger.time} ({formatTimeType(timeType)})
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border-color)] pt-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-[var(--text-secondary)]">
              Next execution: {formatExecutionTime(nextExecution)}
            </div>
            <div className="flex items-center gap-2">
              {trigger.is_notify_before && (
                <Bell
                  className="w-3 h-3 text-[var(--accent-color)]"
                  title="Notify before"
                />
              )}
              {trigger.is_notify_after && (
                <Bell className="w-3 h-3 text-green-500" title="Notify after" />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TriggerListItem = ({ trigger }) => {
    const timeType = getTimeTypeFromTime(trigger.time);
    const status = getTriggerStatus(trigger);
    const nextExecution = getNextExecutionTime(trigger);

    return (
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex-1">
              <h3 className="font-medium text-[var(--text-primary)]">
                {trigger.workflow_name}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {trigger.description}
              </p>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {formatSelectedDays(trigger.days)}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">Days</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {trigger.time}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                {formatTimeType(timeType)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-[var(--text-primary)]">
                {formatExecutionTime(nextExecution)}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                Next run
              </div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBackground(
                status.type
              )} ${getStatusColor(status.type)}`}
            >
              {status.message}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => handleToggleTrigger(trigger.ts_id)}
              className={`p-2 rounded-lg transition-colors ${
                trigger.is_active
                  ? "hover:bg-orange-100 text-orange-600"
                  : "hover:bg-green-100 text-green-600"
              }`}
              title={trigger.is_active ? "Deactivate" : "Activate"}
            >
              {trigger.is_active ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => handleEditTrigger(trigger)}
              className="p-2 hover:bg-[var(--highlight-color)] rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            <div className="relative group">
              <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[140px]">
                {/* <button
                  onClick={() => handleDeleteClick(trigger, false)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                >
                  Soft Delete
                </button> */}
                <button
                  onClick={() => handleDeleteClick(trigger, true)}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Hard Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-5rem)] bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent-color)] mx-auto mb-4"></div>
          <p className="text-[var(--text-secondary)]">Loading triggers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-5rem)] bg-[var(--bg-primary)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sticky top-[10%] z-10 bg-[var(--bg-primary)] pt-2 pb-1">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Workflow Triggers
            </h1>
            <p className="text-[var(--text-secondary)]">
              Schedule and manage automated workflow executions
            </p>
          </div>
          {currentView === "overview" && (
            <div className="flex items-center gap-4">
              {/* Count badge */}
              {workflowsWithoutTriggersCount > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-100 border border-orange-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">
                    {workflowsWithoutTriggersCount} workflow
                    {workflowsWithoutTriggersCount !== 1 ? "s" : ""} without
                    triggers
                  </span>
                </div>
              )}

              {/* Create button */}
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--button-hover)] transition-colors font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Trigger
                {workflowsWithoutTriggersCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[var(--bg-primary)] text-[var(--text-primary)] bg-opacity-20 rounded-full text-xs">
                    {workflowsWithoutTriggersCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {currentView === "overview" ? (
          <>
            {/* Controls Bar */}
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Tabs */}
                <div className="flex bg-[var(--highlight-color)] rounded-lg p-1">
                  {["active", "inactive", "all"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? "bg-[var(--accent-color)] text-white"
                          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {tab === "active" &&
                        ` (${allTriggers.filter((t) => t.is_active).length})`}
                      {tab === "inactive" &&
                        ` (${allTriggers.filter((t) => !t.is_active).length})`}
                      {tab === "all" && ` (${allTriggers.length})`}
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    placeholder="Search workflows..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-color)]"
                  />
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-[var(--highlight-color)] rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("card")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "card"
                        ? "bg-[var(--accent-color)] text-white"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-[var(--accent-color)] text-white"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    showFilters
                      ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)]"
                      : "bg-[var(--input-bg)] text-[var(--text-secondary)] border-[var(--input-border)] hover:border-[var(--accent-color)]"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Refresh */}
                <button
                  onClick={() => loadAllTriggers()}
                  className="p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-color)] transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Time Type
                      </label>
                      <select
                        value={filters.timeType}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            timeType: e.target.value,
                          }))
                        }
                        className="w-full p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                      >
                        <option value="all">All Time Types</option>
                        <option value="early_morning">Early Morning</option>
                        <option value="morning">Morning</option>
                        <option value="early_afternoon">Early Afternoon</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="early_evening">Early Evening</option>
                        <option value="evening">Evening</option>
                        <option value="early_night">Early Night</option>
                        <option value="night">Night</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Schedule Type
                      </label>
                      <select
                        value={filters.scheduleType}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            scheduleType: e.target.value,
                          }))
                        }
                        className="w-full p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                      >
                        <option value="all">All Schedule Types</option>
                        <option value="weekly">Weekly</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Notifications
                      </label>
                      <select
                        value={filters.notificationStatus}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            notificationStatus: e.target.value,
                          }))
                        }
                        className="w-full p-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                      >
                        <option value="all">All Notifications</option>
                        <option value="before">Before Execution</option>
                        <option value="after">After Execution</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[var(--text-secondary)]">
                Showing {filteredTriggers.length} of {allTriggers.length}{" "}
                triggers
              </p>
            </div>

            {/* Triggers Grid/List */}
            {filteredTriggers.length === 0 ? (
              <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-12 text-center">
                <Clock className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                  No triggers found
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  {allTriggers.length === 0
                    ? `Get started by creating triggers for your workflows. ${
                        workflowsWithoutTriggersCount > 0
                          ? `${workflowsWithoutTriggersCount} workflow${
                              workflowsWithoutTriggersCount !== 1
                                ? "s are"
                                : " is"
                            } ready for triggers.`
                          : ""
                      }`
                    : "Try adjusting your search or filter criteria."}
                </p>
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--button-hover)] transition-colors font-medium mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create Trigger
                  {workflowsWithoutTriggersCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                      {workflowsWithoutTriggersCount}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "card"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredTriggers.map((trigger) =>
                  viewMode === "card" ? (
                    <TriggerCard key={trigger.ts_id} trigger={trigger} />
                  ) : (
                    <TriggerListItem key={trigger.ts_id} trigger={trigger} />
                  )
                )}
              </div>
            )}
          </>
        ) : (
          /* Create/Edit Form */
          <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] shadow-lg">
            <div className="p-6 border-b border-[var(--border-color)]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-[var(--text-primary)] flex items-center gap-2">
                    {currentView === "create" ? (
                      <>
                        <Plus className="w-5 h-5" />
                        Create New Trigger
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-5 h-5" />
                        Edit Trigger
                      </>
                    )}
                  </h2>
                  <p className="text-[var(--text-secondary)] mt-1">
                    {currentView === "create"
                      ? "Set up automated execution for your workflow"
                      : "Update trigger settings and schedule"}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView("overview")}
                  className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--highlight-color)] rounded-lg transition-colors"
                >
                  Back to Overview
                </button>
              </div>
            </div>

            {/* Workflow Selection for Create */}
            {currentView === "create" && !workflowIdParam && (
              <div className="p-6 border-b border-[var(--border-color)]">
                <h3 className="text-lg font-medium text-[var(--text-primary)] mb-4 flex items-center gap-2">
                  <Workflow className="w-5 h-5" />
                  Select Workflow
                </h3>

                <div className="relative z-20">
                  <button
                    onClick={() =>
                      setShowWorkflowDropdown(!showWorkflowDropdown)
                    }
                    className="w-full p-4 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg flex items-center justify-between hover:border-[var(--accent-color)] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Workflow className="w-5 h-5 text-[var(--accent-color)]" />
                      <div className="text-left">
                        {selectedWorkflow ? (
                          <>
                            <div className="font-medium text-[var(--text-primary)]">
                              {selectedWorkflow.name}
                            </div>
                            <div className="text-sm text-[var(--text-secondary)]">
                              {selectedWorkflow.description}
                            </div>
                          </>
                        ) : (
                          <div className="text-[var(--text-secondary)]">
                            Choose a workflow to set up triggers
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--text-secondary)] transition-transform ${
                        showWorkflowDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showWorkflowDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowWorkflowDropdown(false)}
                      />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg shadow-xl z-30 max-h-60 overflow-y-auto">
                        {availableWorkflows.length > 0 ? (
                          availableWorkflows.map((workflow) => (
                            <button
                              key={workflow.id}
                              onClick={() => handleWorkflowSelect(workflow)}
                              className="w-full p-4 text-left hover:bg-[var(--highlight-color)] transition-colors border-b border-[var(--border-color)] last:border-b-0"
                            >
                              <div className="font-medium text-[var(--text-primary)]">
                                {workflow.name}
                              </div>
                              <div className="text-sm text-[var(--text-secondary)] mt-1">
                                {workflow.description}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center text-[var(--text-secondary)]">
                            No workflows available for triggers
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Form */}
            {(formData.wf_id || selectedWorkflow) && (
              <form onSubmit={handleSubmit} className="p-6">
                {/* Status Indicator for Edit Mode */}
                {currentView === "edit" && (
                  <div className="mb-6">
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                        selectedTrigger
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-orange-100 text-orange-700 border border-orange-200"
                      }`}
                    >
                      {selectedTrigger ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Trigger Active
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" />
                          No Trigger Set
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Schedule Type */}
                <div className="mb-6">
                  <label className="block text-[var(--text-primary)] font-medium mb-3">
                    Schedule Type
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          schedule_type: "weekly",
                        }))
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        formData.schedule_type === "weekly"
                          ? "bg-[var(--accent-color)] text-white"
                          : "bg-[var(--highlight-color)] text-[var(--text-secondary)] hover:bg-[var(--accent-color)] hover:text-white"
                      }`}
                      disabled={currentView === "edit" && !isEditing}
                    >
                      Weekly
                    </button>
                  </div>
                </div>

                {/* Days Selection */}
                <div className="mb-6">
                  <label className="block text-[var(--text-primary)] font-medium mb-3">
                    Select Days
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                    {DAYS_OF_WEEK.map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          isEditing || currentView === "create"
                            ? handleDayToggle(index)
                            : null
                        }
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          formData.days.includes(index)
                            ? "bg-[var(--accent-color)] text-white"
                            : "bg-[var(--highlight-color)] text-[var(--text-secondary)] hover:bg-[var(--accent-color)] hover:text-white"
                        } ${
                          currentView === "edit" && !isEditing
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                        }`}
                        disabled={currentView === "edit" && !isEditing}
                      >
                        <div className="text-xs opacity-75">{day.short}</div>
                        <div>{day.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-6">
                  <label className="block text-[var(--text-primary)] font-medium mb-3">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Execution Time
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          time: e.target.value,
                        }))
                      }
                      disabled={currentView === "edit" && !isEditing}
                      className="px-4 py-3 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <div className="flex items-center gap-2 px-4 py-3 bg-[var(--highlight-color)] rounded-lg">
                      <span className="text-sm text-[var(--text-secondary)]">
                        Time Type:
                      </span>
                      <span className="font-medium text-[var(--accent-color)]">
                        {formatTimeType(getTimeTypeFromTime(formData.time))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="mb-8">
                  <label className="block text-[var(--text-primary)] font-medium mb-3">
                    <Bell className="w-4 h-4 inline mr-2" />
                    Notifications
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_notify_before}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            is_notify_before: e.target.checked,
                          }))
                        }
                        disabled={currentView === "edit" && !isEditing}
                        className="w-4 h-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)] disabled:opacity-60"
                      />
                      <span className="text-[var(--text-primary)]">
                        Notify before execution
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_notify_after}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            is_notify_after: e.target.checked,
                          }))
                        }
                        disabled={currentView === "edit" && !isEditing}
                        className="w-4 h-4 text-[var(--accent-color)] border-[var(--border-color)] rounded focus:ring-[var(--accent-color)] disabled:opacity-60"
                      />
                      <span className="text-[var(--text-primary)]">
                        Notify after execution
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                {(isEditing || currentView === "create") && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--button-hover)] transition-colors font-medium"
                    >
                      <Save className="w-4 h-4" />
                      {selectedTrigger ? "Update Trigger" : "Create Trigger"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedTrigger) {
                          setIsEditing(false);
                          setFormData({
                            wf_id: selectedTrigger.wf_id,
                            schedule_type:
                              selectedTrigger.schedule_type || "weekly",
                            days: selectedTrigger.days || [],
                            time: selectedTrigger.time || "09:00:00",
                            is_notify_before:
                              selectedTrigger.is_notify_before ?? true,
                            is_notify_after:
                              selectedTrigger.is_notify_after ?? false,
                          });
                        } else {
                          setCurrentView("overview");
                        }
                      }}
                      className="px-6 py-3 bg-[var(--highlight-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--border-color)] transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            )}
            {/* Edit button OUTSIDE form */}
            {selectedTrigger && !isEditing && currentView === "edit" && (
              <div className="p-6 border-b border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent-color)] text-white rounded-lg hover:bg-[var(--button-hover)] transition-colors font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Trigger
                </button>
              </div>
            )}

            {/* Info Section */}
            {(formData.wf_id || selectedWorkflow) && (
              <div className="p-6 bg-[var(--highlight-color)] border-t border-[var(--border-color)]">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[var(--accent-color)] mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-[var(--text-secondary)]">
                    <p className="mb-2">
                      <strong>Time Types:</strong> Triggers are categorized by
                      execution time to optimize system performance.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
                      <div>• Early Morning: 6:00 AM - 9:00 AM</div>
                      <div>• Morning: 9:00 AM - 12:00 PM</div>
                      <div>• Early Afternoon: 12:00 PM - 3:00 PM</div>
                      <div>• Afternoon: 3:00 PM - 6:00 PM</div>
                      <div>• Early Evening: 6:00 PM - 9:00 PM</div>
                      <div>• Evening: 9:00 PM - 12:00 AM</div>
                      <div>• Early Night: 12:00 AM - 3:00 AM</div>
                      <div>• Night: 3:00 AM - 6:00 AM</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-full ${
                  deleteType === "hard" ? "bg-red-100" : "bg-orange-100"
                }`}
              >
                <AlertCircle
                  className={`w-5 h-5 ${
                    deleteType === "hard" ? "text-red-500" : "text-orange-500"
                  }`}
                />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {deleteType === "hard"
                  ? "Permanently Delete Trigger"
                  : "Delete Trigger"}
              </h3>
            </div>

            <p className="text-[var(--text-secondary)] mb-2">
              Are you sure you want to{" "}
              {deleteType === "hard" ? "permanently delete" : "delete"} the
              trigger for:
            </p>
            <p className="font-medium text-[var(--text-primary)] mb-4">
              "{triggerToDelete?.workflow_name}"
            </p>

            {deleteType === "hard" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm font-medium">
                  ⚠️ This action cannot be undone. The trigger will be
                  permanently removed from the system.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-[var(--highlight-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--border-color)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  deleteType === "hard"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-orange-600 hover:bg-orange-700"
                }`}
              >
                {deleteType === "hard" ? "Permanently Delete" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trigger;
