import { TConversation } from '@/type';
import mongoose, { Schema } from 'mongoose';

const conversationSchema: Schema = new Schema(
  {
    user: {
      type: String,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Conversation = mongoose.model<TConversation>('Conversation', conversationSchema);

export default Conversation;
