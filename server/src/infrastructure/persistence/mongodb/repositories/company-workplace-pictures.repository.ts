import { ICompanyWorkplacePicturesRepository } from 'src/domain/interfaces/repositories/company/ICompanyWorkplacePicturesRepository';
import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { CompanyWorkplacePicturesModel, CompanyWorkplacePicturesDocument } from 'src/infrastructure/persistence/mongodb/models/company-workplace-pictures.model';
import { Types } from 'mongoose';
import { CompanyWorkplacePicturesMapper } from 'src/infrastructure/mappers/persistence/mongodb/company/company-workplace-pictures.mapper';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

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

