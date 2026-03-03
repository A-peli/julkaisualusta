import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IPostDoc extends Document {
  title: string;
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPostDoc>(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const Post: Model<IPostDoc> = mongoose.models.Post || mongoose.model<IPostDoc>('Post', PostSchema);
export default Post;
