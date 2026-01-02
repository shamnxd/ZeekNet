import { ICompanyTechStackRepository } from 'src/domain/interfaces/repositories/company/ICompanyTechStackRepository';
import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CompanyTechStackModel, CompanyTechStackDocument } from 'src/infrastructure/persistence/mongodb/models/company-tech-stack.model';
import { Types } from 'mongoose';
import { CompanyTechStackMapper } from 'src/infrastructure/mappers/persistence/mongodb/company/company-tech-stack.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

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

