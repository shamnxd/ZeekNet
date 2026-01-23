import { DeleteMessageDto } from 'src/application/dtos/chat/requests/delete-message.dto';
import { DeleteMessageResponseDto } from 'src/application/dtos/chat/responses/delete-message-response.dto';


export interface IDeleteMessageUseCase {
    execute(input: DeleteMessageDto): Promise<DeleteMessageResponseDto | null>;
}
