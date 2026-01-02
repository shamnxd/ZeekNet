import { Schema, model, Document, Types } from 'mongoose';
import { MessageStatus } from 'src/domain/entities/chat-message.entity';

export interface ChatMessageDocument extends Document {
  conversation_id: Types.ObjectId;
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId;
  content: string;
  status: MessageStatus;
  isDeleted: boolean;
  read_at?: Date | null;
  reply_to_message_id?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<ChatMessageDocument>(
  {
    conversation_id: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    sender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    receiver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: { type: String, required: true, trim: true },
    status: { type: String, enum: Object.values(MessageStatus), default: MessageStatus.SENT },
    isDeleted: { type: Boolean, default: false },
    read_at: { type: Date, default: null },
    reply_to_message_id: { type: Schema.Types.ObjectId, ref: 'ChatMessage', default: null },
  },
  {
    timestamps: true,
    collection: 'chat_messages',
  },
);

ChatMessageSchema.index({ conversation_id: 1, createdAt: -1 });

export const ChatMessageModel = model<ChatMessageDocument>('ChatMessage', ChatMessageSchema);
