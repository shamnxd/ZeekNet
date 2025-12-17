import { ConversationRepository } from '../database/mongodb/repositories/conversation.repository';
import { ChatMessageRepository } from '../database/mongodb/repositories/chat-message.repository';
import { UserRepository } from '../database/mongodb/repositories/user.repository';
import { SendMessageUseCase } from '../../application/use-cases/chat/send-message.use-case';
import { GetConversationsUseCase } from '../../application/use-cases/chat/get-conversations.use-case';
import { GetMessagesUseCase } from '../../application/use-cases/chat/get-messages.use-case';
import { MarkMessagesAsReadUseCase } from '../../application/use-cases/chat/mark-messages-as-read.use-case';
import { CreateConversationUseCase } from '../../application/use-cases/chat/create-conversation.use-case';
import { DeleteMessageUseCase } from '../../application/use-cases/chat/delete-message.use-case';
import { ChatService } from '../../application/services/chat.service';
import { ChatController } from '../../presentation/controllers/chat/chat.controller';
import { ChatRouter } from '../../presentation/routes/chat-router';
import { S3Service } from '../external-services/s3/s3.service';

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

const chatController = new ChatController(chatService);
export const chatRouter = new ChatRouter(chatController, userRepository);

export { conversationRepository as chatConversationRepository, messageRepository as chatMessageRepository, userRepository as chatUserRepository };




