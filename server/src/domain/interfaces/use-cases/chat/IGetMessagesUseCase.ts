import { GetMessagesDto } from 'src/application/dtos/chat/requests/get-messages.dto';
import { PaginatedMessagesResponseDto } from 'src/application/dtos/chat/responses/paginated-messages-response.dto';

export interface IGetMessagesUseCase {
    execute(input: GetMessagesDto): Promise<PaginatedMessagesResponseDto>;
}
