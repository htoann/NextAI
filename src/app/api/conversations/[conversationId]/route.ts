import Conversation from '@/lib/api-models/Conversation';
import Message from '@/lib/api-models/Message';
import { connectMongoDB } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest, { params }: { params: Promise<{ conversationId: string }> }) => {
  const { conversationId } = await params;

  await connectMongoDB();

  switch (req.method) {
    case 'PUT':
      try {
        const { title } = await req.json();
        const updatedConversation = await Conversation.findByIdAndUpdate(conversationId, { title }, { new: true });
        if (!updatedConversation) {
          return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }
        return NextResponse.json(updatedConversation);
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update conversation' }, { status: 500 });
      }

    case 'DELETE':
      try {
        if (!conversationId) {
          return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
        }

        const deletedConversation = await Conversation.findByIdAndDelete(conversationId);
        if (!deletedConversation) {
          return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        await Message.deleteMany({ conversationId });

        return NextResponse.json({ message: 'Conversation and associated messages deleted' });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete conversation and messages' }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
};

export { handler as DELETE, handler as PUT };
