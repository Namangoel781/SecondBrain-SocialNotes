import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string
    email: string;
    password: string;  // Ensure this is typed as string
  }

const UserSchema: Schema<IUser> = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);


