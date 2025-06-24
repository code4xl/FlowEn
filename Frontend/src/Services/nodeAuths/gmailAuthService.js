export class GmailAuthService {
  constructor() {
    this.CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
    this.SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.modify'
    ];
    this.gapi = null;
    this.tokenClient = null;
  }

  async initializeGapi() {
    try {
      await new Promise((resolve) => {
        if (window.gapi) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.src = 'https://apis.google.com/js/api.js';
          script.onload = resolve;
          document.head.appendChild(script);
        }
      });

      await window.gapi.load('client', async () => {
        await window.gapi.client.init({
          apiKey: this.API_KEY,
          discoveryDocs: [this.DISCOVERY_DOC],
        });
      });

      // Load Google Identity Services
      await new Promise((resolve) => {
        if (window.google) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.src = 'https://accounts.google.com/gsi/client';
          script.onload = resolve;
          document.head.appendChild(script);
        }
      });

      this.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: this.CLIENT_ID,
        scope: this.SCOPES.join(' '),
        callback: '', // Will be set later
      });

      this.gapi = window.gapi;
      return true;
    } catch (error) {
      console.error('Error initializing Gmail API:', error);
      return false;
    }
  }

  async authenticateUser() {
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        reject(new Error('Gmail API not initialized'));
        return;
      }

      this.tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
          reject(resp);
          return;
        }

        try {
          // Get user profile info
          const profile = await this.getUserProfile();
          const expiresAt = new Date().getTime() + (resp.expires_in * 1000);
          
          const authData = {
            // Essential tokens and credentials for execution
            access_token: resp.access_token,
            refresh_token: resp.refresh_token || null, // May not be available in implicit flow
            token_type: resp.token_type || 'Bearer',
            expires_in: resp.expires_in,
            expires_at: expiresAt,
            scope: resp.scope,
            
            // Google API specific data
            client_id: this.CLIENT_ID,
            api_key: this.API_KEY,
            
            // User information
            user_email: profile.emailAddress,
            user_name: profile.emailAddress.split('@')[0],
            user_id: profile.emailAddress, // Gmail uses email as ID
            
            // Metadata
            authenticated_at: new Date().toISOString(),
            permissions: this.getPermissionsFromScope(resp.scope),
            
            // Service identification
            service: 'gmail',
            provider: 'google'
          };
          resolve(authData);
        } catch (error) {
          reject(error);
        }
      };

      this.tokenClient.requestAccessToken();
    });
  }

  async getUserProfile() {
    const response = await this.gapi.client.gmail.users.getProfile({
      userId: 'me'
    });
    return response.result;
  }

  getPermissionsFromScope(scope) {
    const permissions = [];
    if (scope.includes('gmail.readonly')) permissions.push('fetch_emails');
    if (scope.includes('gmail.send')) permissions.push('send_email');
    if (scope.includes('gmail.compose')) permissions.push('create_draft');
    if (scope.includes('gmail.modify')) permissions.push('delete_message', 'reply_message');
    return permissions;
  }

  isAuthenticated() {
    const token = localStorage.getItem('gmail_access_token');
    const expiresAt = localStorage.getItem('gmail_token_expires_at');
    
    if (!token || !expiresAt) return false;
    
    return new Date().getTime() < parseInt(expiresAt);
  }

  saveAuthData(authData) {
    localStorage.setItem('gmail_access_token', authData.access_token);
    localStorage.setItem('gmail_token_expires_at', 
      (new Date().getTime() + (authData.expires_in * 1000)).toString());
    localStorage.setItem('gmail_user_data', JSON.stringify({
      email: authData.user_email,
      name: authData.user_name,
      permissions: authData.permissions
    }));
  }

  getStoredAuthData() {
    const userData = localStorage.getItem('gmail_user_data');
    return userData ? JSON.parse(userData) : null;
  }

  clearAuthData() {
    localStorage.removeItem('gmail_access_token');
    localStorage.removeItem('gmail_token_expires_at');
    localStorage.removeItem('gmail_user_data');
  }
}