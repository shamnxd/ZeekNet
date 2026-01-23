import { ConversationRepository } from 'src/infrastructure/persistence/mongodb/repositories/conversation.repository';
import { ChatMessageRepository } from 'src/infrastructure/persistence/mongodb/repositories/chat-message.repository';
import { UserRepository } from 'src/infrastructure/persistence/mongodb/repositories/user.repository';
import { SendMessageUseCase } from 'src/application/use-cases/chat/messaging/send-message.use-case';
import { GetConversationsUseCase } from 'src/application/use-cases/chat/messaging/get-conversations.use-case';
import { GetMessagesUseCase } from 'src/application/use-cases/chat/messaging/get-messages.use-case';
import { MarkMessagesAsReadUseCase } from 'src/application/use-cases/chat/messaging/mark-messages-as-read.use-case';
import { CreateConversationUseCase } from 'src/application/use-cases/chat/messaging/create-conversation.use-case';
import { DeleteMessageUseCase } from 'src/application/use-cases/chat/messaging/delete-message.use-case';
import { ChatService } from 'src/application/services/chat.service';
import { ChatController } from 'src/presentation/controllers/chat/chat.controller';
import { ChatRouter } from 'src/presentation/routes/chat-router';
import { S3Service } from 'src/infrastructure/external-services/s3/s3.service';

import { logger } from 'src/infrastructure/config/logger';

logger.info('Initializing chatDi...');
const s3Service = new S3Service();
const conversationRepository = new ConversationRepository(s3Service);
const messageRepository = new ChatMessageRepository();
const userRepository = new UserRepository();

const sendMessageUseCase = new SendMessageUseCase(conversationRepository, messageRepository, userRepository);
const getConversationsUseCase = new GetConversationsUseCase(conversationRepository, userRepository);
const getMessagesUseCase = new GetMessagesUseCase(messageRepository, conversationRepository);
const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(messageRepository, conversationRepository);
const createConversationUseCase = new CreateConversationUseCase(conversationRepository, userRepository);
const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository, conversationRepository);

export const chatService = new ChatService(
  sendMessageUseCase,
  getConversationsUseCase,
  getMessagesUseCase,
  markMessagesAsReadUseCase,
  createConversationUseCase,
  deleteMessageUseCase,
  conversationRepository,
);

const chatController = new ChatController(
  createConversationUseCase,
  sendMessageUseCase,
  getConversationsUseCase,
  getMessagesUseCase,
  markMessagesAsReadUseCase,
  deleteMessageUseCase,
  chatService,
);
export const chatRouter = new ChatRouter(chatController, userRepository);

export { conversationRepository as chatConversationRepository, messageRepository as chatMessageRepository, userRepository as chatUserRepository };
logger.info('chatDi initialization complete');





