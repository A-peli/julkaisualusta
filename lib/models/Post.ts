import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "Lisää otsikko!"],
      trim: true,
      maxlength: [200, "Otsikko voi olla maksimissaan 200 merkkiä"],
    },
    content: {
      type: String,
      required: [true, "Lisää sisältöä!"],
    },
    author: {
      type: String,
      required: [true, "Lisää tekijä!"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.Post ||
  mongoose.model<IPost>("Post", postSchema);
