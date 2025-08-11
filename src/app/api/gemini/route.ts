import { NextRequest, NextResponse } from 'next/server';
import { generateAIAnswer, processBookingApi, saveMessage } from './utils';

const fakeBookingInfo = `
Rows: A-D, Seats per row: 8.
Showtimes:
02/08/2025 → 14:00, 17:00, 20:00
03/08/2025 → 15:00, 18:00
Initially booked seats:
02/08/2025 14:00 → A1, A2
02/08/2025 17:00 → B1
03/08/2025 15:00 → C3
`;

export const POST = async (req: NextRequest) => {
  try {
    const { message } = await req.json();
    const { conversation: conversationId, content } = message;

    await saveMessage('User', content, conversationId);

    let finalAnswer = await generateAIAnswer(conversationId, content, fakeBookingInfo);
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
