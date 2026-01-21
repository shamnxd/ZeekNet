import { IGetCommentsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/comments/IGetCommentsByApplicationUseCase';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { GetCommentsByApplicationParamsDto } from 'src/application/dtos/application/comments/requests/get-comments-by-application-params.dto';

export class GetCommentsByApplicationUseCase implements IGetCommentsByApplicationUseCase {
  constructor(private commentRepository: IATSCommentRepository) { }

  async execute(params: GetCommentsByApplicationParamsDto): Promise<ATSComment[]> {
    return await this.commentRepository.findByApplicationId(params.applicationId);
  }
}
