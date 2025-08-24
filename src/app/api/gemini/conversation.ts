import Message from '@/lib/api-models/Message';

export const getConversationHistory = async (conversationId: string) => {
  const history = await Message.find({ conversation: conversationId }).sort({ createdAt: 1 }).lean();
  return history.map((msg) => `${msg.owner === 'AI' ? 'AI' : 'User'}: ${msg.content}`).join('\n');
};

export const saveMessage = async (owner: 'User' | 'AI', content: string, conversation: string, optional?: any) => {
  await new Message({ owner, content, conversation, ...optional }).save();
};
