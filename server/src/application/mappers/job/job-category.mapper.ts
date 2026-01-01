import { JobCategory } from '../../../domain/entities/job-category.entity';

export interface JobCategoryResponseDto {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class JobCategoryMapper {
  static toResponse(category: JobCategory): JobCategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  static toResponseList(categories: JobCategory[]): JobCategoryResponseDto[] {
    return categories.map((category) => this.toResponse(category));
  }
}

