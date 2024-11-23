import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IContent extends Document {
  link: string;
  type: 'video' | 'article' | 'image' | 'tweets' // Replace with actual enum values
  title: string;
  tags: Types.ObjectId[]; // Array of Tag references
  userId: Types.ObjectId; // Reference to the User model
}

const ContentSchema: Schema<IContent> = new Schema<IContent>({
  link: { type: String, required: true },
  type: { type: String, enum: ['video', 'article', 'image', 'tweets'], required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {timestamps: true});

export const Content = mongoose.model<IContent>('Content', ContentSchema);
