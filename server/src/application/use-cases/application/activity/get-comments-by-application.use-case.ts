import { IGetCommentsByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/activity/IGetCommentsByApplicationUseCase';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';

export class GetCommentsByApplicationUseCase implements IGetCommentsByApplicationUseCase {
  constructor(private commentRepository: IATSCommentRepository) {}

  async execute(applicationId: string): Promise<ATSComment[]> {
    return await this.commentRepository.findByApplicationId(applicationId);
  }
}

