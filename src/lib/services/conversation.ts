import { TConversation, TMessage } from '@/types';
import { AxiosError } from 'axios';
import { apiService } from './apiService';

export const getConversations = () =>
  apiService
    .get<TConversation[]>(['conversations'])
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const createConversation = (conversation: TConversation) =>
  apiService
    .post<TConversation>(['conversations'], conversation)
    .then((res) => res)
    .catch((err: AxiosError) => Promise.reject(err.response?.data));

export const updateConversationTitle = (conversationId: string, title: string) =>
  apiService
    .put<TConversation>(['conversations', conversationId], title)
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
