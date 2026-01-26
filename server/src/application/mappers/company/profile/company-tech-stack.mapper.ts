import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CompanyTechStackResponseDto } from 'src/application/dtos/company/profile/stack/responses/company-tech-stack-response.dto';

export class CompanyTechStackMapper {
  static toResponse(techStack: CompanyTechStack): CompanyTechStackResponseDto {
    return {
      id: techStack.id,
      techStack: techStack.techStack,
      createdAt: techStack.createdAt,
      updatedAt: techStack.updatedAt,
    };
  }

  static toResponseList(techStacks: CompanyTechStack[]): CompanyTechStackResponseDto[] {
    return techStacks.map((techStack) => this.toResponse(techStack));
  }
}


