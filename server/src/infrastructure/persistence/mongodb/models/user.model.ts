import { Schema, model, Document } from 'mongoose';
import { UserRole } from '../../../../domain/enums/user-role.enum';

export interface UserDocument extends Document {
  name?: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string | null;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: UserRole.SEEKER,
      enum: Object.values(UserRole),
    },
    isVerified: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
    refreshToken: { type: String, default: null },
  },
  {
    timestamps: true,
  },
);

export const UserModel = model<UserDocument>('User', UserSchema);
