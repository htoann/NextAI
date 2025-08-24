import { dbConnect } from '@/lib/dbConnect';
import { TMessage } from '@/types';
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

    const { text: requestType } = await generateAIContent({
      prompt: buildRequestTypePrompt(content),
    });

    let aiResponseContent: string;
    let aiResponseMessage: Partial<TMessage>;

    switch (requestType) {
      case 'image': {
        aiResponseContent = await generateAIImage(conversationId, content);
        aiResponseMessage = await saveMessage('AI', aiResponseContent, conversationId, {
          metadata: { type: 'image' },
        });
        break;
      }
      default: {
        aiResponseContent = await generateAIAnswer(conversationId, content, {
          'Available seats': availableSeats,
        });

        if (aiResponseContent.startsWith('#BOOKING:')) {
          aiResponseContent = await processBookingApi(aiResponseContent, conversationId);
        }

        aiResponseMessage = await saveMessage('AI', aiResponseContent, conversationId);
        break;
      }
    }

    return NextResponse.json(aiResponseMessage);
  } catch (err) {
    console.error('Error in POST /api:', err);
    return NextResponse.json({ error: 'Failed to generate response. Please try again later' }, { status: 500 });
  }
};
