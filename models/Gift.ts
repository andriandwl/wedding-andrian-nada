/**
 * models/Gift.ts — pencatatan amplop, transfer, dan kado dari tamu
 */
import mongoose, { Document, Schema, Model } from "mongoose";

export const GIFT_TYPES = ["amplop", "transfer", "kado"] as const;
export type GiftType = (typeof GIFT_TYPES)[number];

export interface IGift extends Document {
  guestName: string;
  type: GiftType;
  amount: number; // rupiah, 0 untuk kado
  item: string; // deskripsi kado
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const GiftSchema = new Schema<IGift>(
  {
    guestName: { type: String, required: true, trim: true, maxlength: 120 },
    type: { type: String, enum: GIFT_TYPES, required: true },
    amount: { type: Number, default: 0, min: 0 },
    item: { type: String, default: "", trim: true, maxlength: 200 },
    note: { type: String, default: "", trim: true, maxlength: 300 },
  },
  { timestamps: true },
);

GiftSchema.index({ createdAt: -1 });

const Gift: Model<IGift> =
  mongoose.models.Gift || mongoose.model<IGift>("Gift", GiftSchema);

export default Gift;
