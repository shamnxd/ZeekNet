import { Container } from 'inversify';
import { TYPES } from 'src/shared/constants/types';

import { IChatSocketService } from 'src/domain/interfaces/services/IChatSocketService';
import { ISocketConnectionManager } from 'src/domain/interfaces/services/ISocketConnectionManager';
import { ChatSocketService } from 'src/infrastructure/external-services/socket/chat.service';
import { ICreateConversationUseCase } from 'src/domain/interfaces/use-cases/chat/ICreateConversationUseCase';
import { CreateConversationUseCase } from 'src/application/use-cases/chat/create-conversation.use-case';
import { ISendMessageUseCase } from 'src/domain/interfaces/use-cases/chat/ISendMessageUseCase';
import { SendMessageUseCase } from 'src/application/use-cases/chat/send-message.use-case';
import { IGetConversationsUseCase } from 'src/domain/interfaces/use-cases/chat/IGetConversationsUseCase';
import { GetConversationsUseCase } from 'src/application/use-cases/chat/get-conversations.use-case';
import { IGetMessagesUseCase } from 'src/domain/interfaces/use-cases/chat/IGetMessagesUseCase';
import { GetMessagesUseCase } from 'src/application/use-cases/chat/get-messages.use-case';
import { IMarkMessagesAsReadUseCase } from 'src/domain/interfaces/use-cases/chat/IMarkMessagesAsReadUseCase';
import { MarkMessagesAsReadUseCase } from 'src/application/use-cases/chat/mark-messages-as-read.use-case';
import { IDeleteMessageUseCase } from 'src/domain/interfaces/use-cases/chat/IDeleteMessageUseCase';
import { DeleteMessageUseCase } from 'src/application/use-cases/chat/delete-message.use-case';
import { ChatController } from 'src/presentation/controllers/chat/chat.controller';

export function registerChatDi(container: Container): void {
  container.bind<ChatSocketService>(TYPES.ChatSocketService).to(ChatSocketService).inSingletonScope();
  container.bind<ISocketConnectionManager>(TYPES.SocketConnectionManager).toDynamicValue((context) =>
    context.container.get(TYPES.ChatSocketService),
  );
  container.bind<ICreateConversationUseCase>(TYPES.CreateConversationUseCase).to(CreateConversationUseCase);
  container.bind<ISendMessageUseCase>(TYPES.SendMessageUseCase).to(SendMessageUseCase);
  container.bind<IGetConversationsUseCase>(TYPES.GetConversationsUseCase).to(GetConversationsUseCase);
  container.bind<IGetMessagesUseCase>(TYPES.GetMessagesUseCase).to(GetMessagesUseCase);
  container.bind<IMarkMessagesAsReadUseCase>(TYPES.MarkMessagesAsReadUseCase).to(MarkMessagesAsReadUseCase);
  container.bind<IDeleteMessageUseCase>(TYPES.DeleteMessageUseCase).to(DeleteMessageUseCase);
  container.bind<ChatController>(TYPES.ChatController).to(ChatController);
}
