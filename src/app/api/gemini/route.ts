import Message from '@/lib/api-models/Message';
import { booking } from '@/lib/services/booking';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from './utils';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// export const POST = async (req: NextRequest): Promise<NextResponse> => {
//   const { message } = await req.json();

//   try {
//     const fullPrompt = `${SYSTEM_PROMPT}\nUser: ${message.content}`;
//     const result = await model.generateContentStream(fullPrompt);

//     const responseText: string[] = [];

//     const stream = new ReadableStream({
//       async start(controller) {
//         try {
//           for await (const chunk of result.stream) {
//             const chunkText = chunk.text();
//             responseText.push(chunkText);
//             controller.enqueue(new TextEncoder().encode(chunkText));
//           }
//           controller.close();

//           const aiText = responseText.join('');

//           processBookingApi(aiText, message.conversation);
//         } catch (error) {
//           controller.error(error);
//         }
//       },
//     });

//     return new NextResponse(stream, {
//       headers: {
//         'Content-Type': 'text/plain',
//         'Transfer-Encoding': 'chunked',
//       },
//     });
//   } catch (err) {
//     console.error(err);
//     return new NextResponse(JSON.stringify({ error: 'Failed to generate response' }), {
//       status: 500,
//     });
//   }
// };

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { message } = await req.json();

  try {
    const fullPrompt = `${SYSTEM_PROMPT}\nUser: ${message.content}`;
    const result = await model.generateContent(fullPrompt);

    const aiText = result.response.text();
    const bookingAnswer = await processBookingApi(aiText, message.conversation);

    const finalAnswer = bookingAnswer ? bookingAnswer : aiText;

    return new NextResponse(finalAnswer, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate response' }), { status: 500 });
  }
};

const processBookingApi = async (aiText: string, conversation: string) => {
  if (!aiText.startsWith('#BOOKING:')) return;

  try {
    const bookingData = JSON.parse(aiText.replace('#BOOKING:', '').trim());
    console.log('Start to booking', bookingData);

    await booking(bookingData);

    const successMessage = 'Booking success';
    saveAIMessage(successMessage, conversation);

    return successMessage;
  } catch (error: any) {
    console.error(error);

    const errorMessage = error?.message || 'Booking failed';
    saveAIMessage(errorMessage, conversation);

    return errorMessage;
  }
};

const saveAIMessage = async (aiText: string, conversation: string) => {
  await new Message({
    owner: 'AI',
    content: aiText,
    conversation,
  }).save();
};
