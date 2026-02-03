import { ConversationRepository } from 'src/infrastructure/persistence/mongodb/repositories/conversation.repository';
import { ChatMessageRepository } from 'src/infrastructure/persistence/mongodb/repositories/chat-message.repository';
import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';
import { SendMessageUseCase } from 'src/application/use-cases/chat/send-message.use-case';
import { GetConversationsUseCase } from 'src/application/use-cases/chat/get-conversations.use-case';
import { GetMessagesUseCase } from 'src/application/use-cases/chat/get-messages.use-case';
import { MarkMessagesAsReadUseCase } from 'src/application/use-cases/chat/mark-messages-as-read.use-case';
import { CreateConversationUseCase } from 'src/application/use-cases/chat/create-conversation.use-case';
import { DeleteMessageUseCase } from 'src/application/use-cases/chat/delete-message.use-case';
import { ChatSocketService } from 'src/infrastructure/external-services/socket/chat.service';
import { ChatController } from 'src/presentation/controllers/chat/chat.controller';
import { ChatRouter } from 'src/presentation/routes/chat-router';
import { S3Service } from 'src/infrastructure/external-services/s3/s3.service';

import { logger } from 'src/infrastructure/config/logger';

logger.info('Initializing chatDi...');

const s3Service = new S3Service();
const conversationRepository = new ConversationRepository(s3Service);
const messageRepository = new ChatMessageRepository();
const userRepository = new UserRepository();

export const chatSocketService = new ChatSocketService();
export const socketConnectionManager = chatSocketService;

export const sendMessageUseCase = new SendMessageUseCase(
  conversationRepository,
  messageRepository,
  userRepository,
  chatSocketService,
);

const getConversationsUseCase = new GetConversationsUseCase(conversationRepository, userRepository);
const getMessagesUseCase = new GetMessagesUseCase(messageRepository, conversationRepository);

export const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(
  messageRepository,
  conversationRepository,
  chatSocketService,
);

const createConversationUseCase = new CreateConversationUseCase(conversationRepository, userRepository);

const deleteMessageUseCase = new DeleteMessageUseCase(
  messageRepository,
  conversationRepository,
  chatSocketService,
);

export const chatController = new ChatController(
  createConversationUseCase,
  sendMessageUseCase,
  getConversationsUseCase,
  getMessagesUseCase,
  markMessagesAsReadUseCase,
  deleteMessageUseCase,
);

export const chatRouter = new ChatRouter();

export {
  conversationRepository as chatConversationRepository,
  messageRepository as chatMessageRepository,
  userRepository as chatUserRepository,
};

logger.info('chatDi initialization complete');



