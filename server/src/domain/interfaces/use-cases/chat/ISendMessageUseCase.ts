import { SendMessageDto } from 'src/application/dtos/chat/requests/send-message.dto';
import { SendMessageResponseDto } from 'src/application/dtos/chat/responses/send-message-response.dto';

export interface ISendMessageUseCase {
    execute(input: SendMessageDto): Promise<SendMessageResponseDto>;
}
