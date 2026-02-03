import { JobCategory } from 'src/domain/entities/job-category.entity';
import { JobCategoryResponseDto } from 'src/application/dtos/admin/attributes/job-categorys/responses/job-category-response.dto';

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

