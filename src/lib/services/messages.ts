import { TMessage } from '@/types';
import { AxiosError } from 'axios';
import { apiService } from './apiService';

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
