import mongoose, { Schema, Document } from 'mongoose';

export interface ILink extends Document {
  hash: string;
  userId: mongoose.Types.ObjectId; 
  contentId: mongoose.Types.ObjectId;
}

const LinkSchema: Schema<ILink> = new Schema<ILink>({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  contentId: { type: Schema.Types.ObjectId, ref: 'Content', required: true },

});

export const Link = mongoose.model<ILink>('Link', LinkSchema);