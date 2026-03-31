import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CompanyProfileModel, CompanyProfileDocument as ModelDocument } from 'src/infrastructure/persistence/mongodb/models/company-profile.model';
import { CompanyProfileMapper } from 'src/infrastructure/mappers/persistence/mongodb/company/company-profile.mapper';
import { JobPostingModel } from 'src/infrastructure/persistence/mongodb/models/job-posting.model';
import { RepositoryBase } from 'src/infrastructure/persistence/mongodb/repositories/base-repository';

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
    sortBy?: 'createdAt' | 'companyName' | 'employeeCount' | 'activeJobCount';
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

    if (isBlocked !== undefined || sortBy === 'activeJobCount') {
      const allCompaniesDocs = await CompanyProfileModel.find(query)
        .populate<{ userId: PopulatedUser | null }>({
          path: 'userId',
          select: 'email isBlocked',
        })
        .exec();

      let allPopulatedDocs = allCompaniesDocs as PopulatedCompanyDocument[];

      if (isBlocked !== undefined) {
        allPopulatedDocs = allPopulatedDocs.filter((c) => c.userId && c.userId.isBlocked === isBlocked);
      }

      if (sortBy === 'activeJobCount') {
        const companyIds = allPopulatedDocs.map(d => d._id);
        const jobCounts = await JobPostingModel.aggregate([
          {
            $match: {
              status: 'active',
              company_id: { $in: companyIds },
            },
          },
          { $group: { _id: '$company_id', count: { $sum: 1 } } },
        ]);

        const jobCountMap = new Map(jobCounts.map(j => [String(j._id), j.count]));

        allPopulatedDocs.sort((a, b) => {
          const countA = jobCountMap.get(String(a._id)) || 0;
          const countB = jobCountMap.get(String(b._id)) || 0;
          return (countA - countB) * sortDirection;
        });
      } else {
        allPopulatedDocs.sort((a, b) => {
          const valA = (a as unknown as Record<string, unknown>)[sortBy] as number | string || 0;
          const valB = (b as unknown as Record<string, unknown>)[sortBy] as number | string || 0;

          if (valA < valB) return -1 * sortDirection;
          if (valA > valB) return 1 * sortDirection;
          return 0;
        });
      }

      const total = allPopulatedDocs.length;
      const paginatedCompanies = allPopulatedDocs.slice(skip, skip + limit);

      const companies = paginatedCompanies.map((doc) => {
        const populatedDoc = doc as PopulatedCompanyDocument;

        const docWithStringUserId = {
          ...doc.toObject(),
          _id: doc._id,
          userId:
            populatedDoc.userId && typeof populatedDoc.userId === 'object'
              ? String(populatedDoc.userId._id || '')
              : String(populatedDoc.userId || ''),
        } as ModelDocument;

        const entity = this.mapToEntity(docWithStringUserId);

        const email = populatedDoc.userId && typeof populatedDoc.userId === 'object' ? populatedDoc.userId.email || '' : '';
        const isBlockedVal = populatedDoc.userId && typeof populatedDoc.userId === 'object' ? populatedDoc.userId.isBlocked ?? false : false;

        return CompanyProfile.create({
          id: entity.id,
          userId: entity.userId,
          companyName: entity.companyName,
          logo: entity.logo,
          banner: entity.banner,
          websiteLink: entity.websiteLink,
          employeeCount: entity.employeeCount,
          industry: entity.industry,
          organisation: entity.organisation,
          aboutUs: entity.aboutUs,
          isVerified: entity.isVerified,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          email,
          isBlocked: isBlockedVal,
          foundedDate: entity.foundedDate,
          phone: entity.phone,
          rejectionReason: entity.rejectionReason,
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

        const docWithStringUserId = {
          ...doc.toObject(),
          _id: doc._id,
          userId:
            populatedDoc.userId && typeof populatedDoc.userId === 'object'
              ? String(populatedDoc.userId._id || '')
              : String(populatedDoc.userId || ''),
        } as ModelDocument;

        const entity = this.mapToEntity(docWithStringUserId);

        const email = populatedDoc.userId && typeof populatedDoc.userId === 'object' ? populatedDoc.userId.email || '' : '';
        const isBlocked = populatedDoc.userId && typeof populatedDoc.userId === 'object' ? populatedDoc.userId.isBlocked ?? false : false;

        return CompanyProfile.create({
          id: entity.id,
          userId: entity.userId,
          companyName: entity.companyName,
          logo: entity.logo,
          banner: entity.banner,
          websiteLink: entity.websiteLink,
          employeeCount: entity.employeeCount,
          industry: entity.industry,
          organisation: entity.organisation,
          aboutUs: entity.aboutUs,
          isVerified: entity.isVerified,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          email,
          isBlocked,
          foundedDate: entity.foundedDate,
          phone: entity.phone,
          rejectionReason: entity.rejectionReason,
        });
      });

      return { companies, total };
    }
  }

  async findByIds(ids: string[]): Promise<CompanyProfile[]> {
    const docs = await CompanyProfileModel.find({ _id: { $in: ids } }).exec();
    return docs.map(doc => this.mapToEntity(doc));
  }

  async countTotal(): Promise<number> {
    return CompanyProfileModel.countDocuments();
  }

  async countByVerificationStatus(status: 'pending' | 'rejected' | 'verified'): Promise<number> {
    return CompanyProfileModel.countDocuments({ isVerified: status });
  }

  async getLocationStats(): Promise<{ country: string; count: number }[]> {
    return [];
  }
}

