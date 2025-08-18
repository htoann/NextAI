import { dbConnect } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { availableSeats, generateAIAnswer, processBookingApi, saveMessage } from './utils';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const { message } = await req.json();
    const { conversation: conversationId, content } = message;

    await saveMessage('User', content, conversationId);

    let finalAnswer = await generateAIAnswer(conversationId, content, availableSeats);
    if (finalAnswer.startsWith('#BOOKING:'))
      finalAnswer = (await processBookingApi(finalAnswer, conversationId)) || finalAnswer;

    await saveMessage('AI', finalAnswer, conversationId);

    return new NextResponse(finalAnswer, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse('Failed to generate response. Please try again later', {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
