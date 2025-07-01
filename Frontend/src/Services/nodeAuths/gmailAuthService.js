// export class GmailAuthService {
//   constructor() {
//     this.CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
//     this.API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
//     this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest';
//     this.SCOPES = [
//       'https://www.googleapis.com/auth/gmail.readonly',
//       'https://www.googleapis.com/auth/gmail.send',
//       'https://www.googleapis.com/auth/gmail.compose',
//       'https://www.googleapis.com/auth/gmail.modify'
//     ];
//     this.gapi = null;
//     this.tokenClient = null;
//   }

//   async initializeGapi() {
//     try {
//       await new Promise((resolve) => {
//         if (window.gapi) {
//           resolve();
//         } else {
//           const script = document.createElement('script');
//           script.src = 'https://apis.google.com/js/api.js';
//           script.onload = resolve;
//           document.head.appendChild(script);
//         }
//       });

//       await window.gapi.load('client', async () => {
//         await window.gapi.client.init({
//           apiKey: this.API_KEY,
//           discoveryDocs: [this.DISCOVERY_DOC],
//         });
//       });

//       // Load Google Identity Services
//       await new Promise((resolve) => {
//         if (window.google) {
//           resolve();
//         } else {
//           const script = document.createElement('script');
//           script.src = 'https://accounts.google.com/gsi/client';
//           script.onload = resolve;
//           document.head.appendChild(script);
//         }
//       });

//       this.tokenClient = window.google.accounts.oauth2.initTokenClient({
//         client_id: this.CLIENT_ID,
//         scope: this.SCOPES.join(' '),
//         callback: '', // Will be set later
//         access_type: 'offline',
//         prompt: 'consent',
//         approval_prompt: 'consent',
//         include_granted_scopes: true
//       });

//       this.gapi = window.gapi;
//       return true;
//     } catch (error) {
//       console.error('Error initializing Gmail API:', error);
//       return false;
//     }
//   }

//   async authenticateUser() {
//     return new Promise((resolve, reject) => {
//       if (!this.tokenClient) {
//         reject(new Error('Gmail API not initialized'));
//         return;
//       }

//       this.tokenClient.callback = async (resp) => {
//         if (resp.error !== undefined) {
//           reject(resp);
//           return;
//         }

//         try {
//           // Get user profile info
//           const profile = await this.getUserProfile();
//           const expiresAt = new Date().getTime() + (resp.expires_in * 1000);
          
//           const authData = {
//             // Essential tokens and credentials for execution
//             access_token: resp.access_token,
//             refresh_token: resp.refresh_token || null, // May not be available in implicit flow
//             token_type: resp.token_type || 'Bearer',
//             expires_in: resp.expires_in,
//             expires_at: expiresAt,
//             scope: resp.scope,
            
//             // Google API specific data
//             client_id: this.CLIENT_ID,
//             api_key: this.API_KEY,
            
//             // User information
//             user_email: profile.emailAddress,
//             user_name: profile.emailAddress.split('@')[0],
//             user_id: profile.emailAddress, // Gmail uses email as ID
            
//             // Metadata
//             authenticated_at: new Date().toISOString(),
//             permissions: this.getPermissionsFromScope(resp.scope),
            
//             // Service identification
//             service: 'gmail',
//             provider: 'google'
//           };
//           resolve(authData);
//         } catch (error) {
//           reject(error);
//         }
//       };

//       this.tokenClient.requestAccessToken();
//     });
//   }

//   async getUserProfile() {
//     const response = await this.gapi.client.gmail.users.getProfile({
//       userId: 'me'
//     });
//     return response.result;
//   }

//   getPermissionsFromScope(scope) {
//     const permissions = [];
//     if (scope.includes('gmail.readonly')) permissions.push('fetch_emails');
//     if (scope.includes('gmail.send')) permissions.push('send_email');
//     if (scope.includes('gmail.compose')) permissions.push('create_draft');
//     if (scope.includes('gmail.modify')) permissions.push('delete_message', 'reply_message');
//     return permissions;
//   }

//   isAuthenticated() {
//     const token = localStorage.getItem('gmail_access_token');
//     const expiresAt = localStorage.getItem('gmail_token_expires_at');
    
//     if (!token || !expiresAt) return false;
    
//     return new Date().getTime() < parseInt(expiresAt);
//   }

//   saveAuthData(authData) {
//     localStorage.setItem('gmail_access_token', authData.access_token);
//     localStorage.setItem('gmail_token_expires_at', 
//       (new Date().getTime() + (authData.expires_in * 1000)).toString());
//     localStorage.setItem('gmail_user_data', JSON.stringify({
//       email: authData.user_email,
//       name: authData.user_name,
//       permissions: authData.permissions
//     }));
//   }

//   getStoredAuthData() {
//     const userData = localStorage.getItem('gmail_user_data');
//     return userData ? JSON.parse(userData) : null;
//   }

//   clearAuthData() {
//     localStorage.removeItem('gmail_access_token');
//     localStorage.removeItem('gmail_token_expires_at');
//     localStorage.removeItem('gmail_user_data');
//   }
// }


export class GmailAuthService {
  constructor() {
    this.CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
    this.REDIRECT_URI = `${window.location.origin}/create`;
    this.SCOPES = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.modify'
    ];
  }

  async initiateAuthFlow(nodeId, workflowState) {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    const state = Math.random().toString(36).substring(2, 15);
    
    // Save everything needed for restoration
    const authContext = {
      state: state,
      nodeId: nodeId,
      timestamp: Date.now(),
      workflowState: workflowState
    };
    
    localStorage.setItem('oauth_context', JSON.stringify(authContext));
    
    authUrl.searchParams.set('client_id', this.CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', this.REDIRECT_URI);
    authUrl.searchParams.set('scope', this.SCOPES.join(' '));
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('include_granted_scopes', 'true');

    console.log('🚀 Redirecting to Google OAuth...');
    window.location.href = authUrl.toString();
  }

  async processOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');
    
    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }
    
    if (!code) {
      return null; // No OAuth params
    }
    
    const savedContext = localStorage.getItem('oauth_context');
    if (!savedContext) {
      throw new Error('OAuth context not found');
    }
    
    const authContext = JSON.parse(savedContext);
    
    if (state !== authContext.state) {
      throw new Error('Invalid OAuth state');
    }
    
    console.log('✅ Processing OAuth callback...');
    
    const tokens = await this.exchangeCodeForTokens(code);
    const profile = await this.getUserProfile(tokens.access_token);
    
    const authData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_type: tokens.token_type || 'Bearer',
      expires_in: tokens.expires_in,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      scope: tokens.scope,
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      user_email: profile.emailAddress,
      user_name: profile.emailAddress.split('@')[0],
      user_id: profile.emailAddress,
      authenticated_at: new Date().toISOString(),
      permissions: this.getPermissionsFromScope(tokens.scope),
      service: 'gmail',
      provider: 'google'
    };
    
    this.saveAuthData(authData);
    localStorage.removeItem('oauth_context');
    window.history.replaceState({}, document.title, '/create');
    
    return { authData, workflowContext: authContext };
  }

  async exchangeCodeForTokens(code) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.REDIRECT_URI,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`);
    }

    return response.json();
  }

  async getUserProfile(accessToken) {
    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }
    
    return response.json();
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
    return token && expiresAt && Date.now() < parseInt(expiresAt);
  }

  saveAuthData(authData) {
    localStorage.setItem('gmail_access_token', authData.access_token);
    localStorage.setItem('gmail_refresh_token', authData.refresh_token);
    localStorage.setItem('gmail_token_expires_at', authData.expires_at.toString());
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
    localStorage.removeItem('gmail_refresh_token');
    localStorage.removeItem('gmail_token_expires_at');
    localStorage.removeItem('gmail_user_data');
    localStorage.removeItem('oauth_context');
  }
}