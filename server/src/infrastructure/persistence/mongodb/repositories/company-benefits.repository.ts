import { ICompanyBenefitsRepository } from 'src/domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CompanyBenefitsModel, CompanyBenefitsDocument } from 'src/infrastructure/persistence/mongodb/models/company-benefits.model';
import { Types } from 'mongoose';
import { CompanyBenefitsMapper } from 'src/infrastructure/mappers/persistence/mongodb/company/company-benefits.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

export class CompanyBenefitsRepository extends RepositoryBase<CompanyBenefits, CompanyBenefitsDocument> implements ICompanyBenefitsRepository {
  constructor() {
    super(CompanyBenefitsModel);
  }

  protected mapToEntity(doc: CompanyBenefitsDocument): CompanyBenefits {
    return CompanyBenefitsMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<CompanyBenefits>): Partial<CompanyBenefitsDocument> {
    return CompanyBenefitsMapper.toDocument(entity as CompanyBenefits);
  }
}

