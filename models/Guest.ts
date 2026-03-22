/**
 * models/Guest.ts
 */
import mongoose, { Document, Schema, Model } from "mongoose";

export interface IRsvp {
  attending: boolean | null;
  pax: number | null;
  note: string | null;
  respondedAt: Date | null;
}

export interface IGuest extends Document {
  name: string;
  phone: string;
  invitationCode: string;
  category: "Akad" | "Resepsi" | "Both" | null;
  maxPax: number;
  status: "INVITED" | "CONFIRMED" | "DECLINED";
  rsvp: IRsvp;
  createdAt: Date;
  updatedAt: Date;
}

const RsvpSchema = new Schema<IRsvp>(
  {
    attending: { type: Boolean, default: null },
    pax: { type: Number, default: null },
    note: { type: String, default: null },
    respondedAt: { type: Date, default: null },
  },
  { _id: false },
);

const GuestSchema = new Schema<IGuest>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, default: "", trim: true },

    invitationCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["Akad", "Resepsi", "Both"],
      default: "Both",
    },

    maxPax: { type: Number, default: 1, min: 1 },

    status: {
      type: String,
      enum: ["INVITED", "CONFIRMED", "DECLINED"],
      default: "INVITED",
    },

    rsvp: {
      type: RsvpSchema,
      default: () => ({
        attending: null,
        pax: null,
        category: null,
        note: null,
        respondedAt: null,
      }),
    },
  },
  { timestamps: true },
);

// Text index for search
GuestSchema.index({ name: "text", phone: "text" });

const Guest: Model<IGuest> =
  mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema);

export default Guest;
