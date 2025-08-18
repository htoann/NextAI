import Conversation from '@/lib/api-models/Conversation';
import Message from '@/lib/api-models/Message';
import { dbConnect } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> },
): Promise<NextResponse> => {
  await dbConnect();

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
