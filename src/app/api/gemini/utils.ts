import Message from '@/lib/api-models/Message';
import { booking } from '@/lib/services/booking';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const DATETIME_FORMAT = 'HH:mm | dd/MM/yyyy';

export const SYSTEM_PROMPT = (
  conversationHistory: string,
  newUserMessage: string,
  optionalContext: { [key: string]: any } = {},
) => {
  const contextLines = Object.entries(optionalContext)
    .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
    .join('\n');

  return `
You are a professional AI assistant for booking and conversation. Follow these instructions:

---

**Booking Mode:**
- Detect booking intent, even if expressed naturally (e.g., "I want to book seat A1, A2 at 17:00 on 8/2/2025").
- Extract:
  - seatIds: array of strings (e.g., ["A1", "A2"])
  - showtimeId: string in format "${DATETIME_FORMAT}"
- Normalize all dates/times to "${DATETIME_FORMAT}".

**If all details are present:**
- Do not book immediately.
- Confirm by repeating details and asking: “Do you want me to proceed with booking seat(s) A1, A2 for 17:00 on 02/08/2025?”
- If user confirms (e.g., "yes", "ok", "confirm", "book it", "go ahead"), respond ONLY:
  #BOOKING: {"seatIds":["A1","A2"],"showtimeId":"17:00 | 02/08/2025"}
- If user does not confirm, cancel booking and assist further.

**If details are missing:**
- Ask only for missing info, keep it short and friendly.
- If giving an example, include the format: “What is the showtime? For example: 17:00 | 02/08/2025”
- If user replies with confirmation words after an example, use the example value.

**Booking errors:**
- If booking fails and you receive a technical error, never repeat technical messages directly.
- Translate errors into short, polite, user-friendly explanations.
- Avoid system terms (e.g., "locked", "invalid seat", database codes).
- Suggest a simple next step (e.g., choose different seats).
- Keep tone positive and helpful.

---

**General Conversation:**
- If not booking-related, respond normally and politely.
- Never output "#BOOKING" unless all booking details are present AND confirmed.

---

**Rules:**
- Do not prefix responses with “AI:” or “User:”
- Always normalize dates/times to "${DATETIME_FORMAT}".
- Use context from previous turns in the same conversation.
- Be concise, friendly, and professional.

${contextLines ? `\n---\n${contextLines}\n` : ''}

---
Conversation history:
${conversationHistory}

New message from user:
User: ${newUserMessage}
AI:
`;
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

export const buildPromptWithContext = async (
  conversationId: string,
  newUserMessage: string,
  optionalContext?: { [key: string]: any },
) => {
  const history = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).lean();
  const conversationHistory = history.map((msg) => `${msg.owner === 'AI' ? 'AI' : 'User'}: ${msg.content}`).join('\n');

  console.log(SYSTEM_PROMPT(conversationHistory, newUserMessage, optionalContext));
  return SYSTEM_PROMPT(conversationHistory, newUserMessage, optionalContext);
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
    console.log('Start to booking', bookingData);

    await booking(bookingData);

    return generateAIAnswer(
      conversationId,
      'The booking was successful. Please confirm to the user in a short, friendly, and professional way.',
    );
  } catch (error) {
    console.error(error);

    return generateAIAnswer(
      conversationId,
      'The booking attempt failed due to a system error. Please respond politely and professionally without exposing technical details.',
    );
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
