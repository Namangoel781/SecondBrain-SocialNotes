import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  title: string;
}

const TagSchema: Schema<ITag> = new Schema<ITag>({
  title: { type: String, required: true, unique: true },
});

export const Tag = mongoose.model<ITag>('Tag', TagSchema);
