import { NextRequest, NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Message from '@/lib/api-models/Message';
import Conversation from '@/lib/api-models/Conversation';

export const GET = async (req: NextRequest, { params }: { params: { conversationId: string } }) => {
  await connect();

  const { conversationId } = await params;

  if (!conversationId) {
    return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
  }

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    const messages = await Message.find({ conversation: conversationId });

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch conversation messages' }, { status: 500 });
  }
};
