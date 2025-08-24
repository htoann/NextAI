import { uploadBase64ToCloudinary } from '@/lib/cloudinary';
import { GoogleGenAI, Modality } from '@google/genai';
import { buildPromptWithContext } from './utils';

const GEMINI_TEXTAUDIO_MODEL = 'gemini-2.5-flash-lite';
const GEMINI_IMAGE_MODEL = 'gemini-2.0-flash-preview-image-generation';
const genAI = new GoogleGenAI({});

export const generateAIContent = async ({
  prompt,
  requestOptions = {},
  model = GEMINI_TEXTAUDIO_MODEL,
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

export const generateAIText = async (
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

  return uploadBase64ToCloudinary(base64);
};
