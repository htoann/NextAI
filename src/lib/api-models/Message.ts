import { TMessage } from '@/type';
import mongoose, { Schema } from 'mongoose';

const MessageSchema: Schema = new Schema(
  {
    owner: {
      type: String,
      ref: 'User',
      required: true,
      index: true,
    },
    content: { type: String, required: true },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  },
);

const Message = mongoose.models.Message || mongoose.model<TMessage>('Message', MessageSchema);

export default Message;
