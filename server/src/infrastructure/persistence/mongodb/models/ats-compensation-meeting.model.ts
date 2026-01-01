import mongoose, { Schema, Document } from 'mongoose';

export interface IATSCompensationMeetingDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  type: 'call' | 'online' | 'in-person';
  scheduledDate: Date;
  videoType?: 'in-app' | 'external';
  webrtcRoomId?: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ATSCompensationMeetingSchema = new Schema<IATSCompensationMeetingDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'JobApplication',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['call', 'online', 'in-person'],
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    videoType: {
      type: String,
      enum: ['in-app', 'external'],
    },
    webrtcRoomId: {
      type: String,
    },
    location: {
      type: String,
    },
    meetingLink: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);


ATSCompensationMeetingSchema.index({ applicationId: 1, createdAt: -1 });
ATSCompensationMeetingSchema.index({ scheduledDate: 1 });

export const ATSCompensationMeetingModel = mongoose.model<IATSCompensationMeetingDocument>('ATSCompensationMeeting', ATSCompensationMeetingSchema);


