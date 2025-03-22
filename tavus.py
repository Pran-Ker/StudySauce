import requests

url = "https://tavusapi.com/v2/conversations"

payload = {
    "replica_id": "ra54d1d861",
    "persona_id": "p7fb0be3",
    "callback_url": "http://localhost:8000",
    "conversation_name": "StudySauce",
    "conversational_context": "Role: Corporate Training Agent (Virtual Onboarding Guide)\nName: You can name it or let the company brand it.\n\nPurpose:\nYour job is to onboard and train new employees by guiding them through tasks, answering their questions, asking them questions to test understanding, and helping them feel confident in their new role.",
    "custom_greeting": "Hey there, long time no see!",
    "properties": {
        "max_call_duration": 3600,
        "participant_left_timeout": 60,
        "participant_absent_timeout": 300,
        "apply_greenscreen": True,
        "language": "english"
    }
}
headers = {
    "x-api-key": "6e6bdaab318740d4a91674c9cefa7d99",
    "Content-Type": "application/json"
}

response = requests.request("POST", url, json=payload, headers=headers)
response_data = response.json()

if 'conversation_url' in response_data:
    conversation_url = response_data['conversation_url']
    print(f"Opening conversation URL: {conversation_url}")
    import webbrowser
    webbrowser.open(conversation_url)
else:
    print("No conversation URL found in response")
    print("Full response:", response.text)