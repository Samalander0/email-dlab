import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { json } from '@sveltejs/kit';
import { GOOGLE_API_KEY } from '$env/static/private'

const MODEL_NAME = "gemini-pro";
const API_KEY = GOOGLE_API_KEY;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const generationConfig = {
  temperature: 0.69,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Prompt
function prompt(expert, topic, challenge, hmw_1, hmw_2, hmw_3) {
  const parts = [
    {text: `An outreach formal email to ${expert} about their opinion on your high school design project about ${topic}. Generate new questions based on previous questions: ${hmw_1}, ${hmw_2}, and ${hmw_3}. Get optimal information for end-user-centered solutions and center the influence of the email around the main challenge: ${challenge}`}
  ];
  return(parts)
}

export async function GET({ url }) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const expert = url.searchParams.get('expert'),
        topic = url.searchParams.get('topic'),
        challenge = url.searchParams.get('challenge'),
        hmw_1 = url.searchParams.get('hmw_1'),
        hmw_2 = url.searchParams.get('hmw_2'),
        hmw_3 = url.searchParams.get('hmw_3');
  let parts = prompt(expert, topic, challenge, hmw_1, hmw_2, hmw_3)
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  let response = result.response.text();

  return json(response)
}