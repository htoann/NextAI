import Message from '@/lib/api-models/Message';
import { NextRequest, NextResponse } from 'next/server';

const handler = async (req: NextRequest) => {
  switch (req.method) {
    case 'POST':
      try {
        const { message } = await req.json();
        const newMessage = new Message(message);
        await newMessage.save();
        return NextResponse.json(newMessage, { status: 201 });
      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
      }

    default:
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
};

export { handler as DELETE, handler as GET, handler as POST, handler as PUT };
