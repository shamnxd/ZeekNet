import { z } from 'zod';

const CompanyContactDto = z.object({
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number'),
  twitter_link: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  facebook_link: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

const OfficeLocationDto = z.object({
  location: z.string().min(1, 'Location is required').min(2, 'Location must be at least 2 characters').max(100, 'Location must be less than 100 characters'),
  office_name: z.string().min(1, 'Company name is required').min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters'),
  address: z.string().min(1, 'Location is required').min(2, 'Location must be at least 2 characters').max(100, 'Location must be less than 100 characters'),
  is_headquarters: z.boolean().default(false),
});

const TechStackDto = z.object({
  tech_stack: z.string().min(1, 'Industry is required').min(2, 'Industry must be at least 2 characters').max(50, 'Industry must be less than 50 characters'),
});

const PerksAndBenefitsDto = z.object({
  perk: z.string().min(1, 'Industry is required').min(2, 'Industry must be at least 2 characters').max(50, 'Industry must be less than 50 characters'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
});

const WorkplacePictureDto = z.object({
  picture_url: z.string().url('Please enter a valid URL'),
  caption: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
});

const CompanyProfileDto = z.object({
  company_name: z.string().min(1, 'Company name is required').min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters'),
  logo: z.string().url('Please enter a valid URL'),
  banner: z.string().url('Please enter a valid URL'),
  website_link: z.string().url('Please enter a valid URL'),
  employee_count: z.number().int().positive('Must be a positive integer'),
  industry: z.string().min(1, 'Industry is required').min(2, 'Industry must be at least 2 characters').max(50, 'Industry must be less than 50 characters'),
  about_us: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
});

const CreateCompanyProfileDto = z.object({
  profile: CompanyProfileDto,
  contact: CompanyContactDto,
  office_locations: z.array(OfficeLocationDto).min(1),
  tech_stacks: z.array(TechStackDto).min(1),
  perks_and_benefits: z.array(PerksAndBenefitsDto).min(1),
  workplace_pictures: z.array(WorkplacePictureDto).min(1),
});

export const SimpleCompanyProfileDto = z.object({
  company_name: z.string().min(1, 'Company name is required').min(2, 'Company name must be at least 2 characters').max(100, 'Company name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  industry: z.string().min(1, 'Industry is required').min(2, 'Industry must be at least 2 characters').max(50, 'Industry must be less than 50 characters'),
  organisation: z.string().min(1, 'Organisation type is required'),
  location: z.string().min(1, 'Location is required').min(2, 'Location must be at least 2 characters').max(100, 'Location must be less than 100 characters'),
  employees: z.string().min(1, 'Employee count is required').refine((val) => {
    const validOptions = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
    return validOptions.includes(val);
  }, 'Please select a valid employee count range'),
  description: z.string().min(1, 'Description is required').min(10, 'Description must be at least 10 characters').max(1000, 'Description must be less than 1000 characters'),
  logo: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  business_license: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  tax_id: z.string().min(1, 'Tax ID is required').min(3, 'Tax ID must be at least 3 characters').max(20, 'Tax ID must be less than 20 characters'),
});

const UpdateCompanyProfileDto = z.object({
  profile: CompanyProfileDto.partial(),
  contact: CompanyContactDto.partial().optional(),
  office_locations: z.array(OfficeLocationDto).optional(),
  tech_stacks: z.array(TechStackDto).optional(),
  perks_and_benefits: z.array(PerksAndBenefitsDto).optional(),
  workplace_pictures: z.array(WorkplacePictureDto).optional(),
});

export type SimpleCompanyProfileRequestDto = z.infer<typeof SimpleCompanyProfileDto>;
