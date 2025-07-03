import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Bot, 
  User, 
  ChevronDown, 
  ChevronUp,
  Download,
  Eye,
  ArrowUpDown,
  Calendar,
  Hash
} from 'lucide-react';

const LogsTable = ({ logs, loading, filters, onFiltersChange }) => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    if (diffMinutes > 0) return `${diffMinutes}m ago`;
    return 'Just now';
  };

  const formatExecutionTime = (timeString) => {
    const time = parseInt(timeString.replace('ms', ''));
    if (time < 1000) return timeString;
    if (time < 60000) return `${(time / 1000).toFixed(1)}s`;
    return `${(time / 60000).toFixed(1)}m`;
  };

  const toggleRowExpansion = (logId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedRows(newExpanded);
  };

  const handleSort = (column) => {
    const newSortOrder = filters.sortBy === column && filters.sortOrder === 'desc' ? 'asc' : 'desc';
    onFiltersChange({
      ...filters,
      sortBy: column,
      sortOrder: newSortOrder
    });
  };

  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Status', 'Type', 'Execution Time', 'Remark', 'Created At'],
      ...logs.map(log => [
        log.tl_id,
        log.status ? 'Success' : 'Failed',
        log.is_automatic ? 'Automatic' : 'Manual',
        log.execution_time,
        log.remark,
        new Date(log.created_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-32 h-6 bg-[var(--highlight-color)] rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-[var(--highlight-color)] rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-[var(--highlight-color)] rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-[var(--highlight-color)] rounded"></div>
                  <div className="w-1/2 h-3 bg-[var(--highlight-color)] rounded"></div>
                </div>
                <div className="w-20 h-4 bg-[var(--highlight-color)] rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Execution Logs ({logs.length})
          </h3>
          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('tl_id')}
                  className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
                >
                  <Hash className="h-4 w-4" />
                  ID
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
                >
                  Status
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('execution_time')}
                  className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
                >
                  <Clock className="h-4 w-4" />
                  Duration
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                <button
                  onClick={() => handleSort('created_at')}
                  className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Executed
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-[var(--card-bg)] divide-y divide-[var(--border-color)]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-[var(--text-secondary)]">
                  No logs found matching your criteria
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <React.Fragment key={log.tl_id}>
                  <tr className="hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--text-primary)]">
                      #{log.tl_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {log.status ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className={`text-sm font-medium ${
                          log.status ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {log.status ? 'Success' : 'Failed'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {log.is_automatic ? (
                          <Bot className="h-4 w-4 text-blue-500" />
                        ) : (
                          <User className="h-4 w-4 text-purple-500" />
                        )}
                        <span className="text-sm text-[var(--text-primary)]">
                          {log.is_automatic ? 'Automatic' : 'Manual'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">
                      {formatExecutionTime(log.execution_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">
                          {formatDate(log.created_at).relative}
                        </div>
                        <div className="text-xs">
                          {formatDate(log.created_at).date} {formatDate(log.created_at).time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">
                      <button
                        onClick={() => toggleRowExpansion(log.tl_id)}
                        className="flex items-center gap-1 px-2 py-1 hover:bg-[var(--highlight-color)] rounded transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        {expandedRows.has(log.tl_id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  {expandedRows.has(log.tl_id) && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-[var(--bg-secondary)]">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                              Execution Details
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-[var(--text-primary)]">Log ID:</span>
                                <span className="ml-2 text-[var(--text-secondary)]">#{log.tl_id}</span>
                              </div>
                              <div>
                                <span className="font-medium text-[var(--text-primary)]">Workflow ID:</span>
                                <span className="ml-2 text-[var(--text-secondary)]">#{log.wf_id}</span>
                              </div>
                              <div>
                                <span className="font-medium text-[var(--text-primary)]">Trigger Schedule ID:</span>
                                <span className="ml-2 text-[var(--text-secondary)]">#{log.ts_id}</span>
                              </div>
                              <div>
                                <span className="font-medium text-[var(--text-primary)]">Execution Time:</span>
                                <span className="ml-2 text-[var(--text-secondary)]">{log.execution_time}</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-[var(--text-primary)] mb-2">
                              Remark
                            </h4>
                            <div className="p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)]">
                              <p className="text-sm text-[var(--text-primary)]">
                                {log.remark}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogsTable;