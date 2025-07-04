import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Activity, 
  RefreshCw,
  Play,
  Filter,
  Search
} from 'lucide-react';
import { getUserWorkflows } from '../../../Services/Repository/BuilderRepo';
import { getDetailLogs, getExecutionStats, executeWorkflow } from '../../../Services/Repository/LogsRepo';
import LogsTable from './log_utils/LogsTable';
import StatsCards from './log_utils/StatsCards';
import WorkflowSelector from './log_utils/WorkflowSelector';
import FilterPanel from './log_utils/FilterPanel';

const Logs = () => {
  const { workflowId: paramWorkflowId } = useParams();
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [executeLoading, setExecuteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load workflows on component mount
  useEffect(() => {
    loadWorkflows();
  }, []);

  // Handle workflow selection from params or manual selection
  useEffect(() => {
    if (paramWorkflowId && workflows.length > 0) {
      const workflow = workflows.find(w => w.wf_id === parseInt(paramWorkflowId));
      if (workflow) {
        setSelectedWorkflow(workflow);
      }
    }
  }, [paramWorkflowId, workflows]);

  // Load logs and stats when workflow is selected
  useEffect(() => {
    if (selectedWorkflow) {
      loadWorkflowData(selectedWorkflow.wf_id);
    }
  }, [selectedWorkflow]);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const response = await getUserWorkflows();
      if (response) {
        setWorkflows(response);
      }
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowData = async (workflowId) => {
    await Promise.all([
      loadLogs(workflowId),
      loadStats(workflowId)
    ]);
  };

  const loadLogs = async (workflowId) => {
    try {
      setLogsLoading(true);
      const response = await getDetailLogs(workflowId);
      if (response.success) {
        setLogs(response.logs);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const loadStats = async (workflowId) => {
    try {
      setStatsLoading(true);
      const response = await getExecutionStats(workflowId);
      if (response.success) {
        setStats(response);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleExecuteWorkflow = async () => {
    if (!selectedWorkflow) return;
    
    try {
      setExecuteLoading(true);
      const response = await executeWorkflow(selectedWorkflow.wf_id);
      if (response.success) {
        // Reload logs and stats after successful execution
        setTimeout(() => {
          loadWorkflowData(selectedWorkflow.wf_id);
        }, 2000);
      }
    } catch (error) {
      console.error('Error executing workflow:', error);
    } finally {
      setExecuteLoading(false);
    }
  };

  const handleRefresh = () => {
    if (selectedWorkflow) {
      loadWorkflowData(selectedWorkflow.wf_id);
    }
  };

  const filteredLogs = logs.filter(log => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!log.remark.toLowerCase().includes(searchLower) &&
          !log.tl_id.toString().includes(searchLower)) {
        return false;
      }
    }

    // Status filter
    if (filters.status !== 'all') {
      if (filters.status === 'success' && !log.status) return false;
      if (filters.status === 'failed' && log.status) return false;
    }

    // Type filter
    if (filters.type !== 'all') {
      if (filters.type === 'automatic' && !log.is_automatic) return false;
      if (filters.type === 'manual' && log.is_automatic) return false;
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const logDate = new Date(log.created_at);
      const now = new Date();
      const diffTime = now - logDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (filters.dateRange === 'today' && diffDays > 0) return false;
      if (filters.dateRange === 'week' && diffDays > 7) return false;
      if (filters.dateRange === 'month' && diffDays > 30) return false;
    }

    return true;
  });

  // Sort filtered logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    const aValue = a[filters.sortBy];
    const bValue = b[filters.sortBy];
    
    if (filters.sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-[var(--accent-color)]" />
          <span className="text-[var(--text-primary)]">Loading workflows...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Workflow Logs
            </h1>
            <p className="text-[var(--text-secondary)]">
              Monitor and analyze workflow execution logs
            </p>
          </div>
          
          {selectedWorkflow && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={logsLoading || statsLoading}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${(logsLoading || statsLoading) ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              <button
                onClick={handleExecuteWorkflow}
                disabled={executeLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Play className={`h-4 w-4 ${executeLoading ? 'animate-spin' : ''}`} />
                Execute Now
              </button>
            </div>
          )}
        </div>

        {/* Workflow Selector */}
        {(!paramWorkflowId || !selectedWorkflow) && (
          <WorkflowSelector
            workflows={workflows}
            selectedWorkflow={selectedWorkflow}
            onWorkflowSelect={setSelectedWorkflow}
          />
        )}

        {/* Main Content */}
        {selectedWorkflow && (
          <>
            {/* Stats Cards */}
            <StatsCards stats={stats} loading={statsLoading} />

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg hover:bg-[var(--highlight-color)] transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
                {Object.values(filters).some(v => v !== 'all' && v !== 'created_at' && v !== 'desc') && (
                  <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full"></span>
                )}
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <FilterPanel
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
              />
            )}

            {/* Logs Table */}
            <LogsTable
              logs={sortedLogs}
              loading={logsLoading}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </>
        )}

        {/* Empty State */}
        {!selectedWorkflow && !loading && (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-[var(--text-secondary)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              No Workflow Selected
            </h3>
            <p className="text-[var(--text-secondary)]">
              Please select a workflow to view its execution logs and statistics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;







// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { 
//   Activity, 
//   AlertCircle, 
//   CheckCircle, 
//   Clock, 
//   Play, 
//   RefreshCw,
//   Filter,
//   Download,
//   Search
// } from 'lucide-react';
// import { getUserWorkflows } from '../../../Services/Repository/BuilderRepo';
// import { getDetailLogs, getExecutionStats, executeWorkflow } from '../../../Services/Repository/LogRepo';
// import LogsTable from './log_utils/LogsTable';
// import StatsCards from './log_utils/StatsCards';
// import WorkflowSelector from './log_utils/WorkflowSelector';
// import FilterPanel from './log_utils/FilterPanel';

// const Logs = () => {
//   const { workflowId: paramWorkflowId } = useParams();
//   const [workflows, setWorkflows] = useState([]);
//   const [selectedWorkflow, setSelectedWorkflow] = useState(null);
//   const [logs, setLogs] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [logsLoading, setLogsLoading] = useState(false);
//   const [statsLoading, setStatsLoading] = useState(false);
//   const [executeLoading, setExecuteLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filters, setFilters] = useState({
//     status: 'all', // all, success, failed
//     type: 'all', // all, automatic, manual
//     dateRange: 'all', // all, today, week, month
//     sortBy: 'created_at',
//     sortOrder: 'desc'
//   });
//   const [showFilters, setShowFilters] = useState(false);

//   // Load workflows on component mount
//   useEffect(() => {
//     loadWorkflows();
//   }, []);

//   // Handle workflow selection from params or manual selection
//   useEffect(() => {
//     if (paramWorkflowId && workflows.length > 0) {
//       const workflow = workflows.find(w => w.wf_id === parseInt(paramWorkflowId));
//       if (workflow) {
//         setSelectedWorkflow(workflow);
//       }
//     }
//   }, [paramWorkflowId, workflows]);

//   // Load logs and stats when workflow is selected
//   useEffect(() => {
//     if (selectedWorkflow) {
//       loadWorkflowData(selectedWorkflow.wf_id);
//     }
//   }, [selectedWorkflow]);

//   const loadWorkflows = async () => {
//     try {
//       setLoading(true);
//       const response = await getUserWorkflows();
//       if (response.success) {
//         setWorkflows(response.workflows);
//       }
//     } catch (error) {
//       console.error('Error loading workflows:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadWorkflowData = async (workflowId) => {
//     await Promise.all([
//       loadLogs(workflowId),
//       loadStats(workflowId)
//     ]);
//   };

//   const loadLogs = async (workflowId) => {
//     try {
//       setLogsLoading(true);
//       const response = await getDetailLogs(workflowId);
//       if (response.success) {
//         setLogs(response.logs);
//       }
//     } catch (error) {
//       console.error('Error loading logs:', error);
//     } finally {
//       setLogsLoading(false);
//     }
//   };

//   const loadStats = async (workflowId) => {
//     try {
//       setStatsLoading(true);
//       const response = await getExecutionStats(workflowId);
//       if (response.success) {
//         setStats(response);
//       }
//     } catch (error) {
//       console.error('Error loading stats:', error);
//     } finally {
//       setStatsLoading(false);
//     }
//   };

//   const handleExecuteWorkflow = async () => {
//     if (!selectedWorkflow) return;
    
//     try {
//       setExecuteLoading(true);
//       const response = await executeWorkflow(selectedWorkflow.wf_id);
//       if (response.success) {
//         // Reload logs and stats after successful execution
//         setTimeout(() => {
//           loadWorkflowData(selectedWorkflow.wf_id);
//         }, 2000);
//       }
//     } catch (error) {
//       console.error('Error executing workflow:', error);
//     } finally {
//       setExecuteLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     if (selectedWorkflow) {
//       loadWorkflowData(selectedWorkflow.wf_id);
//     }
//   };

//   const filteredLogs = logs.filter(log => {
//     // Search filter
//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();
//       if (!log.remark.toLowerCase().includes(searchLower) &&
//           !log.tl_id.toString().includes(searchLower)) {
//         return false;
//       }
//     }

//     // Status filter
//     if (filters.status !== 'all') {
//       if (filters.status === 'success' && !log.status) return false;
//       if (filters.status === 'failed' && log.status) return false;
//     }

//     // Type filter
//     if (filters.type !== 'all') {
//       if (filters.type === 'automatic' && !log.is_automatic) return false;
//       if (filters.type === 'manual' && log.is_automatic) return false;
//     }

//     // Date range filter
//     if (filters.dateRange !== 'all') {
//       const logDate = new Date(log.created_at);
//       const now = new Date();
//       const diffTime = now - logDate;
//       const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//       if (filters.dateRange === 'today' && diffDays > 0) return false;
//       if (filters.dateRange === 'week' && diffDays > 7) return false;
//       if (filters.dateRange === 'month' && diffDays > 30) return false;
//     }

//     return true;
//   });

//   // Sort filtered logs
//   const sortedLogs = [...filteredLogs].sort((a, b) => {
//     const aValue = a[filters.sortBy];
//     const bValue = b[filters.sortBy];
    
//     if (filters.sortOrder === 'asc') {
//       return aValue > bValue ? 1 : -1;
//     } else {
//       return aValue < bValue ? 1 : -1;
//     }
//   });

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex items-center space-x-2">
//           <RefreshCw className="h-6 w-6 animate-spin text-[var(--accent-color)]" />
//           <span className="text-[var(--text-primary)]">Loading workflows...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-[var(--bg-primary)] min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-[var(--text-primary)]">
//               Workflow Logs
//             </h1>
//             <p className="text-[var(--text-secondary)]">
//               Monitor and analyze workflow execution logs
//             </p>
//           </div>
          
//           {selectedWorkflow && (
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={handleRefresh}
//                 disabled={logsLoading || statsLoading}
//                 className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
//               >
//                 <RefreshCw className={`h-4 w-4 ${(logsLoading || statsLoading) ? 'animate-spin' : ''}`} />
//                 Refresh
//               </button>
              
//               <button
//                 onClick={handleExecuteWorkflow}
//                 disabled={executeLoading}
//                 className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
//               >
//                 <Play className={`h-4 w-4 ${executeLoading ? 'animate-spin' : ''}`} />
//                 Execute Now
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Workflow Selector */}
//         {(!paramWorkflowId || !selectedWorkflow) && (
//           <WorkflowSelector
//             workflows={workflows}
//             selectedWorkflow={selectedWorkflow}
//             onWorkflowSelect={setSelectedWorkflow}
//           />
//         )}

//         {/* Main Content */}
//         {selectedWorkflow && (
//           <>
//             {/* Stats Cards */}
//             <StatsCards stats={stats} loading={statsLoading} />

//             {/* Controls */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
//               {/* Search */}
//               <div className="relative flex-1 max-w-md">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
//                 <input
//                   type="text"
//                   placeholder="Search logs..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
//                 />
//               </div>

//               {/* Filter Toggle */}
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="flex items-center gap-2 px-4 py-2 border border-[var(--border-color)] rounded-lg hover:bg-[var(--highlight-color)] transition-colors"
//               >
//                 <Filter className="h-4 w-4" />
//                 Filters
//                 {Object.values(filters).some(v => v !== 'all' && v !== 'created_at' && v !== 'desc') && (
//                   <span className="w-2 h-2 bg-[var(--accent-color)] rounded-full"></span>
//                 )}
//               </button>
//             </div>

//             {/* Filter Panel */}
//             {showFilters && (
//               <FilterPanel
//                 filters={filters}
//                 onFiltersChange={setFilters}
//                 onClose={() => setShowFilters(false)}
//               />
//             )}

//             {/* Logs Table */}
//             <LogsTable
//               logs={sortedLogs}
//               loading={logsLoading}
//               filters={filters}
//               onFiltersChange={setFilters}
//             />
//           </>
//         )}

//         {/* Empty State */}
//         {!selectedWorkflow && !loading && (
//           <div className="text-center py-12">
//             <Activity className="h-16 w-16 text-[var(--text-secondary)] mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
//               No Workflow Selected
//             </h3>
//             <p className="text-[var(--text-secondary)]">
//               Please select a workflow to view its execution logs and statistics.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Logs;