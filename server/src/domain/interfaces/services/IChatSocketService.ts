import { ChatMessageResponseDto } from 'src/application/dtos/chat/responses/chat-message-response.dto';
import { ConversationResponseDto } from 'src/application/dtos/chat/responses/conversation-response.dto';

export interface IChatSocketService {
    setIO(io: import('socket.io').Server): void;
    emitMessageDelivered(message: ChatMessageResponseDto, conversation: ConversationResponseDto): void;
    emitMessageDeleted(message: ChatMessageResponseDto, conversation: ConversationResponseDto): void;
    emitMessagesRead(conversationId: string, readerId: string, otherParticipantId: string): void;
    emitTyping(conversationId: string, senderId: string, receiverId: string): void;
}
