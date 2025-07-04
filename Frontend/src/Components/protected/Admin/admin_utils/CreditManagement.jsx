import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Minus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  History,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  getAllUsers, 
  updateUserCredits, 
  getUserCredits 
} from '../../../../Services/Repository/AccountRepo';

const CreditManagement = ({ activeSubTab }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [reason, setReason] = useState('');
  const [operationType, setOperationType] = useState('add');
  const [creditStats, setCreditStats] = useState({
    totalUsers: 0,
    totalCredits: 0,
    averageCredits: 0,
    usersWithZeroCredits: 0
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    setLoading(true);
    try {
      const userData = await getAllUsers();
      setUsers(userData || []);
      calculateCreditStats(userData || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCreditStats = (userData) => {
    const totalUsers = userData.length;
    const totalCredits = userData.reduce((sum, user) => sum + (user.credits || 0), 0);
    const averageCredits = totalUsers > 0 ? Math.round(totalCredits / totalUsers) : 0;
    const usersWithZeroCredits = userData.filter(user => (user.credits || 0) === 0).length;

    setCreditStats({
      totalUsers,
      totalCredits,
      averageCredits,
      usersWithZeroCredits
    });
  };

  const handleCreditUpdate = async (e) => {
    e.preventDefault();
    if (!selectedUser || !creditAmount || !reason) {
      return;
    }

    const amount = operationType === 'add' ? parseInt(creditAmount) : -parseInt(creditAmount);
    
    try {
      await updateUserCredits(selectedUser, amount, reason);
      // Reset form
      setSelectedUser('');
      setCreditAmount('');
      setReason('');
      // Refresh user list
      fetchAllUsers();
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderViewCredits = () => (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Credit Overview</h2>
          <p className="text-[var(--text-secondary)]">Monitor credit distribution across all users</p>
        </div>
        <button
          onClick={fetchAllUsers}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{creditStats.totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Credits</p>
              <p className="text-2xl font-bold">{creditStats.totalCredits.toLocaleString()}</p>
            </div>
            <CreditCard className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Average Credits</p>
              <p className="text-2xl font-bold">{creditStats.averageCredits}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Zero Credits</p>
              <p className="text-2xl font-bold">{creditStats.usersWithZeroCredits}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-200" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)] w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
          />
        </div>
      </div>

      {/* Users Credit Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-[var(--border-color)] rounded-lg overflow-hidden">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              <th className="px-4 py-3 text-left text-[var(--text-primary)] font-semibold">User</th>
              <th className="px-4 py-3 text-left text-[var(--text-primary)] font-semibold">Credits</th>
              <th className="px-4 py-3 text-left text-[var(--text-primary)] font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-[var(--text-primary)] font-semibold">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading users...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  No users found
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
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${
                        (user.credits || 0) === 0 ? 'text-red-600' : 
                        (user.credits || 0) < 50 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {user.credits || 0}
                      </span>
                      {(user.credits || 0) === 0 && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      (user.credits || 0) === 0 ? 'bg-red-100 text-red-800' :
                      (user.credits || 0) < 50 ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {(user.credits || 0) === 0 ? 'No Credits' :
                       (user.credits || 0) < 50 ? 'Low Credits' : 'Good'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[var(--text-secondary)]">
                      {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderManageCredits = () => (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <CreditCard className="w-16 h-16 text-[var(--accent-color)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Manage Credits</h2>
          <p className="text-[var(--text-secondary)]">Add or deduct credits for users</p>
        </div>

        {/* Credit Management Form */}
        <form onSubmit={handleCreditUpdate} className="space-y-6">
          {/* Operation Type */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Operation
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="add"
                  checked={operationType === 'add'}
                  onChange={(e) => setOperationType(e.target.value)}
                  className="mr-2"
                />
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <Plus className="w-4 h-4 text-green-600" />
                  Add Credits
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="deduct"
                  checked={operationType === 'deduct'}
                  onChange={(e) => setOperationType(e.target.value)}
                  className="mr-2"
                />
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <Minus className="w-4 h-4 text-red-600" />
                  Deduct Credits
                </span>
              </label>
            </div>
          </div>

          {/* User Selection */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Select User
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              required
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.u_id} value={user.u_id}>
                  {user.name} ({user.email}) - Current: {user.credits || 0} credits
                </option>
              ))}
            </select>
          </div>

          {/* Credit Amount */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Credit Amount
            </label>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              required
            >
              <option value="">Select reason...</option>
              <option value="Admin adjustment">Admin adjustment</option>
              <option value="Bonus credits">Bonus credits</option>
              <option value="Refund">Refund</option>
              <option value="Penalty">Penalty</option>
              <option value="Promotional credits">Promotional credits</option>
              <option value="Manual correction">Manual correction</option>
              <option value="Customer support">Customer support</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full px-4 py-3 text-white font-medium rounded-lg transition-colors ${
              operationType === 'add'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {operationType === 'add' ? (
              <>
                <Plus className="w-4 h-4 inline mr-2" />
                Add {creditAmount || 0} Credits
              </>
            ) : (
              <>
                <Minus className="w-4 h-4 inline mr-2" />
                Deduct {creditAmount || 0} Credits
              </>
            )}
          </button>
        </form>

        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setOperationType('add');
                setCreditAmount('100');
                setReason('Bonus credits');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add 100 Bonus Credits
            </button>
            <button
              onClick={() => {
                setOperationType('add');
                setCreditAmount('50');
                setReason('Promotional credits');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add 50 Promo Credits
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSubTab) {
      case 'view-credits':
        return renderViewCredits();
      case 'manage-credits':
        return renderManageCredits();
      default:
        return renderViewCredits();
    }
  };

  return renderContent();
};

export default CreditManagement;