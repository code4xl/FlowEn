import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Edit, 
  Eye,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  CreditCard,
  Activity,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download
} from 'lucide-react';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  manuallyVerifyEmail, 
  getUserActivity 
} from '../../../../Services/Repository/AccountRepo';

const UserManagement = ({ activeSubTab }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [userActivity, setUserActivity] = useState(null);
  const [emailToVerify, setEmailToVerify] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeSubTab === 'view-users') {
      fetchAllUsers();
    }
  }, [activeSubTab]);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const userData = await getAllUsers();
      setUsers(userData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserActivity = async (userId) => {
    try {
      const activity = await getUserActivity(userId);
      setUserActivity(activity);
      setShowActivityModal(true);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  const handleVerifyEmail = async () => {
    if (!emailToVerify.trim()) return;
    
    try {
      await manuallyVerifyEmail(emailToVerify);
      setEmailToVerify('');
      fetchAllUsers(); // Refresh the list
    } catch (error) {
      console.error('Error verifying email:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'active') return matchesSearch && user.is_active;
    if (filterStatus === 'inactive') return matchesSearch && !user.is_active;
    
    return matchesSearch;
  });

  const renderViewUsers = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">User Management</h2>
          <p className="text-[var(--text-secondary)]">View and manage all registered users</p>
        </div>
        <button
          onClick={fetchAllUsers}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-[var(--border-color)] rounded-lg overflow-hidden">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              <th className="px-4 py-3 text-left text-[var(--text-primary)] font-semibold">User</th>
              <th className="px-4 py-3 text-left text-[var(--text-primary)] font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-[var(--text-primary)] font-semibold">Credits</th>
              <th className="px-4 py-3 text-left text-[var(--text-primary)] font-semibold">Joined</th>
              <th className="px-4 py-3 text-center text-[var(--text-primary)] font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  No users found matching your criteria
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.u_id} className="border-t border-[var(--border-color)] hover:bg-[var(--highlight-color)]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{user.name || 'Unknown User'}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-[var(--text-primary)]">{user.credits || 0}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[var(--text-secondary)]">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => fetchUserActivity(user.u_id)}
                        className="p-1 text-[var(--text-secondary)] hover:text-[var(--accent-color)] transition-colors"
                        title="View Activity"
                      >
                        <Activity className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUserActivity = () => (
    <div className="p-6">
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-[var(--accent-color)] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">User Activity Monitor</h2>
        <p className="text-[var(--text-secondary)] mb-6">
          Click on any user's activity icon in the User Management section to view their detailed activity.
        </p>
        <button
          onClick={() => setActiveSubTab('view-users')}
          className="px-6 py-3 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] transition-colors"
        >
          Go to User Management
        </button>
      </div>
    </div>
  );

  const renderVerifyEmail = () => (
    <div className="p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Mail className="w-16 h-16 text-[var(--accent-color)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Verify Email</h2>
          <p className="text-[var(--text-secondary)]">
            Manually verify a user's email address
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={emailToVerify}
              onChange={(e) => setEmailToVerify(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            />
          </div>
          <button
            onClick={handleVerifyEmail}
            disabled={!emailToVerify.trim()}
            className="w-full px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Email
          </button>
        </div>
      </div>
    </div>
  );

  // User Details Modal
  const UserModal = () => {
    if (!showUserModal || !selectedUser) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--card-bg)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">User Details</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-white text-2xl font-bold">
                {selectedUser.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-[var(--text-primary)]">{selectedUser.name}</h4>
                <p className="text-[var(--text-secondary)]">{selectedUser.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[var(--accent-color)]" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Credits</p>
                  <p className="font-semibold text-[var(--text-primary)]">{selectedUser.credits || 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[var(--accent-color)]" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Joined</p>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              {selectedUser.occupation && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-[var(--accent-color)]" />
                  <div>
                    <p className="text-sm text-[var(--text-secondary)]">Occupation</p>
                    <p className="font-semibold text-[var(--text-primary)]">{selectedUser.occupation}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-[var(--accent-color)]" />
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">Status</p>
                  <p className={`font-semibold ${selectedUser.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedUser.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Activity Modal
  const ActivityModal = () => {
    if (!showActivityModal || !userActivity) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[var(--card-bg)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">User Activity</h3>
              <button
                onClick={() => setShowActivityModal(false)}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                ×
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <p className="text-2xl font-bold text-[var(--accent-color)]">{userActivity.created_workflows_count || 0}</p>
                <p className="text-sm text-[var(--text-secondary)]">Workflows Created</p>
              </div>
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg">
                <p className="text-2xl font-bold text-[var(--accent-color)]">{userActivity.executed_workflows_count || 0}</p>
                <p className="text-sm text-[var(--text-secondary)]">Workflows Executed</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Last Login</p>
                <p className="font-semibold text-[var(--text-primary)]">
                  {userActivity.last_login_at ? new Date(userActivity.last_login_at).toLocaleString() : 'Never'}
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Total Triggers Run</p>
                <p className="font-semibold text-[var(--text-primary)]">{userActivity.total_triggers_run || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSubTab) {
      case 'view-users':
        return renderViewUsers();
      case 'user-activity':
        return renderUserActivity();
      case 'verify-email':
        return renderVerifyEmail();
      default:
        return renderViewUsers();
    }
  };

  return (
    <>
      {renderContent()}
      <UserModal />
      <ActivityModal />
    </>
  );
};

export default UserManagement;