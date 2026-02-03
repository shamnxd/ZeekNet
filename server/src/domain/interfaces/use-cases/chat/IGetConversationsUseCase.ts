import { GetConversationsDto } from 'src/application/dtos/chat/requests/get-conversations.dto';
import { PaginatedConversationsResponseDto } from 'src/application/dtos/chat/responses/paginated-conversations-response.dto';

export interface IGetConversationsUseCase {
    execute(input: GetConversationsDto): Promise<PaginatedConversationsResponseDto>;
}
