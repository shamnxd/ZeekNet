import { Types } from 'mongoose';
import { Conversation } from '../../../../domain/entities/conversation.entity';
import {
  ConversationQueryOptions,
  IConversationRepository,
} from '../../../../domain/interfaces/repositories/chat/IConversationRepository';
import { ConversationModel, ConversationDocument } from '../models/conversation.model';
import { RepositoryBase } from './base-repository';
import { ConversationPersistenceMapper } from '../mappers/conversation.mapper';

export class ConversationRepository
  extends RepositoryBase<Conversation, ConversationDocument>
  implements IConversationRepository
{
  constructor() {
    super(ConversationModel);
  }

  protected mapToEntity(document: ConversationDocument): Conversation {
    return ConversationPersistenceMapper.toEntity(document);
  }

  protected mapToDocument(entity: Partial<Conversation>): Partial<ConversationDocument> {
    return ConversationPersistenceMapper.toDocument(entity);
  }

  async create(data: Omit<Conversation, 'id' | '_id' | 'createdAt' | 'updatedAt'>): Promise<Conversation> {
    const participants = [...data.participants].map((participant) => ({
      ...participant,
      userObjectId: new Types.ObjectId(participant.userId),
    }));

    const sortedParticipants = participants.sort((a, b) => a.userObjectId.toString().localeCompare(b.userObjectId.toString()));

    const participantDocs = sortedParticipants.map((participant) => ({
      user_id: participant.userObjectId,
      role: participant.role,
      unread_count: participant.unreadCount ?? 0,
      last_read_at: participant.lastReadAt ?? null,
    }));

    const document = new ConversationModel({
      participant_ids: participantDocs.map((participant) => participant.user_id),
      participants: participantDocs,
      last_message: data.lastMessage
        ? {
          message_id: new Types.ObjectId(data.lastMessage.messageId),
          sender_id: new Types.ObjectId(data.lastMessage.senderId),
          content: data.lastMessage.content,
          created_at: data.lastMessage.createdAt,
        }
        : null,
    });

    const savedDocument = await document.save();
    return this.mapToEntity(savedDocument);
  }

  async findByParticipants(userAId: string, userBId: string): Promise<Conversation | null> {
    if (!Types.ObjectId.isValid(userAId) || !Types.ObjectId.isValid(userBId)) {
      return null;
    }

    const participants = [userAId, userBId].map((id) => new Types.ObjectId(id));
    const conversation = await ConversationModel.findOne({
      participant_ids: { $all: participants, $size: 2 },
    });

    return conversation ? this.mapToEntity(conversation) : null;
  }

  async getUserConversations(
    userId: string,
    options: ConversationQueryOptions = {},
  ): Promise<{
    data: Conversation[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    if (!Types.ObjectId.isValid(userId)) {
      return { data: [], total: 0, page: options.page || 1, limit: options.limit || 20, totalPages: 0 };
    }

    const page = options.page || 1;
    const limit = options.limit || 20;
    const skip = (page - 1) * limit;
    const filter = { 'participants.user_id': new Types.ObjectId(userId) };

    const [documents, total] = await Promise.all([
      ConversationModel.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
      ConversationModel.countDocuments(filter),
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

  async updateLastMessage(
    conversationId: string,
    lastMessage: { messageId: string; senderId: string; content: string; createdAt: Date },
    unreadUserId: string,
  ): Promise<Conversation | null> {
    if (!Types.ObjectId.isValid(conversationId) || !Types.ObjectId.isValid(unreadUserId)) {
      return null;
    }

    const lastMessageUpdate = {
      message_id: new Types.ObjectId(lastMessage.messageId),
      sender_id: new Types.ObjectId(lastMessage.senderId),
      content: lastMessage.content,
      created_at: lastMessage.createdAt,
    };

    const conversation = await ConversationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(conversationId), 'participants.user_id': new Types.ObjectId(unreadUserId) },
      {
        $set: { last_message: lastMessageUpdate, updatedAt: new Date() },
        $inc: { 'participants.$[unread].unread_count': 1 },
      },
      {
        new: true,
        arrayFilters: [{ 'unread.user_id': new Types.ObjectId(unreadUserId) }],
      },
    );

    return conversation ? this.mapToEntity(conversation) : null;
  }

  async resetUnread(conversationId: string, userId: string): Promise<Conversation | null> {
    if (!Types.ObjectId.isValid(conversationId) || !Types.ObjectId.isValid(userId)) {
      return null;
    }

    const conversation = await ConversationModel.findOneAndUpdate(
      { _id: new Types.ObjectId(conversationId), 'participants.user_id': new Types.ObjectId(userId) },
      {
        $set: {
          'participants.$[participant].unread_count': 0,
          'participants.$[participant].last_read_at': new Date(),
        },
        updatedAt: new Date(),
      },
      {
        new: true,
        arrayFilters: [{ 'participant.user_id': new Types.ObjectId(userId) }],
      },
    );

    return conversation ? this.mapToEntity(conversation) : null;
  }
}





