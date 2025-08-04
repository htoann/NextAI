import { BookingResponse, CheckoutRequest, CheckoutResponse, TBookingMessage } from '@/types';
import { AxiosError } from 'axios';
import { apiService } from './apiService';

export const booking = async (bookingPayload: Partial<TBookingMessage>): Promise<BookingResponse> => {
  try {
    return await apiService.post<BookingResponse>(['booking'], bookingPayload);
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data ?? error.message;
  }
};

export const checkout = async (payload: CheckoutRequest): Promise<CheckoutResponse> => {
  try {
    return await apiService.post<CheckoutResponse>(['checkout'], payload);
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data ?? error.message;
  }
};
