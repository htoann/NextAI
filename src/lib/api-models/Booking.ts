import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    seatIds: {
      type: [String],
      required: true,
    },
    showtimeId: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'success', 'cancelled', 'failed'],
      default: 'pending',
    },
    messageId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.index({ seatId: 1, showtimeId: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;
