import { ICompanyContactRepository } from '../../../../domain/interfaces/repositories/company/ICompanyContactRepository';
import { CompanyContact } from '../../../../domain/entities/company-contact.entity';
import { CompanyContactModel, CompanyContactDocument } from '../models/company-contact.model';
import { Types } from 'mongoose';
import { CompanyContactMapper } from '../mappers/company-contact.mapper';
import { RepositoryBase } from './base-repository';

export class CompanyContactRepository extends RepositoryBase<CompanyContact, CompanyContactDocument> implements ICompanyContactRepository {
  constructor() {
    super(CompanyContactModel);
  }

  protected mapToEntity(doc: CompanyContactDocument): CompanyContact {
    return CompanyContactMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<CompanyContact>): Partial<CompanyContactDocument> {
    return CompanyContactMapper.toDocument(entity as CompanyContact);
  }
}