import { Types } from 'mongoose';
import { Conversation } from '../../../../domain/entities/conversation.entity';
import {
  ConversationQueryOptions,
  IConversationRepository,
} from '../../../../domain/interfaces/repositories/chat/IConversationRepository';
import { ConversationModel, ConversationDocument } from '../models/conversation.model';
import { RepositoryBase } from './base-repository';
import { ConversationPersistenceMapper } from '../mappers/conversation.mapper';
import { UserRole } from '../../../../domain/enums/user-role.enum';

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

  async findById(id: string): Promise<Conversation | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await ConversationModel.findById(id).populate('participants.user_id', 'name role').exec();
    if (!doc) return null;

    const participantsWithProfiles = await Promise.all(
      (doc as { participants: Array<{ user_id: { _id: unknown; name?: string; role?: string }; role: string; unread_count: number; last_read_at?: Date | null }> }).participants.map(async (participant: { user_id: { _id: unknown; name?: string; role?: string }; role: string; unread_count: number; last_read_at?: Date | null }) => {
        const user = participant.user_id;
        let profileImage: string | null = null;
        let name = 'Unknown';

        if (user && user.role) {
          if (user.role === 'seeker') {
            const SeekerProfileModel = this.model.db.model('SeekerProfile');
            const seekerProfile = await SeekerProfileModel.findOne({ user_id: user._id }, 'avatarFileName').lean() as { avatarFileName?: string } | null;
            profileImage = seekerProfile?.avatarFileName || null;
            name = user.name || 'Unknown';
          } else if (user.role === 'company') {
            const CompanyProfileModel = this.model.db.model('CompanyProfile');
            const companyProfile = await CompanyProfileModel.findOne({ userId: String(user._id) }, 'companyName logo').lean() as { companyName?: string; logo?: string } | null;
            profileImage = companyProfile?.logo || null;
            name = companyProfile?.companyName || 'Unknown';
          }
        }

        return {
          userId: String(participant.user_id._id),
          role: participant.role as UserRole,
          unreadCount: participant.unread_count,
          lastReadAt: participant.last_read_at ?? null,
          name,
          profileImage,
        };
      }),
    );

    return Conversation.create({
      id: String(doc._id),
      participants: participantsWithProfiles,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      lastMessage: doc.last_message ? { messageId: String(doc.last_message.message_id), senderId: String(doc.last_message.sender_id), content: doc.last_message.content, createdAt: doc.last_message.created_at } : null,
    });
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
      ConversationModel.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('participants.user_id', 'name role')
        .lean(),
      ConversationModel.countDocuments(filter),
    ]);

    // Populate profile images for each participant
    const data = await Promise.all(
      documents.map(async (doc: { _id: unknown; participants: Array<{ user_id: { _id: unknown; name?: string; role?: string }; role: string; unread_count: number; last_read_at?: Date | null }>; createdAt: Date; updatedAt: Date; last_message?: { message_id: unknown; sender_id: unknown; content: string; created_at: Date } | null }) => {
        const participantsWithProfiles = await Promise.all(
          doc.participants.map(async (participant: { user_id: { _id: unknown; name?: string; role?: string }; role: string; unread_count: number; last_read_at?: Date | null }) => {
            const user = participant.user_id;
            let profileImage: string | null = null;
            let name = 'Unknown';

            if (user && user.role) {
              if (user.role === 'seeker') {
                // Fetch seeker profile for avatar
                const SeekerProfileModel = this.model.db.model('SeekerProfile');
                const seekerProfile = await SeekerProfileModel.findOne(
                  { user_id: user._id },
                  'avatarFileName',
                ).lean() as { avatarFileName?: string } | null;
                profileImage = seekerProfile?.avatarFileName || null;
                name = user.name || 'Unknown';
              } else if (user.role === 'company') {
                // Fetch company profile for logo and name
                const CompanyProfileModel = this.model.db.model('CompanyProfile');
                const companyProfile = await CompanyProfileModel.findOne(
                  { userId: String(user._id) },
                  'companyName logo',
                ).lean() as { companyName?: string; logo?: string } | null;
                profileImage = companyProfile?.logo || null;
                name = companyProfile?.companyName || 'Unknown';
              }
            }

            return {
              userId: String(participant.user_id._id),
              role: participant.role as UserRole,
              unreadCount: participant.unread_count,
              lastReadAt: participant.last_read_at ?? null,
              name,
              profileImage,
            };
          }),
        );

        return Conversation.create({
          id: String(doc._id),
          participants: participantsWithProfiles,
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
      }),
    );

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

  async updateLastMessageContent(conversationId: string, messageId: string, newContent: string): Promise<void> {
    if (!Types.ObjectId.isValid(conversationId)) return;

    await ConversationModel.updateOne(
      { 
        _id: new Types.ObjectId(conversationId),
        'last_message.message_id': new Types.ObjectId(messageId),
      },
      {
        $set: { 'last_message.content': newContent },
      },
    );
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





