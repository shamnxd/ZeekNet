import { JobPosting, JobPostingFilters } from 'src/domain/entities/job-posting.entity';
import { CompanyQueryOptions } from '../company/CompanyQueryOptions';
import { PaginatedCompanies } from '../company/PaginatedCompanies';
import { PaginatedCompaniesWithVerification } from '../company/PaginatedCompaniesWithVerification';
import { AdminJobStats } from './AdminJobStats';
import { Skill } from 'src/domain/entities/skill.entity';
import { PaginatedSkills } from '../skills/PaginatedSkills';
import { JobRole } from 'src/domain/entities/job-role.entity';
import { PaginatedJobRoles } from '../job-roles/PaginatedJobRoles';
import { CompanyWithVerification } from '../company/CompanyWithVerification';
import { MigratePlanSubscribersResult } from '../subscriptions/MigratePlanSubscribersResult';
import { GetAllPaymentOrdersQuery } from '../payments/GetAllPaymentOrdersQuery';
import { PaymentOrderWithDetails } from '../payments/PaymentOrderWithDetails';
import { UserQueryOptions } from '../seeker/UserQueryOptions';
import { PaginatedUsers } from '../seeker/PaginatedUsers';
import { User } from 'src/domain/entities/user.entity';


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
    jobs: {
      id: string;
      title: string;
      companyName: string;
      location: string;
      salary: { min: number; max: number };
      status: string;
      applications: number;
      viewCount: number;
      createdAt: Date;
      employmentTypes: string[];
      categoryIds: string[];
    }[];
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
  execute(jobId: string, status: string, unpublishReason?: string): Promise<JobPosting>;
}

export interface IAdminDeleteJobUseCase {
  execute(jobId: string): Promise<boolean>;
}

export interface IAdminGetJobStatsUseCase {
  execute(): Promise<AdminJobStats>;
}

export interface IUpdateJobStatusUseCase {
  execute(jobId: string, status: string): Promise<JobPosting>;
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

export interface IGetPendingCompaniesUseCase {
  execute(): Promise<PaginatedCompaniesWithVerification>;
}

export interface IGetCompanyByIdUseCase {
  execute(companyId: string): Promise<CompanyWithVerification>;
}

export interface IMigratePlanSubscribersUseCase {
  execute(
    planId: string,
    billingCycle?: 'monthly' | 'yearly' | 'both',
    prorationBehavior?: 'none' | 'create_prorations' | 'always_invoice',
  ): Promise<MigratePlanSubscribersResult>;
}

export interface IGetAllPaymentOrdersUseCase {
  execute(query: GetAllPaymentOrdersQuery): Promise<{
    orders: PaymentOrderWithDetails[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}