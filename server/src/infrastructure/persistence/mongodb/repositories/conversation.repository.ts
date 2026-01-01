import { Types } from 'mongoose';
import { Conversation } from 'src/domain/entities/conversation.entity';
import {
  ConversationQueryOptions,
  IConversationRepository,
} from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { ConversationModel, ConversationDocument } from 'src/infrastructure/persistence/mongodb/models/conversation.model';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';
import { ConversationPersistenceMapper } from 'src/infrastructure/mappers/persistence/mongodb/chat/conversation.mapper';
import { UserRole } from 'src/domain/enums/user-role.enum';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { CreateInput } from 'src/domain/types/common.types';

export class ConversationRepository extends RepositoryBase<Conversation, ConversationDocument>
  implements IConversationRepository
{
  constructor(private readonly _s3Service?: IS3Service) {
    super(ConversationModel);
  }

  protected mapToEntity(document: ConversationDocument): Conversation {
    return ConversationPersistenceMapper.toEntity(document);
  }

  protected mapToDocument(entity: Partial<Conversation>): Partial<ConversationDocument> {
    return ConversationPersistenceMapper.toDocument(entity);
  }

  async create(data: CreateInput<Conversation>): Promise<Conversation> {
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

    const doc = await ConversationModel.findById(id).populate('participants.user_id', 'name role isBlocked').exec();
    if (!doc) return null;

    const participantDetails = await this._getEnrichedParticipants(doc);
    return ConversationPersistenceMapper.toEnrichedEntity(doc, participantDetails);
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
        .populate('participants.user_id', 'name role isBlocked'),
      ConversationModel.countDocuments(filter),
    ]);

    const data = await Promise.all(
      documents.map(async (doc) => {
        const participantDetails = await this._getEnrichedParticipants(doc);
        return ConversationPersistenceMapper.toEnrichedEntity(doc, participantDetails);
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

  private async _getEnrichedParticipants(doc: ConversationDocument): Promise<Map<string, { name: string; profileImage: string | null }>> {
    const detailsMap = new Map<string, { name: string; profileImage: string | null }>();

    
    const isPopulatedUser = (u: unknown): u is { _id: Types.ObjectId; isBlocked?: boolean; role?: string; name?: string } => {
      return typeof u === 'object' && u !== null && '_id' in u;
    };

    await Promise.all(
      doc.participants.map(async (participant: ConversationDocument['participants'][0]) => {
        const user = participant.user_id;
        
        
        const userId = isPopulatedUser(user) ? String(user._id) : String(participant.user_id);
        
        let profileImage: string | null = null;
        let name = 'Unknown';

        
        if (isPopulatedUser(user)) {
          const populatedUser = user as { _id: Types.ObjectId; isBlocked?: boolean; role?: string; name?: string }; 
          if (populatedUser.isBlocked) {
            name = 'User Not Found';
          } else if (populatedUser.role) {
            if (populatedUser.role === 'seeker') {
              const SeekerProfileModel = this.model.db.model('SeekerProfile');
              const seekerProfile = await SeekerProfileModel.findOne({ userId: populatedUser._id }, 'avatarFileName').lean() as { avatarFileName?: string } | null;
              const avatarKey = seekerProfile?.avatarFileName || null;
              
              profileImage = avatarKey && this._s3Service ? await this._s3Service.getSignedUrl(avatarKey) : avatarKey;
              name = populatedUser.name || 'Unknown';
            } else if (populatedUser.role === 'company') {
              const CompanyProfileModel = this.model.db.model('CompanyProfile');
              const companyProfile = await CompanyProfileModel.findOne({ userId: String(populatedUser._id) }, 'companyName logo').lean() as { companyName?: string; logo?: string } | null;
              const logoKey = companyProfile?.logo || null;
              
              profileImage = logoKey && this._s3Service ? await this._s3Service.getSignedUrl(logoKey) : logoKey;
              name = companyProfile?.companyName || 'Unknown';
            }
          }
        }
        
        detailsMap.set(userId, { name, profileImage });
      }),
    );

    return detailsMap;
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
















