import { dbConnect } from '@/lib/dbConnect';
import { NextRequest, NextResponse } from 'next/server';
import { saveMessage } from './conversation';
import { buildRequestTypePrompt } from './prompts/requestTypePrompt';
import { availableSeats, generateAIAnswer, generateAIContent, generateAIImage, processBookingApi } from './utils';

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect();

    const { message } = await req.json();
    const { conversation: conversationId, content } = message;

    await saveMessage('User', content, conversationId);

    const requestType = await generateAIContent({ prompt: buildRequestTypePrompt(content) });

    let aiResponse = '';

    if (requestType.text === 'image') {
      aiResponse = await generateAIImage(conversationId, buildRequestTypePrompt(content));
    } else {
      aiResponse = await generateAIAnswer(conversationId, content, { 'Available seats': availableSeats });
      if (aiResponse.startsWith('#BOOKING:')) {
        aiResponse = await processBookingApi(aiResponse, conversationId);
      }
    }

    await saveMessage('AI', aiResponse, conversationId);

    return new NextResponse(aiResponse, {
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
