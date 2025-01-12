import Message from '@/lib/api-models/Message';
import connect from '@/lib/mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  await connect();

  try {
    const result = await model.generateContentStream(message.content);
    const responseText: string[] = [];

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = await chunk.text();
            responseText.push(chunkText);
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();

          new Message({
            owner: 'AI',
            content: responseText.join(''),
            conversation: message.conversation,
          }).save();
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
    return new NextResponse(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
  }
}
