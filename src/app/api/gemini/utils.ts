import { getConversationHistory } from './conversation';
import { buildBookingPrompt } from './prompts/bookingPrompt';

export const buildPromptWithContext = async (
  conversationId: string,
  newUserMessage: string,
  optionalContext?: { [key: string]: any },
) => {
  const conversationHistory = await getConversationHistory(conversationId);
  return buildBookingPrompt(conversationHistory, newUserMessage, optionalContext);
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
