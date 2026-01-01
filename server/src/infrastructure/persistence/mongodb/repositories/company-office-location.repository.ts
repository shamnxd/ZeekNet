import { ICompanyOfficeLocationRepository } from 'src/domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';
import { CompanyOfficeLocationModel, CompanyOfficeLocationDocument } from 'src/infrastructure/persistence/mongodb/models/company-office-location.model';
import { Types } from 'mongoose';
import { CompanyOfficeLocationMapper } from 'src/infrastructure/mappers/persistence/mongodb/company/company-office-location.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

export class CompanyOfficeLocationRepository extends RepositoryBase<CompanyOfficeLocation, CompanyOfficeLocationDocument> implements ICompanyOfficeLocationRepository {
  constructor() {
    super(CompanyOfficeLocationModel);
  }

  protected mapToEntity(doc: CompanyOfficeLocationDocument): CompanyOfficeLocation {
    return CompanyOfficeLocationMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<CompanyOfficeLocation>): Partial<CompanyOfficeLocationDocument> {
    return CompanyOfficeLocationMapper.toDocument(entity as CompanyOfficeLocation);
  }
}

