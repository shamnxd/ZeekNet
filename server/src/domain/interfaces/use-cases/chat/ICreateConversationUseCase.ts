import { CreateConversationDto } from 'src/application/dtos/chat/requests/create-conversation.dto';
import { ConversationResponseDto } from 'src/application/dtos/chat/responses/conversation-response.dto';

export interface ICreateConversationUseCase {
    execute(input: CreateConversationDto): Promise<ConversationResponseDto>;
}
