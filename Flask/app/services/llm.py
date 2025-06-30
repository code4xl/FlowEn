import httpx
import os

async def call_llm(node_data, input_data):
    model_provider = node_data.get('modelProvider')
    api_key = node_data.get('apiKey')
    system_prompt = node_data.get('systemPrompt')

    if model_provider == 'OpenAI':
        url = 'https://api.openai.com/v1/chat/completions'
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }

        user_input = '\n'.join([str(x) for x in input_data])  # Merge all inputs
        payload = {
            "model": "gpt-4o",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_input}
            ],
            "temperature": 0.3
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()

            content = result['choices'][0]['message']['content']
            return content

    return "Unsupported LLM provider."
