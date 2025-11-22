import { ICompanyWorkplacePicturesRepository } from '../../../../domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from '../../../../domain/entities/company-workplace-pictures.entity';
import { CompanyWorkplacePicturesModel, CompanyWorkplacePicturesDocument } from '../models/company-workplace-pictures.model';
import { Types } from 'mongoose';
import { CompanyWorkplacePicturesMapper } from '../mappers/company-workplace-pictures.mapper';
import { RepositoryBase } from './base-repository';

export class CompanyWorkplacePicturesRepository extends RepositoryBase<CompanyWorkplacePictures, CompanyWorkplacePicturesDocument> implements ICompanyWorkplacePicturesRepository {
  constructor() {
    super(CompanyWorkplacePicturesModel);
  }

  protected mapToEntity(doc: CompanyWorkplacePicturesDocument): CompanyWorkplacePictures {
    return CompanyWorkplacePicturesMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<CompanyWorkplacePictures>): Partial<CompanyWorkplacePicturesDocument> {
    return CompanyWorkplacePicturesMapper.toDocument(entity as CompanyWorkplacePictures);
  }
}