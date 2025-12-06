import { z } from 'zod';
import { commonValidations } from '../../../shared/validation/common';

const EmploymentTypeSchema = z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote', 'freelance']);

const SocialLinkSchema = z.object({
  name: z.string().min(1, 'Social link name is required'),
  link: z.string().url('Please enter a valid URL'),
});

export const CreateSeekerProfileDto = z.object({
  headline: z.string().max(100, 'Headline must not exceed 100 characters').optional(),
  summary: z.string().max(2000, 'Summary must not exceed 2000 characters').optional(),
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  phone: commonValidations.phoneNumber.optional(),
  email: commonValidations.email.optional(),
  dateOfBirth: z.string().date('Please enter a valid date of birth').optional(),
  gender: z.string().max(50, 'Gender must not exceed 50 characters').optional(),
  skills: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  socialLinks: z.array(SocialLinkSchema).default([]),
});

export type CreateSeekerProfileRequestDto = z.infer<typeof CreateSeekerProfileDto>;

export const UpdateSeekerProfileDto = z.object({
  headline: z.string().max(100, 'Headline must not exceed 100 characters').optional(),
  summary: z.string().max(2000, 'Summary must not exceed 2000 characters').optional(),
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  phone: commonValidations.phoneNumber.optional(),
  email: commonValidations.email.optional(),
  dateOfBirth: z.string().date('Please enter a valid date of birth').optional(),
  gender: z.string().max(50, 'Gender must not exceed 50 characters').optional(),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  socialLinks: z.array(SocialLinkSchema).optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must not exceed 100 characters').optional(),
});

export type UpdateSeekerProfileRequestDto = z.infer<typeof UpdateSeekerProfileDto>;

export const AddExperienceDto = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters'),
  company: z.string().min(1, 'Company is required').max(100, 'Company must not exceed 100 characters'),
  startDate: z.string().date('Please enter a valid start date'),
  endDate: z.string().date('Please enter a valid end date').optional(),
  employmentType: EmploymentTypeSchema,
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  description: z.string().max(2000, 'Description must not exceed 2000 characters').optional(),
  technologies: z.array(z.string()).default([]),
  isCurrent: z.boolean().default(false),
});

export type AddExperienceRequestDto = z.infer<typeof AddExperienceDto>;

export const UpdateExperienceDto = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must not exceed 100 characters').optional(),
  company: z.string().min(1, 'Company is required').max(100, 'Company must not exceed 100 characters').optional(),
  startDate: z.string().date('Please enter a valid start date').optional(),
  endDate: z.string().date('Please enter a valid end date').optional(),
  employmentType: EmploymentTypeSchema.optional(),
  location: z.string().max(100, 'Location must not exceed 100 characters').optional(),
  description: z.string().max(2000, 'Description must not exceed 2000 characters').optional(),
  technologies: z.array(z.string()).optional(),
  isCurrent: z.boolean().optional(),
});

export type UpdateExperienceRequestDto = z.infer<typeof UpdateExperienceDto>;

export const AddEducationDto = z.object({
  school: z.string().min(1, 'School is required').max(200, 'School must not exceed 200 characters'),
  degree: z.string().max(100, 'Degree must not exceed 100 characters').optional(),
  fieldOfStudy: z.string().max(100, 'Field of study must not exceed 100 characters').optional(),
  startDate: z.string().date('Please enter a valid start date'),
  endDate: z.string().date('Please enter a valid end date').optional(),
  grade: z.string().max(50, 'Grade must not exceed 20 characters').optional(),
});

export type AddEducationRequestDto = z.infer<typeof AddEducationDto>;

export const UpdateEducationDto = z.object({
  school: z.string().min(1, 'School is required').max(200, 'School must not exceed 200 characters').optional(),
  degree: z.string().max(100, 'Degree must not exceed 100 characters').optional(),
  fieldOfStudy: z.string().max(100, 'Field of study must not exceed 100 characters').optional(),
  startDate: z.string().date('Please enter a valid start date').optional(),
  endDate: z.string().date('Please enter a valid end date').optional(),
  grade: z.string().max(50, 'Grade must not exceed 20 characters').optional(),
});

export type UpdateEducationRequestDto = z.infer<typeof UpdateEducationDto>;

export const UpdateSkillsDto = z.object({
  skills: z.array(z.string()).min(0, 'Skills must be an array'),
});

export const UpdateLanguagesDto = z.object({
  languages: z.array(z.string()).min(0, 'Languages must be an array'),
});

export const UploadResumeDto = z.object({
  url: z.string().url('Please enter a valid resume URL'),
  fileName: z.string().min(1, 'File name is required'),
});

export type UploadResumeRequestDto = z.infer<typeof UploadResumeDto>;
