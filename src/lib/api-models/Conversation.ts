import mongoose, { Document, Schema } from 'mongoose';

interface IConversation extends Document {
  user: string;
  title: string;
}

const conversationSchema: Schema<IConversation> = new Schema(
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

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
