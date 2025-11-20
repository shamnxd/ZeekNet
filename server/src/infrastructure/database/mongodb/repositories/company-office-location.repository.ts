import { ICompanyOfficeLocationRepository } from '../../../../domain/interfaces/repositories/company/ICompanyOfficeLocationRepository';
import { CompanyOfficeLocation } from '../../../../domain/entities/company-office-location.entity';
import { CompanyOfficeLocationModel, CompanyOfficeLocationDocument } from '../models/company-office-location.model';
import { Types } from 'mongoose';
import { CompanyOfficeLocationMapper } from '../mappers/company-office-location.mapper';
import { RepositoryBase } from './base-repository';

export class CompanyOfficeLocationRepository extends RepositoryBase<CompanyOfficeLocation, CompanyOfficeLocationDocument> implements ICompanyOfficeLocationRepository {
  constructor() {
    super(CompanyOfficeLocationModel);
  }

  protected mapToEntity(doc: CompanyOfficeLocationDocument): CompanyOfficeLocation {
    return CompanyOfficeLocationMapper.toEntity(doc);
  }
}