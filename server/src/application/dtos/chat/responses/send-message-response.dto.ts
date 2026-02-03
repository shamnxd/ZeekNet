import { ChatMessageResponseDto } from './chat-message-response.dto';
import { ConversationResponseDto } from './conversation-response.dto';

export interface SendMessageResponseDto {
    conversation: ConversationResponseDto;
    message: ChatMessageResponseDto;
}
