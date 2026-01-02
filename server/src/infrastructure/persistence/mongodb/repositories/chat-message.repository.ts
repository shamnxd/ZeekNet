import { Types } from 'mongoose';
import { ChatMessage, MessageStatus } from 'src/domain/entities/chat-message.entity';
import { IMessageRepository, MessageQueryOptions } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { ChatMessageModel, ChatMessageDocument } from 'src/infrastructure/persistence/mongodb/models/chat-message.model';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';
import { ChatMessagePersistenceMapper } from 'src/infrastructure/mappers/persistence/mongodb/chat/chat-message.mapper';

export class ChatMessageRepository
  extends RepositoryBase<ChatMessage, ChatMessageDocument>
  implements IMessageRepository
{
  constructor() {
    super(ChatMessageModel);
  }

  protected mapToEntity(document: ChatMessageDocument): ChatMessage {
    return ChatMessagePersistenceMapper.toEntity(document);
  }

  protected mapToDocument(entity: Partial<ChatMessage>): Partial<ChatMessageDocument> {
    return ChatMessagePersistenceMapper.toDocument(entity);
  }

  async getByConversationId(
    conversationId: string,
    options: MessageQueryOptions = {},
  ): Promise<{
    data: ChatMessage[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (!Types.ObjectId.isValid(conversationId)) {
      return {
        data: [],
        total: 0,
        page: options.page || 1,
        limit: options.limit || 50,
        totalPages: 0,
      };
    }

    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;
    const filter = { conversation_id: new Types.ObjectId(conversationId) };

    const [documents, total] = await Promise.all([
      ChatMessageModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('sender_id', 'name role')
        .populate('receiver_id', 'name role'),
      ChatMessageModel.countDocuments(filter),
    ]);

    const data = documents.map((doc) => this.mapToEntity(doc));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(conversationId: string, readerId: string): Promise<number> {
    if (!Types.ObjectId.isValid(conversationId) || !Types.ObjectId.isValid(readerId)) {
      return 0;
    }

    const filter = {
      conversation_id: new Types.ObjectId(conversationId),
      receiver_id: new Types.ObjectId(readerId),
      status: MessageStatus.SENT,
    };

    const result = await ChatMessageModel.updateMany(filter, {
      status: MessageStatus.READ,
      read_at: new Date(),
    });

    return result.modifiedCount ?? 0;
  }

  async deleteMessage(messageId: string): Promise<ChatMessage | null> {
    if (!Types.ObjectId.isValid(messageId)) {
      return null;
    }

    const result = await ChatMessageModel.findByIdAndUpdate(
      messageId,
      { isDeleted: true },
      { new: true },
    );

    return result ? this.mapToEntity(result) : null;
  }

  async countByReceiverId(receiverId: string, since?: Date): Promise<number> {
    if (!Types.ObjectId.isValid(receiverId)) {
      return 0;
    }

    const filter: any = {
      receiver_id: new Types.ObjectId(receiverId),
      isDeleted: { $ne: true },
    };

    if (since) {
      filter.createdAt = { $gte: since };
    }

    return await ChatMessageModel.countDocuments(filter);
  }
}



