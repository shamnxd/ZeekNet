import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../../shared/types/authenticated-request';
import { handleValidationError, handleAsyncError, sendSuccessResponse, sendNotFoundResponse, validateUserId, badRequest } from '../../../shared/utils/controller.utils';
import {
  ICreateSeekerProfileUseCase,
  IGetSeekerProfileUseCase,
  IUpdateSeekerProfileUseCase,
  IAddExperienceUseCase,
  IGetExperiencesUseCase,
  IUpdateExperienceUseCase,
  IRemoveExperienceUseCase,
  IAddEducationUseCase,
  IGetEducationUseCase,
  IUpdateEducationUseCase,
  IRemoveEducationUseCase,
  IUpdateSkillsUseCase,
  IUpdateLanguagesUseCase,
  IUploadResumeUseCase,
  IRemoveResumeUseCase,
  IUploadAvatarUseCase,
  IUploadBannerUseCase,
} from '../../../domain/interfaces/use-cases/ISeekerUseCases';
import { SeekerProfileMapper } from '../../../application/mappers/seeker-profile.mapper';
import { 
  CreateSeekerProfileRequestDto, 
  UpdateSeekerProfileRequestDto,
  AddExperienceRequestDto,
  UpdateExperienceRequestDto,
  AddEducationRequestDto,
  UpdateEducationRequestDto,
  UploadResumeRequestDto,
} from '../../../application/dto/seeker/seeker-profile.dto';

export class SeekerProfileController {
  constructor(
    private readonly _createSeekerProfileUseCase: ICreateSeekerProfileUseCase,
    private readonly _getSeekerProfileUseCase: IGetSeekerProfileUseCase,
    private readonly _updateSeekerProfileUseCase: IUpdateSeekerProfileUseCase,
    private readonly _addExperienceUseCase: IAddExperienceUseCase,
    private readonly _getExperiencesUseCase: IGetExperiencesUseCase,
    private readonly _updateExperienceUseCase: IUpdateExperienceUseCase,
    private readonly _removeExperienceUseCase: IRemoveExperienceUseCase,
    private readonly _addEducationUseCase: IAddEducationUseCase,
    private readonly _getEducationUseCase: IGetEducationUseCase,
    private readonly _updateEducationUseCase: IUpdateEducationUseCase,
    private readonly _removeEducationUseCase: IRemoveEducationUseCase,
    private readonly _updateSkillsUseCase: IUpdateSkillsUseCase,
    private readonly _updateLanguagesUseCase: IUpdateLanguagesUseCase,
    private readonly _uploadResumeUseCase: IUploadResumeUseCase,
    private readonly _removeResumeUseCase: IRemoveResumeUseCase,
    private readonly _uploadAvatarUseCase: IUploadAvatarUseCase,
    private readonly _uploadBannerUseCase: IUploadBannerUseCase,
  ) {}

  createSeekerProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const dto = req.body as CreateSeekerProfileRequestDto;
      
      const profileData = SeekerProfileMapper.createProfileDataFromDto(dto);
      const profile = await this._createSeekerProfileUseCase.execute(userId, profileData);

      sendSuccessResponse(res, 'Seeker profile created successfully', profile, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getSeekerProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const profile = await this._getSeekerProfileUseCase.execute(userId);
      sendSuccessResponse(res, 'Seeker profile retrieved successfully', profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateSeekerProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const dto = req.body as UpdateSeekerProfileRequestDto;

      const profileData = SeekerProfileMapper.updateProfileDataFromDto(dto);
      const profile = await this._updateSeekerProfileUseCase.execute(userId, profileData);

      sendSuccessResponse(res, 'Seeker profile updated successfully', profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  addExperience = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const dto = req.body as AddExperienceRequestDto;
      
      const experienceData = SeekerProfileMapper.experienceDataFromDto(dto);
      if (!experienceData.title || !experienceData.company || !experienceData.startDate || !experienceData.employmentType) {
        throw new Error('Missing required fields');
      }

      const experience = await this._addExperienceUseCase.execute(userId, {
        title: experienceData.title,
        company: experienceData.company,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate,
        employmentType: experienceData.employmentType,
        location: experienceData.location,
        description: experienceData.description,
        technologies: experienceData.technologies || [],
        isCurrent: experienceData.isCurrent || false,
      });

      sendSuccessResponse(res, 'Experience added successfully', experience, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getExperiences = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const experiences = await this._getExperiencesUseCase.execute(userId);
      sendSuccessResponse(res, 'Experiences retrieved successfully', experiences);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateExperience = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { experienceId } = req.params;
      const dto = req.body as UpdateExperienceRequestDto;

      const experienceData = SeekerProfileMapper.experienceDataFromDto(dto);
      const experience = await this._updateExperienceUseCase.execute(userId, experienceId, experienceData);

      sendSuccessResponse(res, 'Experience updated successfully', experience);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  removeExperience = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { experienceId } = req.params;

      await this._removeExperienceUseCase.execute(userId, experienceId);
      sendSuccessResponse(res, 'Experience removed successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  addEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const dto = req.body as AddEducationRequestDto;
      
      const educationData = SeekerProfileMapper.educationDataFromDto(dto);
      if (!educationData.school || !educationData.startDate) {
        throw new Error('Missing required fields');
      }

      const education = await this._addEducationUseCase.execute(userId, {
        school: educationData.school,
        degree: educationData.degree,
        fieldOfStudy: educationData.fieldOfStudy,
        startDate: educationData.startDate,
        endDate: educationData.endDate,
        grade: educationData.grade,
      });

      sendSuccessResponse(res, 'Education added successfully', education, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const education = await this._getEducationUseCase.execute(userId);
      sendSuccessResponse(res, 'Education retrieved successfully', education);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { educationId } = req.params;
      const dto = req.body as UpdateEducationRequestDto;

      const educationData = SeekerProfileMapper.educationDataFromDto(dto);
      const education = await this._updateEducationUseCase.execute(userId, educationId, educationData);

      sendSuccessResponse(res, 'Education updated successfully', education);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  removeEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { educationId } = req.params;

      await this._removeEducationUseCase.execute(userId, educationId);
      sendSuccessResponse(res, 'Education removed successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateSkills = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { skills } = req.body;

      const updatedSkills = await this._updateSkillsUseCase.execute(userId, skills);
      sendSuccessResponse(res, 'Skills updated successfully', updatedSkills);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateLanguages = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { languages } = req.body;

      const updatedLanguages = await this._updateLanguagesUseCase.execute(userId, languages);
      sendSuccessResponse(res, 'Languages updated successfully', updatedLanguages);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const dto = req.body as UploadResumeRequestDto;

      const resumeData = SeekerProfileMapper.resumeMetaDataFromDto(dto);
      const resume = await this._uploadResumeUseCase.execute(userId, resumeData);

      sendSuccessResponse(res, 'Resume uploaded successfully', resume, undefined, 201);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  removeResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      await this._removeResumeUseCase.execute(userId);
      sendSuccessResponse(res, 'Resume removed successfully', null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadAvatar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      
      if (!req.file) {
        return badRequest(res, 'No image file provided');
      }

      const profile = await this._uploadAvatarUseCase.execute(
        userId,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

      sendSuccessResponse(res, 'Avatar uploaded successfully', profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadBanner = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      
      if (!req.file) {
        return badRequest(res, 'No image file provided');
      }

      const profile = await this._uploadBannerUseCase.execute(
        userId,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      );

      sendSuccessResponse(res, 'Banner uploaded successfully', profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}