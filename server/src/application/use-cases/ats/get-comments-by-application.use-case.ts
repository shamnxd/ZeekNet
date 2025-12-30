import { IGetCommentsByApplicationUseCase } from '../../../domain/interfaces/use-cases/ats/IGetCommentsByApplicationUseCase';
import { IATSCommentRepository } from '../../../domain/interfaces/repositories/ats/IATSCommentRepository';
import { ATSComment } from '../../../domain/entities/ats-comment.entity';

export class GetCommentsByApplicationUseCase implements IGetCommentsByApplicationUseCase {
  constructor(private commentRepository: IATSCommentRepository) {}

  async execute(applicationId: string): Promise<ATSComment[]> {
    return await this.commentRepository.findByApplicationId(applicationId);
  }
}

