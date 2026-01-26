import { ISendMessageUseCase } from 'src/domain/interfaces/use-cases/chat/ISendMessageUseCase';
import { IConversationRepository } from 'src/domain/interfaces/repositories/chat/IConversationRepository';
import { IMessageRepository } from 'src/domain/interfaces/repositories/chat/IMessageRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IChatSocketService } from 'src/domain/interfaces/services/IChatSocketService';
import { AuthorizationError, NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { ChatMessage, MessageStatus } from 'src/domain/entities/chat-message.entity';
import { CreateInput } from 'src/domain/types/common.types';
import { SendMessageResponseDto } from 'src/application/dtos/chat/responses/send-message-response.dto';
import { ConversationMapper } from 'src/application/mappers/chat/conversation.mapper';
import { ChatMessageMapper } from 'src/application/mappers/chat/chat-message.mapper';
import { SendMessageDto } from 'src/application/dtos/chat/requests/send-message.dto';

export class SendMessageUseCase implements ISendMessageUseCase {
  constructor(
    private readonly _conversationRepository: IConversationRepository,
    private readonly _messageRepository: IMessageRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _chatSocketService: IChatSocketService,
  ) { }

  async execute(input: SendMessageDto): Promise<SendMessageResponseDto> {
    const { senderId, receiverId, content, conversationId, replyToMessageId } = input;

    if (!content || !content.trim()) {
      throw new ValidationError('Message content is required');
    }

    if (senderId === receiverId) {
      throw new ValidationError('Cannot send a message to yourself');
    }

    const [sender, receiver] = await Promise.all([
      this._userRepository.findById(senderId),
      this._userRepository.findById(receiverId),
    ]);

    if (!sender) throw new NotFoundError('Sender not found');
    if (!receiver) throw new NotFoundError('Recipient not found');

    if (sender.isBlocked) {
      throw new AuthorizationError('Your account has been blocked. You cannot send messages.');
    }

    if (receiver.isBlocked) {
      throw new ValidationError('Cannot send message to this user');
    }

    const conversation = await this._conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    const participantIds = conversation.participants.map((p) => p.userId);
    if (!participantIds.includes(senderId) || !participantIds.includes(receiverId)) {
      throw new AuthorizationError('Users are not part of this conversation');
    }

    const messagePayload: CreateInput<ChatMessage> = {
      conversationId: conversation.id,
      senderId,
      receiverId,
      content,
      status: MessageStatus.SENT,
      isDeleted: false,
      readAt: null,
      replyToMessageId: replyToMessageId || null,
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

    const response = {
      conversation: ConversationMapper.toResponse(updatedConversation),
      message: ChatMessageMapper.toResponse(message),
    };

    this._chatSocketService.emitMessageDelivered(response.message, response.conversation);

    return response;
  }
}
