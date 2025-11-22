import { ICompanyProfileRepository } from '../../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanyProfile } from '../../../../domain/entities/company-profile.entity';
import { CompanyProfileModel, CompanyProfileDocument as ModelDocument } from '../models/company-profile.model';
import { CompanyProfileMapper } from '../mappers/company-profile.mapper';
import { RepositoryBase } from './base-repository';

interface CompanyQuery {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  industry?: string;
  isVerified?: 'pending' | 'rejected' | 'verified';
}

interface PopulatedUser {
  _id: unknown;
  email: string;
  isBlocked: boolean;
}

interface PopulatedCompanyDocument extends Omit<ModelDocument, 'userId'> {
  userId: PopulatedUser | null;
}

export class CompanyProfileRepository extends RepositoryBase<CompanyProfile, ModelDocument> implements ICompanyProfileRepository {
  constructor() {
    super(CompanyProfileModel);
  }

  protected mapToEntity(doc: ModelDocument): CompanyProfile {
    return CompanyProfileMapper.toEntity(doc);
  }

  protected mapToDocument(entity: Partial<CompanyProfile>): Partial<ModelDocument> {
    return CompanyProfileMapper.toDocument(entity as CompanyProfile);
  }

  async getAllCompanies(options: {
    page: number;
    limit: number;
    search?: string;
    industry?: string;
    isVerified?: 'pending' | 'rejected' | 'verified';
    isBlocked?: boolean;
    sortBy?: 'createdAt' | 'companyName' | 'employeeCount';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ companies: CompanyProfile[]; total: number }> {
    const { page, limit, search, industry, isVerified, isBlocked, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const query: CompanyQuery = {};

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
        { organisation: { $regex: search, $options: 'i' } },
      ];
    }

    if (industry) query.industry = industry;
    if (isVerified !== undefined) query.isVerified = isVerified;

    if (isBlocked !== undefined) {
      const allCompaniesDocs = await CompanyProfileModel.find(query)
        .sort({ [sortBy]: sortDirection })
        .populate<{ userId: PopulatedUser | null }>({
          path: 'userId',
          select: 'email isBlocked',
        })
        .exec();

      const allPopulatedDocs = allCompaniesDocs as PopulatedCompanyDocument[];
      const filteredCompanies = allPopulatedDocs.filter((c) => c.userId && c.userId.isBlocked === isBlocked);
      const total = filteredCompanies.length;
      const paginatedCompanies = filteredCompanies.slice(skip, skip + limit);

      const companies = paginatedCompanies.map((doc) => {
        const populatedDoc = doc as PopulatedCompanyDocument;
        
        // Convert populated userId back to string for mapper
        const docWithStringUserId = {
          ...doc,
          userId: populatedDoc.userId && typeof populatedDoc.userId === 'object' 
            ? String(populatedDoc.userId._id || '') 
            : String(populatedDoc.userId || ''),
        } as ModelDocument;
        
        const entity = this.mapToEntity(docWithStringUserId);

        const email = populatedDoc.userId && typeof populatedDoc.userId === 'object' ? populatedDoc.userId.email || '' : '';
        const isBlocked = populatedDoc.userId && typeof populatedDoc.userId === 'object' ? populatedDoc.userId.isBlocked ?? false : false;

        return CompanyProfile.create({
          ...entity,
          email,
          isBlocked,
        });
      });

      return { companies, total };
    } else {
      const [companiesDocs, total] = await Promise.all([
        CompanyProfileModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ [sortBy]: sortDirection })
          .populate<{ userId: PopulatedUser | null }>({
            path: 'userId',
            select: 'email isBlocked',
          })
          .exec(),
        CompanyProfileModel.countDocuments(query),
      ]);

      const populatedDocs = companiesDocs as PopulatedCompanyDocument[];

      const companies = populatedDocs.map((doc) => {
        const populatedDoc = doc as PopulatedCompanyDocument;
        
        // Convert populated userId back to string for mapper
        const docWithStringUserId = {
          ...doc,
          userId: populatedDoc.userId && typeof populatedDoc.userId === 'object' 
            ? String(populatedDoc.userId._id || '') 
            : String(populatedDoc.userId || ''),
        } as ModelDocument;
        
        const entity = this.mapToEntity(docWithStringUserId);

        const email = populatedDoc.userId && typeof populatedDoc.userId === 'object' ? populatedDoc.userId.email || '' : '';
        const isBlocked = populatedDoc.userId && typeof populatedDoc.userId === 'object' ? populatedDoc.userId.isBlocked ?? false : false;

        return CompanyProfile.create({
          ...entity,
          email,
          isBlocked,
        });
      });

      return { companies, total };
    }
  }
}
