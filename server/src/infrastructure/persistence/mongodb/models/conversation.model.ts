import { Schema, model, Document, Types } from 'mongoose';
import { UserRole } from 'src/domain/enums/user-role.enum';

export interface ConversationParticipantDocument {
  user_id: Types.ObjectId;
  role: UserRole;
  unread_count: number;
  last_read_at?: Date | null;
}

export interface ConversationDocument extends Document {
  participant_ids: Types.ObjectId[];
  participants: ConversationParticipantDocument[];
  last_message?: {
    message_id: Types.ObjectId;
    sender_id: Types.ObjectId;
    content: string;
    created_at: Date;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new Schema<ConversationParticipantDocument>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    unread_count: { type: Number, default: 0 },
    last_read_at: { type: Date, default: null },
  },
  { _id: false },
);

const LastMessageSchema = new Schema(
  {
    message_id: { type: Schema.Types.ObjectId, ref: 'ChatMessage', required: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    created_at: { type: Date, required: true },
  },
  { _id: false },
);

const ConversationSchema = new Schema<ConversationDocument>(
  {
    participant_ids: { type: [Schema.Types.ObjectId], required: true },
    participants: { type: [ParticipantSchema], required: true },
    last_message: { type: LastMessageSchema, default: null },
  },
  {
    timestamps: true,
    collection: 'conversations',
  },
);

ConversationSchema.index({ participant_ids: 1 }, { unique: true });
ConversationSchema.index({ updatedAt: -1 });
ConversationSchema.index({ 'participants.user_id': 1, updatedAt: -1 });

export const ConversationModel = model<ConversationDocument>('Conversation', ConversationSchema);

