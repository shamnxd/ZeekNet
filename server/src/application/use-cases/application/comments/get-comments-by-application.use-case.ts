import { IGetCommentsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/comments/IGetCommentsByApplicationUseCase';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';
import { GetCommentsByApplicationParamsDto } from 'src/application/dtos/application/comments/requests/get-comments-by-application-params.dto';
import { ATSCommentResponseDto } from 'src/application/dtos/application/comments/responses/ats-comment-response.dto';
import { ATSCommentMapper } from 'src/application/mappers/ats/ats-comment.mapper';

export class GetCommentsByApplicationUseCase implements IGetCommentsByApplicationUseCase {
  constructor(private commentRepository: IATSCommentRepository) { }

  async execute(params: GetCommentsByApplicationParamsDto): Promise<ATSCommentResponseDto[]> {
    const comments = await this.commentRepository.findByApplicationId(params.applicationId);
    return ATSCommentMapper.toResponseList(comments);
  }
}
