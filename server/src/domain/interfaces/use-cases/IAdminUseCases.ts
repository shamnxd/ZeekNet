import { User } from '../../entities/user.entity';
import { CompanyProfile } from '../../entities/company-profile.entity';
import { JobPosting, PaginatedJobPostings, JobPostingFilters } from '../../entities/job-posting.entity';
import { Skill } from '../../entities/skill.entity';
import { JobRole } from '../../entities/job-role.entity';
import { JobPostingResponseDto } from '../../../application/dto/job-posting/job-posting-response.dto';

export interface PaginatedSkills {
  data: Skill[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedJobRoles {
  data: JobRole[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompanyWithVerification {
  id: string;
  userId: string;
  companyName: string;
  logo: string;
  websiteLink: string;
  employeeCount: number;
  industry: string;
  organisation: string;
  aboutUs: string;
  isVerified: 'pending' | 'rejected' | 'verified';
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  verification?: {
    taxId: string;
    businessLicenseUrl: string;
  };
}

export interface PaginatedCompanies {
  companies: CompanyProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedCompaniesWithVerification {
  companies: CompanyWithVerification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isBlocked?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CompanyQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  isVerified?: 'pending' | 'rejected' | 'verified';
  isBlocked?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IAdminLoginUseCase {
  execute(email: string, password: string): Promise<AuthResponse>;
}

export interface IGetAllUsersUseCase {
  execute(options: UserQueryOptions): Promise<PaginatedUsers>;
}

export interface IBlockUserUseCase {
  execute(userId: string, isBlocked: boolean): Promise<void>;
}

export interface IAdminGetUserByIdUseCase {
  execute(userId: string): Promise<User>;
}

export interface IGetAllCompaniesUseCase {
  execute(options: CompanyQueryOptions): Promise<PaginatedCompanies>;
}

export interface IGetCompaniesWithVerificationUseCase {
  execute(options: CompanyQueryOptions): Promise<PaginatedCompaniesWithVerification>;
}

export interface IVerifyCompanyUseCase {
  execute(companyId: string, isVerified: 'pending' | 'rejected' | 'verified', rejectionReason?: string): Promise<void>;
}

export interface IAdminGetAllJobsUseCase {
  execute(query: JobPostingFilters): Promise<{
    jobs: JobPostingResponseDto[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>;
}

export interface IAdminGetJobByIdUseCase {
  execute(jobId: string): Promise<JobPosting>;
}

export interface IAdminUpdateJobStatusUseCase {
  execute(jobId: string, isActive: boolean, unpublishReason?: string): Promise<JobPosting>;
}

export interface IAdminDeleteJobUseCase {
  execute(jobId: string): Promise<boolean>;
}

export interface AdminJobStats {
  total: number;
  active: number;
  inactive: number;
  totalApplications: number;
  totalViews: number;
}

export interface IAdminGetJobStatsUseCase {
  execute(): Promise<AdminJobStats>;
}

export interface IGetJobByIdUseCase {
  execute(jobId: string): Promise<JobPosting>;
}

export interface IGetJobStatsUseCase {
  execute(): Promise<AdminJobStats>;
}

export interface IUpdateJobStatusUseCase {
  execute(jobId: string, isActive: boolean): Promise<JobPosting>;
}

export interface IDeleteJobUseCase {
  execute(jobId: string): Promise<boolean>;
}

export interface ICreateSkillUseCase {
  execute(name: string): Promise<Skill>;
}

export interface IGetAllSkillsUseCase {
  execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedSkills>;
}

export interface IGetSkillByIdUseCase {
  execute(skillId: string): Promise<Skill>;
}

export interface IUpdateSkillUseCase {
  execute(skillId: string, name: string): Promise<Skill>;
}

export interface IDeleteSkillUseCase {
  execute(skillId: string): Promise<boolean>;
}

export interface ICreateJobRoleUseCase {
  execute(name: string): Promise<JobRole>;
}

export interface IGetAllJobRolesUseCase {
  execute(options: { page?: number; limit?: number; search?: string }): Promise<PaginatedJobRoles>;
}

export interface IGetJobRoleByIdUseCase {
  execute(jobRoleId: string): Promise<JobRole>;
}

export interface IUpdateJobRoleUseCase {
  execute(jobRoleId: string, name: string): Promise<JobRole>;
}

export interface IDeleteJobRoleUseCase {
  execute(jobRoleId: string): Promise<boolean>;
}