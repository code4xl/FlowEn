import httpx
from datetime import datetime, timezone
import os
from dotenv import load_dotenv

load_dotenv()

async def refresh_token(credentials):
    """Refresh the access token using refresh token"""
    refresh_url = "https://oauth2.googleapis.com/token"
    
    # You need to add your client_secret here (get it from Google Cloud Console)
    CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")  # Replace with actual secret
    # print(credentials["refresh_token"])
    # print("Client Secret: ", CLIENT_SECRET)
    
    data = {
        "client_id": credentials["client_id"],
        "client_secret": CLIENT_SECRET,
        "refresh_token": credentials["refresh_token"],
        "grant_type": "refresh_token"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(refresh_url, data=data)
        if response.status_code == 200:
            token_data = response.json()
            # print(token_data)
            return token_data["access_token"]
        else:
            raise Exception(f"Token refresh failed: {response.text}")


async def fetch_emails(gmail_credentials, input_data):

    credentials = gmail_credentials['credentials']
    print("inside fetch_mails...")
    try:
        new_access_token = await refresh_token(credentials)
        print(f"New access token: {new_access_token}")
        # Update the auth header with new token
        auth_header = f"Bearer {new_access_token}"
    except Exception as e:
        print(f"Token refresh failed: {e}")
        # Fallback to existing token
        auth_header = gmail_credentials['execution_context']['auth_header']
    
    access_token = gmail_credentials['credentials']['access_token']
    user_id = gmail_credentials['execution_context']['user_id']
    base_url = gmail_credentials['execution_context']['base_url']
    # auth_header = gmail_credentials['execution_context']['auth_header']
    # print(f"Updated access token: {auth_header}")
    # Example: Fetch unread emails from yesterday
    query = 'is:unread newer_than:1d'
    url = f'{base_url}/users/{user_id}/messages?q={query}'

    headers = {
        'Authorization': auth_header,
        'Accept': 'application/json'
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()

        messages = data.get('messages', [])
        print(f"Fetched {len(messages)} messages from Gmail for user {user_id}")

        # Fetch message details
        emails = []
        for message in messages[:10]:  # Limit to 10 emails for now
            message_id = message['id']
            msg_url = f'{base_url}/users/{user_id}/messages/{message_id}'
            msg_response = await client.get(msg_url, headers=headers)
            msg_response.raise_for_status()
            msg_data = msg_response.json()

            snippet = msg_data.get('snippet', '')
            emails.append({'id': message_id, 'snippet': snippet})
        print(f"Fetched {len(emails)} email snippets")
        print(emails)

        return {'emails': emails, 'fetched_at': datetime.now(timezone.utc).isoformat()}
