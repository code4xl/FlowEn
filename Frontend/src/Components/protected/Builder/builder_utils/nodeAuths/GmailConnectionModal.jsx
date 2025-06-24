import React, { useState, useEffect } from 'react';
import { X, Mail, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { GmailAuthService } from '../../../../../services/nodeAuths/gmailAuthService';

const GmailConnectionModal = ({ isOpen, onClose, onSuccess, nodeId }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [authService] = useState(new GmailAuthService());
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [connectedAccount, setConnectedAccount] = useState(null);

  useEffect(() => {
    if (isOpen) {
      initializeService();
      checkExistingConnection();
    }
  }, [isOpen]);

  const initializeService = async () => {
    try {
      const initialized = await authService.initializeGapi();
      setIsInitialized(initialized);
      if (!initialized) {
        setError('Failed to initialize Gmail API');
      }
    } catch (error) {
      setError('Failed to initialize Gmail API');
      console.error(error);
    }
  };

  const checkExistingConnection = () => {
    if (authService.isAuthenticated()) {
      const userData = authService.getStoredAuthData();
      setConnectedAccount(userData);
    }
  };

  const handleConnect = async () => {
    if (!isInitialized) {
      setError('Gmail API not initialized');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const authData = await authService.authenticateUser();
      authService.saveAuthData(authData);
      setConnectedAccount({
        email: authData.user_email,
        name: authData.user_name,
        permissions: authData.permissions
      });

      // THIS IS WHERE THE NODE DATA GETS UPDATED WITH COMPLETE CREDENTIALS
      onSuccess(nodeId, {
        // Service identification
        service: 'gmail',
        provider: 'google',
        connected: true,
        
        // Complete credentials for API execution
        credentials: {
          access_token: authData.access_token,
          refresh_token: authData.refresh_token,
          token_type: authData.token_type,
          client_id: authData.client_id,
          api_key: authData.api_key,
          expires_at: authData.expires_at,
          scope: authData.scope
        },
        
        // User information
        user_email: authData.user_email,
        user_name: authData.user_name,
        user_id: authData.user_id,
        
        // Permissions and metadata
        permissions: authData.permissions,
        connected_at: authData.authenticated_at,
        
        // Execution context for direct API calls
        execution_context: {
          base_url: 'https://gmail.googleapis.com/gmail/v1',
          auth_header: `${authData.token_type} ${authData.access_token}`,
          user_id: 'me'
        }
      });

    } catch (error) {
      console.error('Gmail authentication error:', error);
      setError('Failed to connect to Gmail. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    authService.clearAuthData();
    setConnectedAccount(null);
    onSuccess(nodeId, {
      service: 'gmail',
      provider: 'google',
      connected: false,
      credentials: null,
      user_email: null,
      user_name: null,
      user_id: null,
      permissions: [],
      execution_context: null,
      disconnected_at: new Date().toISOString()
    });
  };

  const permissions = [
    { key: 'fetch_emails', label: 'Read your emails', icon: Mail },
    { key: 'send_email', label: 'Send emails on your behalf', icon: Mail },
    { key: 'create_draft', label: 'Create email drafts', icon: Mail },
    { key: 'delete_message', label: 'Delete emails', icon: Mail },
    { key: 'reply_message', label: 'Reply to emails', icon: Mail }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Mail className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              Connect Gmail
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--highlight-color)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {connectedAccount ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-300">
                  Connected Successfully
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400">
                {connectedAccount.email}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Granted Permissions
              </h3>
              <div className="space-y-1">
                {permissions.map((permission) => (
                  <div
                    key={permission.key}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      connectedAccount.permissions?.includes(permission.key)
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-500'
                    }`}
                  >
                    <permission.icon className="w-4 h-4" />
                    <span className="text-sm">{permission.label}</span>
                    {connectedAccount.permissions?.includes(permission.key) && (
                      <CheckCircle className="w-4 h-4 ml-auto text-green-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--highlight-color)] transition-colors"
              >
                Done
              </button>
              <button
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[var(--text-secondary)] mb-4">
              Connect your Gmail account to enable email automation features.
            </p>

            <div className="space-y-2">
              <h3 className="font-medium text-[var(--text-primary)] flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Required Permissions
              </h3>
              <div className="space-y-1">
                {permissions.map((permission) => (
                  <div key={permission.key} className="flex items-center gap-2 p-2 bg-[var(--bg-secondary)] rounded-lg">
                    <permission.icon className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{permission.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-lg hover:bg-[var(--highlight-color)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                disabled={isConnecting || !isInitialized}
                className="flex-1 px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : (
                  'Connect Gmail'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GmailConnectionModal;