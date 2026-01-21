import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { GetCommentsByApplicationParamsDto } from 'src/application/dtos/application/comments/requests/get-comments-by-application-params.dto';

export interface IGetCompensationNotesUseCase {
    execute(params: GetCommentsByApplicationParamsDto): Promise<ATSComment[]>;
}
