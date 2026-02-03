import { Types } from 'mongoose';
import { Conversation } from 'src/domain/entities/conversation.entity';
import { ConversationDocument } from 'src/infrastructure/persistence/mongodb/models/conversation.model';

export class ConversationPersistenceMapper {
  private static toIdString(id: Types.ObjectId | unknown): string {
    if (id && typeof id === 'object' && '_id' in id) {
      return String((id as { _id: unknown })._id);
    }
    return String(id);
  }

  static toEntity(doc: ConversationDocument): Conversation {
    return Conversation.create({
      id: String(doc._id),
      participants: doc.participants.map((participant) => ({
        userId: this.toIdString(participant.user_id),
        role: participant.role,
        unreadCount: participant.unread_count,
        lastReadAt: participant.last_read_at ?? null,
        name: 'Unknown',
        profileImage: null,
      })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      lastMessage: doc.last_message
        ? {
          messageId: this.toIdString(doc.last_message.message_id),
          senderId: this.toIdString(doc.last_message.sender_id),
          content: doc.last_message.content,
          createdAt: doc.last_message.created_at,
        }
        : null,
    });
  }

  static toEnrichedEntity(
    doc: ConversationDocument,
    participantDetails: Map<string, { name: string; profileImage: string | null }>,
  ): Conversation {
    return Conversation.create({
      id: String(doc._id),
      participants: doc.participants.map((participant) => {
        const userId = this.toIdString(participant.user_id);
        const details = participantDetails.get(userId) || { name: 'Unknown', profileImage: null };

        return {
          userId,
          role: participant.role,
          unreadCount: participant.unread_count,
          lastReadAt: participant.last_read_at ?? null,
          name: details.name,
          profileImage: details.profileImage,
        };
      }),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      lastMessage: doc.last_message
        ? {
          messageId: this.toIdString(doc.last_message.message_id),
          senderId: this.toIdString(doc.last_message.sender_id),
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
















