export class TokenManager {
  static isTokenExpired(expiresAt) {
    return new Date().getTime() >= expiresAt;
  }
  
  static async refreshGmailToken(refreshToken, clientId, clientSecret) {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error_description || 'Token refresh failed');
      }
      
      return {
        access_token: data.access_token,
        expires_at: new Date().getTime() + (data.expires_in * 1000),
        token_type: data.token_type || 'Bearer'
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
  
  static async validateAndRefreshToken(nodeConnection) {
    const { credentials } = nodeConnection;
    
    if (!credentials || !credentials.access_token) {
      throw new Error('No access token found');
    }
    
    // Check if token is expired
    if (this.isTokenExpired(credentials.expires_at)) {
      if (!credentials.refresh_token) {
        throw new Error('Token expired and no refresh token available');
      }
      
      // Refresh the token
      const newTokenData = await this.refreshGmailToken(
        credentials.refresh_token,
        credentials.client_id,
        import.meta.env.VITE_GOOGLE_CLIENT_SECRET
      );
      
      // Update the credentials
      return {
        ...nodeConnection,
        credentials: {
          ...credentials,
          access_token: newTokenData.access_token,
          expires_at: newTokenData.expires_at,
          token_type: newTokenData.token_type
        },
        execution_context: {
          ...nodeConnection.execution_context,
          auth_header: `${newTokenData.token_type} ${newTokenData.access_token}`
        }
      };
    }
    
    return nodeConnection; // Token is still valid
  }
}