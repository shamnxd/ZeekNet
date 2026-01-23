import { ChatMessageResponseDto } from './chat-message-response.dto';

export interface PaginatedMessagesResponseDto {
    data: ChatMessageResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
