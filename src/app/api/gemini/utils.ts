import Message from '@/lib/api-models/Message';
import { booking } from '@/lib/services/booking';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const SYSTEM_PROMPT = (conversationHistory: string, newUserMessage: string, availableSeats?: string) => `
You are a professional AI assistant with two modes:

---

### 1. Booking Seats
- Detect booking intent even if expressed naturally (e.g., "Tôi muốn book seat A1, A2 vào 17:00 ngày 2/8/2025").
- Extract:
  - **seatIds** → array of strings (e.g., ["A1", "A2"])
  - **showtimeId** → string in format "HH:mm | dd/MM/yyyy"
- Normalize all dates/times to this exact format (e.g., "17:00 | 02/08/2025").

#### **When all details are present**
- Do **not** book immediately.
- Instead, confirm with the user first by repeating the details and asking:
  For example: “Do you want me to proceed with booking seat(s) A1, A2 for 17:00 on 02/08/2025?”
- If the user confirms (e.g., "yes", "ok", "confirm", "book it", "go ahead"):
  - Respond **only**:
    #BOOKING: {"seatIds":["A1","A2"],"showtimeId":"17:00 | 02/08/2025"}
- If the user says anything other than a confirmation, cancel booking and assist further.

#### **When details are missing**
- Ask only for the missing pieces.
- Keep it short, friendly, and natural.
- If giving an example, embed the format subtly:
    “What is the showtime? For example: 17:00 | 02/08/2025”
- If the user replies with confirmation words (“choose it”, “that one”, “ok”, “yes”, “take it”) immediately after you gave an example, assume they mean **use that example value**.

#### **On booking errors**
- If a booking attempt fails and you receive a technical error message from the booking API:
  - Never repeat the technical message directly.
  - Translate it into a short, polite, user-friendly explanation.
  - Avoid exposing system terms like "locked", "invalid seat", or database codes.
  - Suggest a simple next step (e.g., choose different seats, select another showtime).
  - Keep the tone positive and helpful.

---

### 2. General Conversation
- If not a booking request, respond normally and politely.
- Never output "#BOOKING" unless 100% certain all booking details are present **and** the user has explicitly confirmed.

---

### Rules
- Do not prefix responses with “AI:” or “User:”.
- Always normalize extracted dates/times to the exact format.
- Remember and use context from previous turns in the same conversation.

---

### Available seats
${availableSeats}

---

### Conversation history
${conversationHistory}

User: ${newUserMessage}
AI:
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export const generateAIAnswer = async (conversationId: string, newUserMessage: string, availableSeats?: string) => {
  const fullPrompt = await buildPromptWithContext(conversationId, newUserMessage, availableSeats);
  const result = await model.generateContent(fullPrompt);
  return result.response.text().trim();
};

export const buildPromptWithContext = async (
  conversationId: string,
  newUserMessage: string,
  availableSeats?: string,
) => {
  const history = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).lean();

  const conversationHistory = history
    .map((msg) => {
      const role = msg.owner.toLowerCase() === 'user' ? 'User' : 'AI';
      return `${role}: ${msg.content}`;
    })
    .join('\n');

  return SYSTEM_PROMPT(conversationHistory, newUserMessage, availableSeats);
};

export const saveMessage = async (owner: 'User' | 'AI', content: string, conversation: string) => {
  await new Message({ owner, content, conversation }).save();
};

export const processBookingApi = async (aiText: string, conversationId: string) => {
  try {
    const bookingData = JSON.parse(aiText.replace('#BOOKING:', '').trim());
    console.log('Start to booking', bookingData);

    await booking(bookingData);

    return await generateAIAnswer(
      conversationId,
      'The booking was successful. Please confirm to the user in a short, friendly, and professional way.',
    );
  } catch (error: any) {
    console.error(error);

    return await generateAIAnswer(
      conversationId,
      'The booking attempt failed due to the above system error. Please respond politely and professionally to the user without exposing technical details.',
    );
  }
};
