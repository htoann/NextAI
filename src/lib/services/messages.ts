import { TMessage } from '@/type';
import { AxiosError } from 'axios';
import { apiService } from './apiService';

interface GeminiChatResponse {
  data: ReadableStream;
}

export const chat = (message: Partial<TMessage>) =>
  apiService
    .post<TMessage>(['messages'], { message })
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const geminiChat = (message: Partial<TMessage>) =>
  apiService
    .post<GeminiChatResponse>(['gemini'], { message })
    .then((res) => {
      // return res.data.getReader();
      return res;
    })
    .catch((err: AxiosError) => {
      console.log(err);
      return Promise.reject(err.response?.data);
    });
