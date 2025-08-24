export type TMessage = {
  _id?: string;
  owner: string;
  content: string;
  conversation: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TConversation = {
  _id?: string;
  user: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUser = {
  _id?: string;
  username: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export enum EChatMode {
  Normal = 0,
  Silent = 1,
  VR = 2,
}

export type BookingStatus = 'pending' | 'success' | 'failed';

export type TBookingMessage = {
  bookingId: string;
  seatIds: string[];
  showtimeId: string;
  status: BookingStatus;
  messageId: string;
  userId: string;
  retry?: number;
  price: number;
  createdAt?: number;
  updatedAt?: number;
};

export type BookingResponse = TBookingMessage & {
  success: boolean;
  message?: string | null;
};

export type CheckoutRequest = {
  amount: number;
  bookingId: string;
};

export type CheckoutResponse = {
  url: string;
};

export enum ProfileTab {
  Info = 'info',
  Booking = 'bookings',
  Setting = 'setting',
}
