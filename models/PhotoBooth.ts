import mongoose, { Document, Schema, Model } from "mongoose";

export interface IPhotoBooth extends Document {
  guestCode?: string;
  guestName: string;
  framedPhotoUrl: string;
  audioUrl?: string;
  audioDuration?: number;
  isVisible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoBoothSchema = new Schema<IPhotoBooth>(
  {
    guestCode: { type: String, default: null },
    guestName: { type: String, required: true, trim: true, maxlength: 100 },
    framedPhotoUrl: { type: String, required: true },
    audioUrl: { type: String, default: null },
    audioDuration: { type: Number, default: null },
    isVisible: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

PhotoBoothSchema.index({ createdAt: -1 });

const PhotoBooth: Model<IPhotoBooth> =
  mongoose.models.PhotoBooth ||
  mongoose.model<IPhotoBooth>("PhotoBooth", PhotoBoothSchema);

export default PhotoBooth;
