export interface IGetCandidatesUseCase {
  execute(options: {
    page: number;
    limit: number;
    search?: string;
    skills?: string[];
    location?: string;
  }): Promise<{
    candidates: Array<{
      id: string;
      userId: string;
      name: string;
      email: string;
      headline: string | null;
      summary: string | null;
      location: string | null;
      skills: string[];
      avatar: string | null;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
}
