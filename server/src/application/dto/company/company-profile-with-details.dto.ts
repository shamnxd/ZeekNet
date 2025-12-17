import { CompanyProfile } from '../../../domain/entities/company-profile.entity';
import { CompanyContact } from '../../../domain/entities/company-contact.entity';
import { CompanyTechStack } from '../../../domain/entities/company-tech-stack.entity';
import { CompanyOfficeLocation } from '../../../domain/entities/company-office-location.entity';
import { CompanyBenefits } from '../../../domain/entities/company-benefits.entity';
import { CompanyWorkplacePictures } from '../../../domain/entities/company-workplace-pictures.entity';
import { CompanyVerification } from '../../../domain/entities/company-verification.entity';

export interface CompanyProfileWithDetailsDto {
  profile: CompanyProfile;
  contact: CompanyContact | null;
  locations: CompanyOfficeLocation[];
  techStack: CompanyTechStack[];
  benefits: CompanyBenefits[];
  workplacePictures: CompanyWorkplacePictures[];
  verification: CompanyVerification | null;
}
