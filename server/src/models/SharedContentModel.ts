import mongoose, {Schema, Document} from "mongoose";

export interface ISharedContent extends Document {
    shareLink: string; 
    link: string;    
    type: string;    
    title: string;   
    tags: mongoose.Types.ObjectId[];
    ownerId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const SharedContentSchema: Schema = new Schema({
    shareLink: { type: String, required: true, unique: true },
    link: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
})

export const SharedContent = mongoose.model<ISharedContent>("SharedContent", SharedContentSchema)