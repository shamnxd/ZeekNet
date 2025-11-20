import { ICompanyTechStackRepository } from '../../../../domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { CompanyTechStack } from '../../../../domain/entities/company-tech-stack.entity';
import { CompanyTechStackModel, CompanyTechStackDocument } from '../models/company-tech-stack.model';
import { Types } from 'mongoose';
import { CompanyTechStackMapper } from '../mappers/company-tech-stack.mapper';
import { RepositoryBase } from './base-repository';

export class CompanyTechStackRepository extends RepositoryBase<CompanyTechStack, CompanyTechStackDocument> implements ICompanyTechStackRepository {
  constructor() {
    super(CompanyTechStackModel);
  }

  protected mapToEntity(doc: CompanyTechStackDocument): CompanyTechStack {
    return CompanyTechStackMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<CompanyTechStack>): Partial<CompanyTechStackDocument> {
    return CompanyTechStackMapper.toDocument(entity as CompanyTechStack);
  }
}