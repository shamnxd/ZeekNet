import { 
  CompanyProfileDto, 
  CompanyContactDto, 
  CompanyOfficeLocationDto, 
  CompanyTechStackDto, 
  CompanyBenefitsDto, 
  CompanyWorkplacePicturesDto, 
  CompanyVerificationDto, 
} from 'src/application/dtos/company/profile/common/company-profile-fragments.dto';

export interface CompanyProfileWithDetailsDto {
  profile: CompanyProfileDto;
  contact: CompanyContactDto | null;
  locations: CompanyOfficeLocationDto[];
  techStack: CompanyTechStackDto[];
  benefits: CompanyBenefitsDto[];
  workplacePictures: CompanyWorkplacePicturesDto[];
  verification: CompanyVerificationDto | null;
}
