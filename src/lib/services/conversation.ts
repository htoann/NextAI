import { AxiosError } from 'axios';
import { apiService } from './apiService';
import { TConversation, TMessage } from '@/type';

export const getConversations = () =>
  apiService
    .get<{ conversations: TConversation[] }>(['conversations'])
    .then((res) => res.conversations)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const createConversation = () =>
  apiService
    .post<{ conversation: TConversation }>(['conversations'])
    .then((res) => res.conversation)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const getConversationMessages = (conversationId: string) =>
  apiService
    .get<{ messages: TMessage[] }>(['conversations', conversationId, 'messages'])
    .then((res) => res.messages)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const chat = (conversationId: string, message: Partial<TMessage>) =>
  apiService
    .post<{ message: TMessage }>(['conversations', conversationId, 'chat'], { message })
    .then((res) => res.message)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));
