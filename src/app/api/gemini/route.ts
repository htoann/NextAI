import { NextRequest, NextResponse } from 'next/server';
import { generateAIAnswer, processBookingApi, saveMessage } from './utils';

export const POST = async (req: NextRequest) => {
  try {
    const { message } = await req.json();
    const { conversation: conversationId, content } = message;

    await saveMessage('User', content, conversationId);

    let finalAnswer = await generateAIAnswer(conversationId, content);
    if (finalAnswer.startsWith('#BOOKING:'))
      finalAnswer = (await processBookingApi(finalAnswer, conversationId)) || finalAnswer;

    await saveMessage('AI', finalAnswer, conversationId);

    return new NextResponse(finalAnswer, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
  }
};
