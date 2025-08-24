import cloudinary from '@/lib/cloudinary';
import { booking } from '@/lib/services/booking';
import { GoogleGenAI, Modality } from '@google/genai';
import { getConversationHistory } from './conversation';
import { buildBookingPrompt, failedBookingPrompt, successfulBookingPrompt } from './prompts/bookingPrompt';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';
const genAI = new GoogleGenAI({});

export const buildPromptWithContext = async (
  conversationId: string,
  newUserMessage: string,
  optionalContext?: { [key: string]: any },
) => {
  const conversationHistory = await getConversationHistory(conversationId);
  return buildBookingPrompt(conversationHistory, newUserMessage, optionalContext);
};

export const generateAIContent = async ({
  prompt,
  requestOptions = {},
  model = GEMINI_MODEL,
}: {
  prompt: string;
  requestOptions?: { [key: string]: any };
  model?: string;
}) => {
  const response = await genAI.models.generateContent({
    model,
    contents: prompt,
    ...requestOptions,
  });
  return response;
};

export const generateAIAnswer = async (
  conversationId: string,
  newUserMessage: string,
  optionalContext?: { [key: string]: any },
) => {
  const prompt = await buildPromptWithContext(conversationId, newUserMessage, optionalContext);
  const response = await generateAIContent({ prompt });
  return response.text?.trim() || '';
};

export const generateAIImage = async (
  conversationId: string,
  newUserMessage: string,
  optionalContext?: { [key: string]: any },
) => {
  const prompt = await buildPromptWithContext(conversationId, newUserMessage, optionalContext);
  const response = await generateAIContent({
    model: GEMINI_IMAGE_MODEL,
    prompt,
    requestOptions: {
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    },
  });

  const parts = response?.candidates?.[0]?.content?.parts ?? [];
  const base64 = parts.find((p: any) => p?.inlineData?.data)?.inlineData?.data;

  if (!base64) {
    return 'Image generation failed: no base64 data returned.';
  }

  const upload = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, { folder: 'gemini' });
  return upload.secure_url;
};

export const processBookingApi = async (aiText: string, conversationId: string) => {
  try {
    const bookingData = JSON.parse(aiText.replace('#BOOKING:', '').trim());
    await booking(bookingData);
    return generateAIAnswer(conversationId, successfulBookingPrompt);
  } catch (error) {
    console.error(error);
    return generateAIAnswer(conversationId, failedBookingPrompt);
  }
};

export const availableSeats = `
Rows: A-D, Seats per row: 8.
Showtimes:
02/08/2025 → 14:00, 17:00, 20:00
03/08/2025 → 15:00, 18:00
Initially booked seats:
02/08/2025 14:00 → A1, A2
02/08/2025 17:00 → B1
03/08/2025 15:00 → C3
`;
