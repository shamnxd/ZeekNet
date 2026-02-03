import { MarkMessagesAsReadDto } from 'src/application/dtos/chat/requests/mark-messages-as-read.dto';
import { ConversationResponseDto } from 'src/application/dtos/chat/responses/conversation-response.dto';


export interface IMarkMessagesAsReadUseCase {
    execute(input: MarkMessagesAsReadDto): Promise<ConversationResponseDto>;
}
