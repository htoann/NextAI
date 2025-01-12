import Message from '@/lib/api-models/Message';
import connect from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const handler = async (req: NextRequest) => {
  await connect();

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

export { handler as POST, handler as GET, handler as PUT, handler as DELETE };
