import { ISendMessageUseCase, SendMessageInput } from '../../../domain/interfaces/use-cases/chat/IChatUseCases';
import { IConversationRepository } from '../../../domain/interfaces/repositories/chat/IConversationRepository';
import { IMessageRepository } from '../../../domain/interfaces/repositories/chat/IMessageRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { AuthorizationError, NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { Conversation } from '../../../domain/entities/conversation.entity';
import { ChatMessage, MessageStatus } from '../../../domain/entities/chat-message.entity';
import { CreateInput } from '../../../domain/types/common.types';

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private readonly _conversationRepository: IConversationRepository,
    private readonly _messageRepository: IMessageRepository,
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(data: SendMessageInput): Promise<{ conversation: Conversation; message: ChatMessage }> {
    if (!data.content || !data.content.trim()) {
      throw new ValidationError('Message content is required');
    }

    if (data.senderId === data.receiverId) {
      throw new ValidationError('Cannot send a message to yourself');
    }

    const [sender, receiver] = await Promise.all([
      this._userRepository.findById(data.senderId),
      this._userRepository.findById(data.receiverId),
    ]);

    if (!sender) throw new NotFoundError('Sender not found');
    if (!receiver) throw new NotFoundError('Recipient not found');

    const conversation = await this._conversationRepository.findById(data.conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const participantIds = conversation.participants.map((p) => p.userId);
    if (!participantIds.includes(data.senderId) || !participantIds.includes(data.receiverId)) {
      throw new AuthorizationError('Users are not part of this conversation');
    }

    const messagePayload: CreateInput<ChatMessage> = {
      conversationId: conversation.id,
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content,
      status: MessageStatus.SENT,
      isDeleted: false,
      readAt: null,
      replyToMessageId: data.replyToMessageId || null,
    };

    const message = await this._messageRepository.create(messagePayload);

    const lastMessage = {
      messageId: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
    };

    const updatedConversation =
      (await this._conversationRepository.updateLastMessage(conversation.id, lastMessage, message.receiverId)) ||
      conversation.withLastMessage(message);

    return { conversation: updatedConversation, message };
  }
}
