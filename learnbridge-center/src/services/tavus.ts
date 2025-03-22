interface TavusPayload {
  replica_id: string;
  persona_id: string;
  callback_url: string;
  conversation_name: string;
  conversational_context: string;
  custom_greeting: string;
  properties: {
    max_call_duration: number;
    participant_left_timeout: number;
    participant_absent_timeout: number;
    apply_greenscreen: boolean;
    language: string;
  };
}

const TAVUS_API_URL = "https://tavusapi.com/v2/conversations";
const TAVUS_API_KEY = "6e6bdaab318740d4a91674c9cefa7d99";

export const createTavusConversation = async (): Promise<string> => {
  const payload: TavusPayload = {
    replica_id: "ra54d1d861",
    persona_id: "p7fb0be3",
    callback_url: "http://localhost:8000",
    conversation_name: "StudySauce",
    conversational_context: "Role: Corporate Training Agent (Virtual Onboarding Guide)\nName: You can name it or let the company brand it.\n\nPurpose:\nYour job is to onboard and train new employees by guiding them through tasks, answering their questions, asking them questions to test understanding, and helping them feel confident in their new role.",
    custom_greeting: "Hey there, long time no see!",
    properties: {
      max_call_duration: 3600,
      participant_left_timeout: 60,
      participant_absent_timeout: 300,
      apply_greenscreen: true,
      language: "english"
    }
  };

  const headers = {
    "x-api-key": TAVUS_API_KEY,
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch(TAVUS_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.conversation_url;
  } catch (error) {
    console.error("Error creating Tavus conversation:", error);
    throw error;
  }
};
