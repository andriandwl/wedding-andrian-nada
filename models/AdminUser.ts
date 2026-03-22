/**
 * models/AdminUser.ts
 */
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAdminUser extends Document {
  email:        string;
  passwordHash: string;
  role:         'admin';
  createdAt:    Date;
  updatedAt:    Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role:         { type: String, enum: ['admin'], default: 'admin' },
  },
  { timestamps: true },
);

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
