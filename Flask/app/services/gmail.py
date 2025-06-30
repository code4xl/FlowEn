import httpx
from datetime import datetime, timezone

async def fetch_emails(gmail_credentials, input_data):
    access_token = gmail_credentials['credentials']['access_token']
    user_id = gmail_credentials['execution_context']['user_id']
    base_url = gmail_credentials['execution_context']['base_url']
    auth_header = gmail_credentials['execution_context']['auth_header']

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

        return {'emails': emails, 'fetched_at': datetime.now(timezone.utc).isoformat()}
