import { TUser } from '@/type';
import mongoose, { Schema } from 'mongoose';

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
          return regex.test(value);
        },
        message: 'Please enter a valid email address.',
      },
    },
  },
  { timestamps: true },
);

const User = mongoose.model<TUser>('User', userSchema);

export default User;
