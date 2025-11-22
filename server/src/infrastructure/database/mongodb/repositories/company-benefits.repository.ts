import { ICompanyBenefitsRepository } from '../../../../domain/interfaces/repositories/company/ICompanyBenefitsRepository';
import { CompanyBenefits } from '../../../../domain/entities/company-benefits.entity';
import { CompanyBenefitsModel, CompanyBenefitsDocument } from '../models/company-benefits.model';
import { Types } from 'mongoose';
import { CompanyBenefitsMapper } from '../mappers/company-benefits.mapper';
import { RepositoryBase } from './base-repository';

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