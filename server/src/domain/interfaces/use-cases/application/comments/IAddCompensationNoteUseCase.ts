import { ATSCommentResponseDto } from 'src/application/dtos/application/comments/responses/ats-comment-response.dto';

export interface AddCompensationNoteParamsDto {
    applicationId: string;
    note: string;
    userId: string;
}

export interface IAddCompensationNoteUseCase {
    execute(params: AddCompensationNoteParamsDto): Promise<ATSCommentResponseDto>;
}
