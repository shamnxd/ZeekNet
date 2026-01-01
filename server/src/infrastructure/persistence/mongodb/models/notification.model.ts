import { Schema, model, Document, Types } from 'mongoose';
import { NotificationType } from '../../../../domain/enums/notification-type.enum';

export interface NotificationDocument extends Document {
  user_id: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    type: {
      type: String,
      required: true,
      enum: Object.values(NotificationType),
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed, default: {} },
    is_read: { type: Boolean, default: false, index: true },
    read_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'notifications',
  },
);

NotificationSchema.index({ user_id: 1, is_read: 1 });
NotificationSchema.index({ user_id: 1, created_at: -1 });

export const NotificationModel = model<NotificationDocument>('Notification', NotificationSchema);

