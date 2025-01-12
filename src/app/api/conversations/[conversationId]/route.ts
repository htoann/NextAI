import Conversation from '@/lib/api-models/Conversation';
import connect from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const handler = async (req: NextRequest, { params }: { params: { conversationId: string } }) => {
  await connect();

  const { conversationId } = await params;

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
        const conversationId = req.nextUrl.pathname.split('/').pop();

        if (!conversationId) {
          return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
        }

        const deletedConversation = await Conversation.findByIdAndDelete(conversationId);
        if (!deletedConversation) {
          return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Conversation deleted' });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
};

export { handler as PUT, handler as DELETE };
