import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  owner: string;
  content: string;
  conversation: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

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

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
