import { TBookingMessage } from '@/lib/types/type';
import { AxiosError } from 'axios';
import { apiService } from './apiService';

type BookingResponse = {
  email: string;
  status: string;
  success: boolean;
  error?: string | null;
};

export const booking = async (bookingPayload: Partial<TBookingMessage>): Promise<BookingResponse> => {
  try {
    return await apiService.post<BookingResponse>(['booking'], bookingPayload);
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data ?? error.message;
  }
};
