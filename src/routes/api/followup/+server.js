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
  temperature: 0.5,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

// Prompt
function prompt(expert, exname, speciality, topic, outreach, keywords, email, phone, date, interest) {
  const parts = [
    {text: `A concise and semi-formal follow-up email to a ${expert}, named ${exname}, in the field of ${speciality} to set up an interview. Following your initial outreach on ${date} about your high school design project on ${topic}. Avoid repeating yourself by keeping in mind your original outreach email: ${outreach}. Use your reason of interest in this design project: ${interest}, and project keywords: ${keywords}, to generate a meeting request with the following information: ${email}, ${phone}. Keep the email to a 150 word count limit.`}
  ];
  return(parts)
}

export async function GET({ url }) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const expert = url.searchParams.get('expert'),
        exname = url.searchParams.get('exname'),
        topic = url.searchParams.get('topic'),
        speciality = url.searchParams.get('speciality'),
        outreach = url.searchParams.get('outreach'),
        keywords = url.searchParams.get('keywords'),
        email = url.searchParams.get('email'),
        phone = url.searchParams.get('phone'),
        date = url.searchParams.get('date'),
        interest = url.searchParams.get('interest');
  let parts = prompt(expert, exname, speciality, outreach, keywords, topic, email, phone, date, interest)
  
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  let response = result.response.text();

  return json(response)
}