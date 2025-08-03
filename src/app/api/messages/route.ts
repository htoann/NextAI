import Message from '@/lib/api-models/Message';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { message } = await req.json();
    const newMessage = new Message(message);
    await newMessage.save();
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
};
