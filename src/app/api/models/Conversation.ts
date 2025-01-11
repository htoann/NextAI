import mongoose, { Document, Schema } from 'mongoose';

interface IConversation extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
}

const conversationSchema: Schema<IConversation> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
