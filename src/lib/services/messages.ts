import { TMessage } from '@/type';
import { AxiosError } from 'axios';
import { apiService } from './apiService';

// interface GeminiChatResponse {
//   data: ReadableStream;
// }

export const chat = (message: Partial<TMessage>) =>
  apiService
    .post<TMessage>(['messages'], { message })
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const geminiChat = (message: string, chatId: string) =>
  fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: { content: message, conversation: chatId },
    }),
  });

// export const geminiChat = (message: Partial<TMessage>) =>
//   apiService
//     .post<GeminiChatResponse>(['gemini'], { message })
//     .then((res) => res)
//     .catch((err: AxiosError) => {
//       console.log(err);
//       return Promise.reject(err.response?.data);
//     });
