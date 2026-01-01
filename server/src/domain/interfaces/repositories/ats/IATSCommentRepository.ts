import { ATSComment } from 'src/domain/entities/ats-comment.entity';

export interface IATSCommentRepository {
  create(comment: ATSComment): Promise<ATSComment>;
  findById(id: string): Promise<ATSComment | null>;
  findByApplicationId(applicationId: string): Promise<ATSComment[]>;
  delete(id: string): Promise<boolean>;
}
