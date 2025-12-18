import { EmploymentType } from '../enums/employment-type.enum';
import { JobStatus } from '../enums/job-status.enum';
import { Salary } from '../interfaces/salary.interface';
import { Types } from 'mongoose';

export interface PopulatedCompany {
  _id: Types.ObjectId;
  companyName: string;
  logo: string;
}


export class JobPosting {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly responsibilities: string[],
    public readonly qualifications: string[],
    public readonly niceToHaves: string[],
    public readonly benefits: string[],
    public readonly salary: Salary,
    public readonly employmentTypes: EmploymentType[],
    public readonly location: string,
    public readonly skillsRequired: string[],
    public readonly categoryIds: string[],
    public readonly status: JobStatus,
    public readonly isFeatured: boolean,
    public readonly viewCount: number,
    public readonly applicationCount: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly companyName?: string,
    public readonly companyLogo?: string,
    public readonly unpublishReason?: string,
  ) {}

  static create(data: {
    id: string;
    companyId: string;
    title: string;
    description: string;
    responsibilities: string[];
    qualifications: string[];
    niceToHaves?: string[];
    benefits?: string[];
    salary: Salary;
    employmentTypes: EmploymentType[];
    location: string;
    skillsRequired: string[];
    categoryIds: string[];
    status?: JobStatus;
    isFeatured?: boolean;
    viewCount?: number;
    applicationCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
    companyName?: string;
    companyLogo?: string;
    unpublishReason?: string;
  }): JobPosting {
    const now = new Date();
    return new JobPosting(
      data.id,
      data.companyId,
      data.title,
      data.description,
      data.responsibilities,
      data.qualifications,
      data.niceToHaves ?? [],
      data.benefits ?? [],
      data.salary,
      data.employmentTypes,
      data.location,
      data.skillsRequired,
      data.categoryIds,
      data.status ?? JobStatus.ACTIVE,
      data.isFeatured ?? false,
      data.viewCount ?? 0,
      data.applicationCount ?? 0,
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.companyName,
      data.companyLogo,
      data.unpublishReason,
    );
  }
}