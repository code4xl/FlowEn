export class GmailExecutor {
  constructor(nodeConnection) {
    this.connection = nodeConnection;
    this.baseUrl = nodeConnection.execution_context.base_url;
    this.authHeader = nodeConnection.execution_context.auth_header;
    this.userId = nodeConnection.execution_context.user_id;
  }
  
  async makeApiCall(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Authorization': this.authHeader,
        'Content-Type': 'application/json'
      }
    };
    
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }
    
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'API call failed');
      }
      
      return data;
    } catch (error) {
      console.error('Gmail API call error:', error);
      throw error;
    }
  }
  
  // Example execution methods
  async fetchEmails(query = '', maxResults = 10) {
    const params = new URLSearchParams({
      q: query,
      maxResults: maxResults.toString()
    });
    
    return this.makeApiCall(`/users/${this.userId}/messages?${params}`);
  }
  
  async sendEmail(to, subject, body) {
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');
    
    const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');
    
    return this.makeApiCall(`/users/${this.userId}/messages/send`, 'POST', {
      raw: encodedEmail
    });
  }
  
  async createDraft(to, subject, body) {
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      '',
      body
    ].join('\n');
    
    const encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_');
    
    return this.makeApiCall(`/users/${this.userId}/drafts`, 'POST', {
      message: {
        raw: encodedEmail
      }
    });
  }
}