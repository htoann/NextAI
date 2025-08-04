import { BookingResponse, CheckoutRequest, CheckoutResponse, TBookingMessage } from '@/types';
import { AxiosError } from 'axios';
import { apiService } from './apiService';

export const booking = async (bookingPayload: Partial<TBookingMessage>): Promise<BookingResponse> => {
  try {
    return await apiService.post<BookingResponse>(['bookings'], bookingPayload);
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

export const getBookingList = async (): Promise<BookingResponse[]> => {
  try {
    return await apiService.get<BookingResponse[]>(['bookings']);
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data ?? error.message;
  }
};

export const getBookingDetail = async (id: string): Promise<BookingResponse> => {
  try {
    return await apiService.get<BookingResponse>(['bookings', id]);
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data ?? error.message;
  }
};

export const deleteBooking = async (id: string): Promise<void> => {
  try {
    await apiService.delete(['bookings', id]);
  } catch (err) {
    const error = err as AxiosError;
    throw error.response?.data ?? error.message;
  }
};
