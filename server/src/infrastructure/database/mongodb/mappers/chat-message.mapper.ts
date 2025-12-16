import { Types } from 'mongoose';
import { ChatMessage } from '../../../../domain/entities/chat-message.entity';
import { ChatMessageDocument } from '../models/chat-message.model';

export class ChatMessagePersistenceMapper {
  static toEntity(doc: ChatMessageDocument): ChatMessage {
    return ChatMessage.create({
      id: String(doc._id),
      conversationId: String(doc.conversation_id),
      senderId: String(doc.sender_id),
      receiverId: String(doc.receiver_id),
      content: doc.content,
      status: doc.status,
      createdAt: doc.createdAt,
      readAt: doc.read_at,
      replyToMessageId: doc.reply_to_message_id ? String(doc.reply_to_message_id) : null,
    });
  }

  static toDocument(entity: Partial<ChatMessage>): Partial<ChatMessageDocument> {
    const doc: Partial<ChatMessageDocument> = {};

    if (entity.conversationId) doc.conversation_id = new Types.ObjectId(entity.conversationId);
    if (entity.senderId) doc.sender_id = new Types.ObjectId(entity.senderId);
    if (entity.receiverId) doc.receiver_id = new Types.ObjectId(entity.receiverId);
    if (entity.content !== undefined) doc.content = entity.content;
    if (entity.status !== undefined) doc.status = entity.status;
    if (entity.readAt !== undefined) doc.read_at = entity.readAt;
    if (entity.replyToMessageId !== undefined) {
      doc.reply_to_message_id = entity.replyToMessageId ? new Types.ObjectId(entity.replyToMessageId) : null;
    }

    return doc;
  }
}
