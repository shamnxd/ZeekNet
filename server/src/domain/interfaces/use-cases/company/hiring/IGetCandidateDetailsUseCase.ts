import { SeekerProfile, Experience, Education } from 'src/domain/entities/seeker-profile.entity';

export interface CandidateDetails {
  profile: SeekerProfile;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  experiences: Experience[];
  educations: Education[];
}

export interface IGetCandidateDetailsUseCase {
  execute(params: { id: string }): Promise<CandidateDetails>;
}
