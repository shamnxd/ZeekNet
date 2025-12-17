import { Types } from 'mongoose';
import { Conversation } from '../../../../domain/entities/conversation.entity';
import { ConversationDocument } from '../models/conversation.model';

export class ConversationPersistenceMapper {
  static toEntity(doc: ConversationDocument): Conversation {
    return Conversation.create({
      id: String(doc._id),
      participants: doc.participants.map((participant) => ({
        userId: String(participant.user_id),
        role: participant.role,
        unreadCount: participant.unread_count,
        lastReadAt: participant.last_read_at ?? null,
        name: 'Unknown', // Will be populated by repository
        profileImage: null, // Will be populated by repository
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      lastMessage: doc.last_message
        ? {
          messageId: String(doc.last_message.message_id),
          senderId: String(doc.last_message.sender_id),
          content: doc.last_message.content,
          createdAt: doc.last_message.created_at,
        }
        : null,
    });
  }

  static toDocument(entity: Partial<Conversation>): Partial<ConversationDocument> {
    const doc: Partial<ConversationDocument> = {};

    if (entity.participants) {
      const participantDocs = entity.participants.map((participant) => ({
        user_id: new Types.ObjectId(participant.userId),
        role: participant.role,
        unread_count: participant.unreadCount ?? 0,
        last_read_at: participant.lastReadAt ?? null,
      }));

      doc.participant_ids = participantDocs.map((participant) => participant.user_id);
      doc.participants = participantDocs;
    }

    if (entity.lastMessage) {
      doc.last_message = {
        message_id: new Types.ObjectId(entity.lastMessage.messageId),
        sender_id: new Types.ObjectId(entity.lastMessage.senderId),
        content: entity.lastMessage.content,
        created_at: entity.lastMessage.createdAt,
      };
    }

    return doc;
  }
}





