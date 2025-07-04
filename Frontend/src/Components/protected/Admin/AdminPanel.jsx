import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAccount, selectTheme } from '../../../App/DashboardSlice';
import { 
  Users, 
  CreditCard, 
  BarChart3, 
  Shield,
  UserCheck,
  TrendingUp,
  Database,
  Activity
} from 'lucide-react';

// Import utility components
import UserManagement from './admin_utils/UserManagement';
import CreditManagement from './admin_utils/CreditManagement';
import Analytics from './admin_utils/Analytics';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [activeSubTab, setActiveSubTab] = useState('view-users');
  const user = useSelector(selectAccount);
  const theme = useSelector(selectTheme);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';
//   const isAdmin = true;  

  useEffect(() => {
    if (!isAdmin) {
      // Redirect to dashboard if not admin
      window.location.href = '/dashboard';
    }
  }, [isAdmin]);

  const tabs = [
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      subTabs: [
        { id: 'view-users', label: 'View Users', icon: Users },
        { id: 'user-activity', label: 'Monitor Activity', icon: Activity },
        { id: 'verify-email', label: 'Verify Email', icon: UserCheck },
      ]
    },
    {
      id: 'credits',
      label: 'Credit Management',
      icon: CreditCard,
      subTabs: [
        { id: 'view-credits', label: 'View Credits', icon: Database },
        { id: 'manage-credits', label: 'Add/Deduct Credits', icon: CreditCard },
      ]
    },
    {
      id: 'analytics',
      label: 'Analytics & Monitoring',
      icon: BarChart3,
      subTabs: [
        { id: 'user-trends', label: 'User Trends', icon: TrendingUp },
        { id: 'workflow-trends', label: 'Workflow Trends', icon: BarChart3 },
        { id: 'credit-usage', label: 'Credit Usage', icon: CreditCard },
      ]
    }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const selectedTab = tabs.find(tab => tab.id === tabId);
    if (selectedTab && selectedTab.subTabs.length > 0) {
      setActiveSubTab(selectedTab.subTabs[0].id);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement activeSubTab={activeSubTab} />;
      case 'credits':
        return <CreditManagement activeSubTab={activeSubTab} />;
      case 'analytics':
        return <Analytics activeSubTab={activeSubTab} />;
      default:
        return <UserManagement activeSubTab={activeSubTab} />;
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Access Denied</h2>
          <p className="text-[var(--text-secondary)]">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-[var(--accent-color)]" />
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">Admin Panel</h1>
          </div>
          <p className="text-[var(--text-secondary)]">
            Manage users, credits, and monitor system analytics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Navigation</h3>
              
              {/* Main Tabs */}
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <div key={tab.id}>
                      <button
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          isActive
                            ? 'bg-[var(--accent-color)] text-white shadow-md'
                            : 'text-[var(--text-primary)] hover:bg-[var(--highlight-color)]'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                      
                      {/* Sub Tabs */}
                      {isActive && tab.subTabs && (
                        <div className="mt-2 ml-4 space-y-1">
                          {tab.subTabs.map((subTab) => {
                            const SubIcon = subTab.icon;
                            const isSubActive = activeSubTab === subTab.id;
                            
                            return (
                              <button
                                key={subTab.id}
                                onClick={() => setActiveSubTab(subTab.id)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                                  isSubActive
                                    ? 'bg-[var(--accent-color)]/20 text-[var(--accent-color)] border-l-2 border-[var(--accent-color)]'
                                    : 'text-[var(--text-secondary)] hover:bg-[var(--highlight-color)]'
                                }`}
                              >
                                <SubIcon className="w-4 h-4" />
                                <span>{subTab.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-sm min-h-[600px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;