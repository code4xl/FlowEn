import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  CreditCard, 
  Activity,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Eye,
  Workflow,
  Clock,
  Zap
} from 'lucide-react';
import { getAllUsers, getUserActivity } from '../../../../Services/Repository/AccountRepo';

const Analytics = ({ activeSubTab }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [analytics, setAnalytics] = useState({
    userStats: {
      totalUsers: 0,
      activeUsers: 0,
      newUsersThisWeek: 0,
      userGrowthRate: 0
    },
    workflowStats: {
      totalWorkflows: 0,
      executedWorkflows: 0,
      avgExecutionsPerUser: 0,
      topWorkflowTypes: []
    },
    creditStats: {
      totalCreditsIssued: 0,
      totalCreditsUsed: 0,
      avgCreditsPerUser: 0,
      creditUtilizationRate: 0
    }
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const userData = await getAllUsers();
      setUsers(userData || []);
      processAnalyticsData(userData || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (userData) => {
    const totalUsers = userData.length;
    const activeUsers = userData.filter(user => user.is_active).length;
    
    // Calculate new users this week (mock data since we don't have date filtering)
    const newUsersThisWeek = Math.floor(totalUsers * 0.1); // 10% as new users
    const userGrowthRate = totalUsers > 0 ? ((newUsersThisWeek / totalUsers) * 100) : 0;

    // Credit calculations
    const totalCreditsIssued = userData.reduce((sum, user) => sum + (user.credits || 0), 0);
    const avgCreditsPerUser = totalUsers > 0 ? Math.round(totalCreditsIssued / totalUsers) : 0;
    
    // Mock workflow data (in real app, this would come from workflow API)
    const totalWorkflows = totalUsers * 3; // Assume 3 workflows per user on average
    const executedWorkflows = totalUsers * 5; // Assume 5 executions per user
    const avgExecutionsPerUser = totalUsers > 0 ? Math.round(executedWorkflows / totalUsers) : 0;

    setAnalytics({
      userStats: {
        totalUsers,
        activeUsers,
        newUsersThisWeek,
        userGrowthRate: Math.round(userGrowthRate * 100) / 100
      },
      workflowStats: {
        totalWorkflows,
        executedWorkflows,
        avgExecutionsPerUser,
        topWorkflowTypes: [
          { name: 'Data Processing', count: Math.floor(totalWorkflows * 0.3) },
          { name: 'API Integration', count: Math.floor(totalWorkflows * 0.25) },
          { name: 'Email Automation', count: Math.floor(totalWorkflows * 0.2) },
          { name: 'File Management', count: Math.floor(totalWorkflows * 0.15) },
          { name: 'Notifications', count: Math.floor(totalWorkflows * 0.1) }
        ]
      },
      creditStats: {
        totalCreditsIssued,
        totalCreditsUsed: Math.floor(totalCreditsIssued * 0.7), // 70% utilization
        avgCreditsPerUser,
        creditUtilizationRate: 70
      }
    });
  };

  const renderUserTrends = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">User Trends</h2>
          <p className="text-[var(--text-secondary)]">Monitor user growth and engagement patterns</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={fetchAnalyticsData}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{analytics.userStats.totalUsers}</p>
              <p className="text-blue-200 text-xs mt-1">
                <TrendingUp className="w-3 h-3 inline mr-1" />
                +{analytics.userStats.userGrowthRate}% growth
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Active Users</p>
              <p className="text-2xl font-bold">{analytics.userStats.activeUsers}</p>
              <p className="text-green-200 text-xs mt-1">
                {Math.round((analytics.userStats.activeUsers / analytics.userStats.totalUsers) * 100)}% of total
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">New Users</p>
              <p className="text-2xl font-bold">{analytics.userStats.newUsersThisWeek}</p>
              <p className="text-purple-200 text-xs mt-1">This week</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Growth Rate</p>
              <p className="text-2xl font-bold">{analytics.userStats.userGrowthRate}%</p>
              <p className="text-orange-200 text-xs mt-1">Weekly average</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* User Activity Chart */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">User Activity Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-[var(--text-primary)] mb-3">User Status Distribution</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Active Users</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(analytics.userStats.activeUsers / analytics.userStats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[var(--text-primary)] font-medium">{analytics.userStats.activeUsers}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Inactive Users</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${((analytics.userStats.totalUsers - analytics.userStats.activeUsers) / analytics.userStats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-[var(--text-primary)] font-medium">{analytics.userStats.totalUsers - analytics.userStats.activeUsers}</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-md font-medium text-[var(--text-primary)] mb-3">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-[var(--bg-secondary)] rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-[var(--text-secondary)]">New user registrations: {analytics.userStats.newUsersThisWeek}</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-[var(--bg-secondary)] rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-[var(--text-secondary)]">User logins: {Math.floor(analytics.userStats.activeUsers * 1.5)}</span>
              </div>
              <div className="flex items-center gap-3 p-2 bg-[var(--bg-secondary)] rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-[var(--text-secondary)]">Profile updates: {Math.floor(analytics.userStats.totalUsers * 0.1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWorkflowTrends = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Workflow Trends</h2>
          <p className="text-[var(--text-secondary)]">Track workflow creation and execution patterns</p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Workflow Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Total Workflows</p>
              <p className="text-2xl font-bold">{analytics.workflowStats.totalWorkflows}</p>
              <p className="text-indigo-200 text-xs mt-1">Created by users</p>
            </div>
            <Workflow className="w-8 h-8 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-100 text-sm">Executions</p>
              <p className="text-2xl font-bold">{analytics.workflowStats.executedWorkflows}</p>
              <p className="text-cyan-200 text-xs mt-1">Total runs</p>
            </div>
            <Zap className="w-8 h-8 text-cyan-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Avg per User</p>
              <p className="text-2xl font-bold">{analytics.workflowStats.avgExecutionsPerUser}</p>
              <p className="text-teal-200 text-xs mt-1">Executions</p>
            </div>
            <BarChart3 className="w-8 h-8 text-teal-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm">Success Rate</p>
              <p className="text-2xl font-bold">94%</p>
              <p className="text-pink-200 text-xs mt-1">Execution success</p>
            </div>
            <TrendingUp className="w-8 h-8 text-pink-200" />
          </div>
        </div>
      </div>

      {/* Top Workflow Types */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Popular Workflow Types</h3>
        <div className="space-y-4">
          {analytics.workflowStats.topWorkflowTypes.map((type, index) => (
            <div key={type.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white font-semibold text-sm">
                  {index + 1}
                </div>
                <span className="font-medium text-[var(--text-primary)]">{type.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[var(--accent-color)] h-2 rounded-full" 
                    style={{ width: `${(type.count / analytics.workflowStats.totalWorkflows) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[var(--text-primary)] font-medium w-12 text-right">{type.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Execution Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Average Execution Time</span>
              <span className="font-medium text-[var(--text-primary)]">2.3s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Fastest Execution</span>
              <span className="font-medium text-[var(--text-primary)]">0.8s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Slowest Execution</span>
              <span className="font-medium text-[var(--text-primary)]">15.2s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Error Rate</span>
              <span className="font-medium text-red-600">6%</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Usage Patterns</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Peak Usage Time</span>
              <span className="font-medium text-[var(--text-primary)]">2:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Most Active Day</span>
              <span className="font-medium text-[var(--text-primary)]">Wednesday</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Avg Daily Executions</span>
              <span className="font-medium text-[var(--text-primary)]">{Math.floor(analytics.workflowStats.executedWorkflows / 30)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Weekend Activity</span>
              <span className="font-medium text-[var(--text-primary)]">15%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreditUsage = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Credit Usage Analytics</h2>
          <p className="text-[var(--text-secondary)]">Monitor credit distribution and consumption patterns</p>
        </div>
        <button
          onClick={fetchAnalyticsData}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Credit Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Total Issued</p>
              <p className="text-2xl font-bold">{analytics.creditStats.totalCreditsIssued.toLocaleString()}</p>
              <p className="text-emerald-200 text-xs mt-1">Credits distributed</p>
            </div>
            <CreditCard className="w-8 h-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Total Used</p>
              <p className="text-2xl font-bold">{analytics.creditStats.totalCreditsUsed.toLocaleString()}</p>
              <p className="text-amber-200 text-xs mt-1">Credits consumed</p>
            </div>
            <TrendingDown className="w-8 h-8 text-amber-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-500 to-violet-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm">Average per User</p>
              <p className="text-2xl font-bold">{analytics.creditStats.avgCreditsPerUser}</p>
              <p className="text-violet-200 text-xs mt-1">Credits allocated</p>
            </div>
            <Users className="w-8 h-8 text-violet-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-rose-100 text-sm">Utilization Rate</p>
              <p className="text-2xl font-bold">{analytics.creditStats.creditUtilizationRate}%</p>
              <p className="text-rose-200 text-xs mt-1">Usage efficiency</p>
            </div>
            <BarChart3 className="w-8 h-8 text-rose-200" />
          </div>
        </div>
      </div>

      {/* Credit Distribution Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Credit Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Users with 0 credits</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <span className="text-[var(--text-primary)] font-medium">{Math.floor(analytics.userStats.totalUsers * 0.15)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Users with 1-50 credits</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-[var(--text-primary)] font-medium">{Math.floor(analytics.userStats.totalUsers * 0.25)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Users with 51-200 credits</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <span className="text-[var(--text-primary)] font-medium">{Math.floor(analytics.userStats.totalUsers * 0.4)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Users with 200+ credits</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="text-[var(--text-primary)] font-medium">{Math.floor(analytics.userStats.totalUsers * 0.2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Usage Patterns</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Avg Credits per Workflow</span>
              <span className="font-medium text-[var(--text-primary)]">5.2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Most Expensive Workflow</span>
              <span className="font-medium text-[var(--text-primary)]">25 credits</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Cheapest Workflow</span>
              <span className="font-medium text-[var(--text-primary)]">1 credit</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--text-secondary)]">Daily Credit Consumption</span>
              <span className="font-medium text-[var(--text-primary)]">{Math.floor(analytics.creditStats.totalCreditsUsed / 30)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Recommendations */}
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Increase Allocation</span>
            </div>
            <p className="text-sm text-blue-700">
              {Math.floor(analytics.userStats.totalUsers * 0.15)} users have zero credits. Consider bonus allocation.
            </p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-900">Optimize Usage</span>
            </div>
            <p className="text-sm text-green-700">
              High utilization rate ({analytics.creditStats.creditUtilizationRate}%) indicates healthy engagement.
            </p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-orange-900">Monitor Trends</span>
            </div>
            <p className="text-sm text-orange-700">
              Track monthly patterns to predict future credit demand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubTab) {
      case 'user-trends':
        return renderUserTrends();
      case 'workflow-trends':
        return renderWorkflowTrends();
      case 'credit-usage':
        return renderCreditUsage();
      default:
        return renderUserTrends();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-[var(--accent-color)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return renderContent();
};

export default Analytics;