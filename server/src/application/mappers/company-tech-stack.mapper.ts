import { CompanyTechStack } from '../../domain/entities/company-tech-stack.entity';

export class CompanyTechStackMapper {
  static toResponse(techStack: CompanyTechStack): { id: string; techStack: string } {
    return {
      id: techStack.id,
      techStack: techStack.techStack,
    };
  }

  static toResponseList(techStacks: CompanyTechStack[]): Array<{ id: string; techStack: string }> {
    return techStacks.map((techStack) => this.toResponse(techStack));
  }
}

