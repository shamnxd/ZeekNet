import { ICompanyContactRepository } from 'src/domain/interfaces/repositories/company/ICompanyContactRepository';
import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { CompanyContactModel, CompanyContactDocument } from 'src/infrastructure/persistence/mongodb/models/company-contact.model';
import { Types } from 'mongoose';
import { CompanyContactMapper } from 'src/infrastructure/mappers/persistence/mongodb/company/company-contact.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

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

