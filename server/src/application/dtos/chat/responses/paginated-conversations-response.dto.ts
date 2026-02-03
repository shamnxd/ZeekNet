import { ConversationResponseDto } from './conversation-response.dto';

export interface PaginatedConversationsResponseDto {
    data: ConversationResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
