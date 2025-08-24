import Message from '@/lib/api-models/Message';
import { booking } from '@/lib/services/booking';
import { generateAIText } from './generate';
import { failedBookingPrompt, successfulBookingPrompt } from './prompts/bookingPrompt';

export const getConversationHistory = async (conversationId: string) => {
  const history = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).lean();
  return history.map((msg) => `${msg.owner === 'AI' ? 'AI' : 'User'}: ${msg.content}`).join('\n');
};

export const saveMessage = async (owner: 'User' | 'AI', content: string, conversation: string, optional?: any) => {
  return await new Message({ owner, content, conversation, ...optional }).save();
};

export const processBookingApi = async (aiText: string, conversationId: string) => {
  try {
    const bookingData = JSON.parse(aiText.replace('#BOOKING:', '').trim());
    await booking(bookingData);
    return generateAIText(conversationId, successfulBookingPrompt);
  } catch (error) {
    console.error(error);
    return generateAIText(conversationId, failedBookingPrompt);
  }
};
