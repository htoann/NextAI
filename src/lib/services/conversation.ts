import { TConversation, TMessage } from '@/type';
import { AxiosError } from 'axios';
import { apiService } from './apiService';

export const getConversations = () =>
  apiService
    .get<TConversation[]>(['conversations'])
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const createConversation = () =>
  apiService
    .post<TConversation>(['conversations'])
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const updateConversationTitle = (conversationId: string, newTitle: string) =>
  apiService
    .put<TConversation>(['conversations', conversationId], { title: newTitle })
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const deleteConversation = (conversationId: string) =>
  apiService
    .delete(['conversations', conversationId])
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const getConversationMessages = (conversationId: string) =>
  apiService
    .get<TMessage[]>(['conversations', conversationId, 'messages'])
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const chat = (conversationId: string, message: Partial<TMessage>) =>
  apiService
    .post<TMessage>(['conversations', conversationId, 'chat'], { message })
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));
