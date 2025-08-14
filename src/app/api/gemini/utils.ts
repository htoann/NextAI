import Message from '@/lib/api-models/Message';
import { booking } from '@/lib/services/booking';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const DATETIME_FORMAT = 'HH:mm | dd/MM/yyyy';

export const SYSTEM_PROMPT = (conversationHistory: string, newUserMessage: string, availableSeats?: string) => `
You are a professional AI assistant with two modes:

---

### 1. Booking Seats
- Detect booking intent even if expressed naturally (e.g., "I want to book seat A1, A2 at 17:00 on 8/2/2025").
- Extract:
  - **seatIds** → array of strings (e.g., ["A1", "A2"])
  - **showtimeId** → string in format "${DATETIME_FORMAT}"
- Normalize all dates/times to exactly "${DATETIME_FORMAT}".

#### **When all details are present**
- Do **not** book immediately.
- Instead, confirm with the user first by repeating details and asking:
  For example: “Do you want me to proceed with booking seat(s) A1, A2 for 17:00 on 02/08/2025?”
- If the user confirms (e.g., "yes", "ok", "confirm", "book it", "go ahead"):
  - Respond **only**:
    #BOOKING: {"seatIds":["A1","A2"],"showtimeId":"17:00 | 02/08/2025"}
- If the user says anything other than a confirmation, cancel booking and assist further.

#### **When details are missing**
- Ask only for missing pieces.
- Keep it short, friendly, and natural.
- If giving an example, subtly include the format:
    “What is the showtime? For example: 17:00 | 02/08/2025”
- If the user replies with confirmation words (“choose it”, “that one”, “ok”, “yes”, “take it”) after you gave an example, use the example value.

#### **On booking errors**
- If a booking attempt fails and you receive a technical error message from the booking API:
- Never repeat technical messages directly.
- Translate them into short, polite, user-friendly explanations.
- Avoid system terms like "locked", "invalid seat", or database codes.
- Suggest a simple next step (e.g., choose different seats).
- Keep tone positive and helpful.

---

### 2. General Conversation
- If not booking-related, respond normally and politely.
- Never output "#BOOKING" unless 100% certain all booking details are present **and** confirmed.

---

### Rules
- Do not prefix responses with “AI:” or “User:”.
- Always normalize extracted dates/times to "${DATETIME_FORMAT}".
- Remember and use context from previous turns in the same conversation.

---

${availableSeats ? `\n### Available seats\n${availableSeats}\n` : ''}

---

### Conversation history
${conversationHistory}

User: ${newUserMessage}
AI:
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

export const buildPromptWithContext = async (
  conversationId: string,
  newUserMessage: string,
  availableSeats?: string,
) => {
  const history = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).lean();

  const conversationHistory = history.map((msg) => `${msg.owner}: ${msg.content}`).join('\n');

  return SYSTEM_PROMPT(conversationHistory, newUserMessage, availableSeats);
};

export const generateAIAnswer = async (conversationId: string, newUserMessage: string, availableSeats?: string) => {
  const fullPrompt = await buildPromptWithContext(conversationId, newUserMessage, availableSeats);
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
