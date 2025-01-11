import { NextResponse } from 'next/server';
import connect from '../../../lib/mongodb';
import { NextRequest } from 'next/server';
import Message from '../models/Message';

const handler = async (req: NextRequest) => {
  await connect();

  switch (req.method) {
    case 'GET':
      try {
        const messages = await Message.find().populate('owner').populate('conversation');
        return NextResponse.json(messages);
      } catch {
        return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
      }

    case 'POST':
      try {
        const { owner, content, conversation, metadata } = await req.json();
        const newMessage = new Message({
          owner,
          content,
          conversation,
          metadata,
        });
        await newMessage.save();
        return NextResponse.json(newMessage, { status: 201 });
      } catch {
        return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
      }

    case 'PUT':
      try {
        const { id, content, metadata } = await req.json();
        const updatedMessage = await Message.findByIdAndUpdate(id, { content, metadata }, { new: true })
          .populate('owner')
          .populate('conversation');
        if (!updatedMessage) {
          return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json(updatedMessage);
      } catch {
        return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
      }

    case 'DELETE':
      try {
        const { id } = await req.json();
        const deletedMessage = await Message.findByIdAndDelete(id);
        if (!deletedMessage) {
          return NextResponse.json({ error: 'Message not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Message deleted' });
      } catch {
        return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
};

export { handler as POST, handler as GET, handler as PUT, handler as DELETE };
