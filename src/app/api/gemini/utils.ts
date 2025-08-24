import Message from '@/lib/api-models/Message';
import { booking } from '@/lib/services/booking';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildBookingPrompt, failedBookingPrompt, successfulBookingPrompt } from './prompts/bookingPrompt';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

export const buildPromptWithContext = async (
  conversationId: string,
  newUserMessage: string,
  optionalContext?: { [key: string]: any },
) => {
  const history = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).lean();
  const conversationHistory = history.map((msg) => `${msg.owner === 'AI' ? 'AI' : 'User'}: ${msg.content}`).join('\n');

  return buildBookingPrompt(conversationHistory, newUserMessage, optionalContext);
};

export const generateAIAnswer = async (
  conversationId: string,
  newUserMessage: string,
  optionalContext?: { [key: string]: any },
) => {
  const fullPrompt = await buildPromptWithContext(conversationId, newUserMessage, optionalContext);
  const result = await model.generateContent(fullPrompt);

  return result.response.text().trim();
};

export const saveMessage = async (owner: 'User' | 'AI', content: string, conversation: string) => {
  await new Message({ owner, content, conversation }).save();
};

export const processBookingApi = async (aiText: string, conversationId: string) => {
  try {
    const bookingData = JSON.parse(aiText.replace('#BOOKING:', '').trim());
    await booking(bookingData);
    return generateAIAnswer(conversationId, successfulBookingPrompt);
  } catch (error) {
    console.error(error);
    return generateAIAnswer(conversationId, failedBookingPrompt);
  }
};

export const availableSeats = `
Rows: A-D, Seats per row: 8.
Showtimes:
02/08/2025 → 14:00, 17:00, 20:00
03/08/2025 → 15:00, 18:00
Initially booked seats:
02/08/2025 14:00 → A1, A2
02/08/2025 17:00 → B1
03/08/2025 15:00 → C3
`;
