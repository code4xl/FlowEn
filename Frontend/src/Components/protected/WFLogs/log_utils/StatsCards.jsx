import React from 'react';
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Zap,
  User,
  Bot
} from 'lucide-react';

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-[var(--highlight-color)] rounded-full"></div>
              <div className="w-12 h-6 bg-[var(--highlight-color)] rounded"></div>
            </div>
            <div className="w-20 h-8 bg-[var(--highlight-color)] rounded mb-2"></div>
            <div className="w-32 h-4 bg-[var(--highlight-color)] rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const successRate = stats.totalExecutions > 0 
    ? ((stats.successfulExecutions / stats.totalExecutions) * 100).toFixed(1)
    : 0;

  const formatTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatLastExecution = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const execDate = new Date(date);
    const diffTime = now - execDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) return `${diffDays} days ago`;
    if (diffHours > 0) return `${diffHours} hours ago`;
    if (diffMinutes > 0) return `${diffMinutes} minutes ago`;
    return 'Just now';
  };

  const cards = [
    {
      title: 'Total Executions',
      value: stats.totalExecutions,
      change: `${stats.executedCount} this period`,
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      darkBgColor: 'bg-blue-900/20'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      change: `${stats.successfulExecutions} successful`,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      darkBgColor: 'bg-green-900/20'
    },
    {
      title: 'Failed Executions',
      value: stats.failedExecutions,
      change: `${((stats.failedExecutions / (stats.totalExecutions || 1)) * 100).toFixed(1)}% failure rate`,
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      darkBgColor: 'bg-red-900/20'
    },
    {
      title: 'Avg. Execution Time',
      value: formatTime(stats.avgExecutionTime),
      change: `Last: ${formatLastExecution(stats.lastExecution)}`,
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      darkBgColor: 'bg-purple-900/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${card.bgColor} dark:${card.darkBgColor}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[var(--text-primary)]">
                  {card.value}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                {card.title}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {card.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Info Card */}
      <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Workflow: {stats.workflowName}
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${stats.totalExecutions > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-[var(--text-secondary)]">
              {stats.totalExecutions > 0 ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
              {stats.successfulExecutions}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Successful
            </div>
          </div>
          
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
              {stats.failedExecutions}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Failed
            </div>
          </div>
          
          <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="text-2xl font-bold text-[var(--text-primary)] mb-1">
              {formatTime(stats.avgExecutionTime)}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">
              Avg. Time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;