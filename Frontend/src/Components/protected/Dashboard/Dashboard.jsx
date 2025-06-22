import React from 'react';
import { useSelector } from 'react-redux';
import { selectAccount } from '../../../app/DashboardSlice';
import { 
  Activity, 
  BarChart3, 
  Clock, 
  Plus, 
  TrendingUp, 
  Users, 
  Workflow,
  Zap,
  ArrowRight,
  Calendar,
  Settings
} from 'lucide-react';

const Dashboard = () => {
  const user = useSelector(selectAccount);

  const stats = [
    {
      title: 'Total Workflows',
      value: '24',
      change: '+12%',
      trend: 'up',
      icon: Workflow,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Active Tasks',
      value: '8',
      change: '+5%',
      trend: 'up',
      icon: Activity,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Completed Today',
      value: '16',
      change: '+23%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Team Members',
      value: '12',
      change: '+2',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Created new workflow',
      workflow: 'Data Processing Pipeline',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      id: 2,
      action: 'Updated workflow',
      workflow: 'Email Automation',
      time: '4 hours ago',
      status: 'in-progress'
    },
    {
      id: 3,
      action: 'Executed workflow',
      workflow: 'Report Generation',
      time: '6 hours ago',
      status: 'completed'
    },
    {
      id: 4,
      action: 'Shared workflow',
      workflow: 'Customer Onboarding',
      time: '1 day ago',
      status: 'completed'
    }
  ];

  const quickActions = [
    {
      title: 'Create Workflow',
      description: 'Build a new automated workflow',
      icon: Plus,
      route: '/create',
      color: 'from-[var(--accent-color)] to-blue-500'
    },
    {
      title: 'View Analytics',
      description: 'Check your workflow performance',
      icon: BarChart3,
      route: '/analytics',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Schedule Tasks',
      description: 'Manage your task timeline',
      icon: Calendar,
      route: '/schedule',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Team Settings',
      description: 'Configure team permissions',
      icon: Settings,
      route: '/settings',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="max-w-7xl mx-auto space-y-6 mt-[4rem] md:mt-0">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[var(--card-bg)] to-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-color)] shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--accent-color)] to-blue-500 bg-clip-text text-transparent">
                Welcome back, {user?.uname || 'User'}! 👋
              </h1>
              <p className="text-[var(--text-secondary)] mt-2 text-lg">
                Here's what's happening with your workflows today
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-[var(--highlight-color)] rounded-full p-3">
                <Zap className="w-6 h-6 text-[var(--accent-color)]" />
              </div>
              <div className="text-right">
                <p className="text-sm text-[var(--text-secondary)]">System Status</p>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-500">All Systems Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--accent-color)]/10 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`w-6 h-6 text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`} />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.trend === 'up' 
                    ? 'bg-green-500/10 text-green-500' 
                    : 'bg-red-500/10 text-red-500'
                }`}>
                  {stat.change}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                  {stat.value}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm font-medium">
                  {stat.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Quick Actions</h2>
              <div className="w-8 h-8 bg-[var(--accent-color)]/10 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-[var(--accent-color)]" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className="group relative bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border-color)] hover:border-[var(--accent-color)]/50 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-[var(--accent-color)]/10"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                      <action.icon className={`w-5 h-5 text-transparent bg-gradient-to-r ${action.color} bg-clip-text`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-color)] transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {action.description}
                      </p>
                    </div>
                    
                    <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] group-hover:text-[var(--accent-color)] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Recent Activity</h2>
              <Clock className="w-5 h-5 text-[var(--accent-color)]" />
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'completed' 
                      ? 'bg-green-500' 
                      : activity.status === 'in-progress'
                      ? 'bg-yellow-500 animate-pulse'
                      : 'bg-gray-500'
                  }`}></div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm text-[var(--accent-color)] font-medium truncate">
                      {activity.workflow}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
              <button className="w-full text-center text-sm text-[var(--accent-color)] hover:text-[var(--accent-color)]/80 font-medium transition-colors">
                View All Activities
              </button>
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="bg-[var(--card-bg)] rounded-xl p-6 border border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Workflow Performance</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-[var(--text-secondary)]">Last 7 days</span>
              <BarChart3 className="w-5 h-5 text-[var(--accent-color)]" />
            </div>
          </div>
          
          {/* Placeholder for chart */}
          <div className="h-64 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-[var(--accent-color)] mx-auto mb-3" />
              <p className="text-[var(--text-secondary)]">Performance chart will be displayed here</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Connect your data to see insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;