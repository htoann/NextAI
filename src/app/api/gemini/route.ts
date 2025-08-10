import Message from '@/lib/api-models/Message';
import { booking } from '@/lib/services/booking';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from './utils';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { message } = await req.json();

  try {
    const fullPrompt = `${SYSTEM_PROMPT}\nUser: ${message.content}`;
    const result = await model.generateContentStream(fullPrompt);

    const responseText: string[] = [];

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            responseText.push(chunkText);
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();

          const aiText = responseText.join('');

          saveAIMessage(aiText, message.conversation);

          // processBookingApi(aiText);
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate response' }), {
      status: 500,
    });
  }
};

const processBookingApi = (aiText: string) => {
  if (!aiText.startsWith('#BOOKING:')) return;

  try {
    const bookingData = JSON.parse(aiText.replace('#BOOK:', '').trim());
    console.log('Start to booking', bookingData);
    booking(bookingData);
  } catch (error) {
    console.log(error);
  }
};

const saveAIMessage = async (aiText: string, conversation: string) => {
  await new Message({
    owner: 'AI',
    content: aiText,
    conversation,
  }).save();
};
