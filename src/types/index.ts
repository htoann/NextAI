export type TMessage = {
  _id?: string;
  owner: string;
  content: string;
  conversation: string;
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

export type TBookingMessage = {
  bookingId: string;
  seatIds: string[];
  showtimeId: string;
  status: 'pending' | 'success' | 'failed';
  messageId: string;
  userId: string;
  retry: number;
};

export type BookingPayload = {
  bookingId: string;
  seatId: string;
  showtimeId: string;
  status: 'pending';
  messageId: string;
  userId: string;
};

export type BookingResponse = {
  email: string;
  status: string;
  success: boolean;
  error?: string | null;
};

export type CheckoutRequest = {
  amount: number;
};

export type CheckoutResponse = {
  url: string;
};
