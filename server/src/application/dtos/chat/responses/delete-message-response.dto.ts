import { ChatMessageResponseDto } from './chat-message-response.dto';
import { ConversationResponseDto } from './conversation-response.dto';

export interface DeleteMessageResponseDto {
    message: ChatMessageResponseDto;
    conversation: ConversationResponseDto | null;
}
