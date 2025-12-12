import { CompanyProfile } from 'src/domain/entities/company-profile.entity';
import { CompanyContact } from 'src/domain/entities/company-contact.entity';
import { CompanyOfficeLocation } from 'src/domain/entities/company-office-location.entity';
import { CompanyTechStack } from 'src/domain/entities/company-tech-stack.entity';
import { CompanyBenefits } from 'src/domain/entities/company-benefits.entity';
import { CompanyWorkplacePictures } from 'src/domain/entities/company-workplace-pictures.entity';
import { CompanyVerification } from 'src/domain/entities/company-verification.entity';

export interface GetCompanyProfileResponseDto {
  profile: CompanyProfile;
  contact: CompanyContact | null;
  locations: CompanyOfficeLocation[];
  techStack: CompanyTechStack[];
  benefits: CompanyBenefits[];
  workplacePictures: CompanyWorkplacePictures[];
  verification: CompanyVerification | null;
}
