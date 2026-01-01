import { Schema, model, Document, Types } from 'mongoose';

interface SocialLink {
  name: string;
  link: string;
}

interface ResumeMeta {
  url: string;
  fileName: string;
  uploadedAt: Date;
}

export interface SeekerProfileDocument extends Document {
  userId: Types.ObjectId;
  headline?: string;
  summary?: string;
  location?: string;
  phone?: string;
  email?: string; 
  avatarFileName?: string; 
  bannerFileName?: string; 
  dateOfBirth?: Date;
  gender?: string;
  skills: string[];
  languages: string[];
  socialLinks: SocialLink[];
  resume?: ResumeMeta;
  createdAt: Date;
  updatedAt: Date;
}

const SocialLinkSchema = new Schema<SocialLink>(
  {
    name: { type: String, required: true },
    link: { type: String, required: true },
  },
  { _id: false },
);

const ResumeMetaSchema = new Schema<ResumeMeta>(
  {
    url: { type: String, required: true },
    fileName: { type: String, required: true },
    uploadedAt: { type: Date, required: true },
  },
  { _id: false },
);

const SeekerProfileSchema = new Schema<SeekerProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User', unique: true, index: true },
    headline: { type: String },
    summary: { type: String },
    location: { type: String },
    phone: { type: String },
    email: { type: String }, 
    avatarFileName: { type: String }, 
    bannerFileName: { type: String }, 
    dateOfBirth: { type: Date },
    gender: { type: String },
    skills: [{ type: String, default: [] }],
    languages: [{ type: String, default: [] }],
    socialLinks: { type: [SocialLinkSchema], default: [] },
    resume: { type: ResumeMetaSchema },
  },
  { timestamps: true },
);

export const SeekerProfileModel = model<SeekerProfileDocument>('SeekerProfile', SeekerProfileSchema);
