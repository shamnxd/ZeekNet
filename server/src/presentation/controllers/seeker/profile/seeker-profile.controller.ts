import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from 'src/shared/types/authenticated-request';
import { ICreateSeekerProfileUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/info/ICreateSeekerProfileUseCase';
import { IGetSeekerProfileUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/info/IGetSeekerProfileUseCase';
import { IUpdateSeekerProfileUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/info/IUpdateSeekerProfileUseCase';
import { IAddExperienceUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/experience/IAddExperienceUseCase';
import { IGetExperiencesUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/experience/IGetExperiencesUseCase';
import { IUpdateExperienceUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/experience/IUpdateExperienceUseCase';
import { IRemoveExperienceUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/experience/IRemoveExperienceUseCase';
import { IAddEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IAddEducationUseCase';
import { IGetEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IGetEducationUseCase';
import { IUpdateEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IUpdateEducationUseCase';
import { IRemoveEducationUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/education/IRemoveEducationUseCase';
import { IUpdateSkillsUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/skills/IUpdateSkillsUseCase';
import { IUpdateLanguagesUseCase } from 'src/domain/interfaces/use-cases/seeker/profile/languages/IUpdateLanguagesUseCase';
import { IUploadResumeUseCase } from 'src/domain/interfaces/use-cases/seeker/media/IUploadResumeUseCase';
import { IRemoveResumeUseCase } from 'src/domain/interfaces/use-cases/seeker/media/IRemoveResumeUseCase';
import { IUploadAvatarUseCase } from 'src/domain/interfaces/use-cases/seeker/media/IUploadAvatarUseCase';
import { IUploadBannerUseCase } from 'src/domain/interfaces/use-cases/seeker/media/IUploadBannerUseCase';
import { AddExperienceRequestDto } from 'src/application/dtos/seeker/profile/experience/requests/add-experience-request.dto';
import { UpdateExperienceRequestDto } from 'src/application/dtos/seeker/profile/experience/requests/update-experience-request.dto';
import { AddEducationRequestDto } from 'src/application/dtos/seeker/profile/education/requests/add-education-request.dto';
import { UpdateEducationRequestDto } from 'src/application/dtos/seeker/profile/education/requests/update-education-request.dto';
import { UploadResumeRequestDto } from 'src/application/dtos/seeker/media/requests/seeker-profile.dto';
import { CreateSeekerProfileRequestDtoSchema } from 'src/application/dtos/seeker/profile/info/requests/create-seeker-profile-request.dto';
import { UpdateSeekerProfileRequestDtoSchema } from 'src/application/dtos/seeker/profile/info/requests/update-seeker-profile-request.dto';
import { formatZodErrors, handleAsyncError, sendSuccessResponse, sendCreatedResponse, validateUserId, badRequest, handleValidationError } from 'src/shared/utils';
import { SUCCESS, VALIDATION } from 'src/shared/constants/messages';

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
  ) { }

  createSeekerProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = CreateSeekerProfileRequestDtoSchema.omit({ userId: true });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const profile = await this._createSeekerProfileUseCase.execute({ ...parsed.data, userId });

      sendCreatedResponse(res, SUCCESS.CREATED('Seeker profile'), profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getSeekerProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const profile = await this._getSeekerProfileUseCase.execute(userId);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Seeker profile'), profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateSeekerProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      const bodySchema = UpdateSeekerProfileRequestDtoSchema.omit({ userId: true });
      const parsed = bodySchema.safeParse(req.body);

      if (!parsed.success) {
        return handleValidationError(formatZodErrors(parsed.error), next);
      }

      const profile = await this._updateSeekerProfileUseCase.execute({ ...parsed.data, userId });

      sendSuccessResponse(res, SUCCESS.UPDATED('Seeker profile'), profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  addExperience = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const dto = req.body as AddExperienceRequestDto;

      const experience = await this._addExperienceUseCase.execute({ ...dto, userId });

      sendCreatedResponse(res, SUCCESS.CREATED('Experience'), experience);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getExperiences = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const experiences = await this._getExperiencesUseCase.execute(userId);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Experiences'), experiences);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateExperience = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { experienceId } = req.params;
      const dto = req.body as UpdateExperienceRequestDto;

      const experience = await this._updateExperienceUseCase.execute({ ...dto, userId, experienceId });

      sendSuccessResponse(res, SUCCESS.UPDATED('Experience'), experience);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  removeExperience = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { experienceId } = req.params;

      await this._removeExperienceUseCase.execute(userId, experienceId);
      sendSuccessResponse(res, SUCCESS.DELETED('Experience'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  addEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const dto = req.body as AddEducationRequestDto;

      const education = await this._addEducationUseCase.execute(userId, dto);

      sendCreatedResponse(res, SUCCESS.CREATED('Education'), education);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  getEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const education = await this._getEducationUseCase.execute(userId);
      sendSuccessResponse(res, SUCCESS.RETRIEVED('Education'), education);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { educationId } = req.params;
      const dto = req.body as UpdateEducationRequestDto;

      const education = await this._updateEducationUseCase.execute({ ...dto, userId, educationId });

      sendSuccessResponse(res, SUCCESS.UPDATED('Education'), education);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  removeEducation = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { educationId } = req.params;

      await this._removeEducationUseCase.execute(userId, educationId);
      sendSuccessResponse(res, SUCCESS.DELETED('Education'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateSkills = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { skills } = req.body;

      const updatedSkills = await this._updateSkillsUseCase.execute(userId, skills);
      sendSuccessResponse(res, SUCCESS.UPDATED('Skills'), updatedSkills);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  updateLanguages = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const { languages } = req.body;

      const updatedLanguages = await this._updateLanguagesUseCase.execute(userId, languages);
      sendSuccessResponse(res, SUCCESS.UPDATED('Languages'), updatedLanguages);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);
      const dto = req.body as UploadResumeRequestDto;

      const resume = await this._uploadResumeUseCase.execute({ ...dto, userId });

      sendCreatedResponse(res, SUCCESS.CREATED('Resume'), resume);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  removeResume = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      await this._removeResumeUseCase.execute(userId);
      sendSuccessResponse(res, SUCCESS.DELETED('Resume'), null);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadAvatar = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      if (!req.file) {
        return badRequest(res, VALIDATION.REQUIRED('Avatar file'));
      }

      const profile = await this._uploadAvatarUseCase.execute({
        userId,
        fileBuffer: req.file.buffer,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
      });

      sendSuccessResponse(res, SUCCESS.UPDATED('Avatar'), profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };

  uploadBanner = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = validateUserId(req);

      if (!req.file) {
        return badRequest(res, VALIDATION.REQUIRED('Banner file'));
      }

      const profile = await this._uploadBannerUseCase.execute({
        userId,
        fileBuffer: req.file.buffer,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
      });

      sendSuccessResponse(res, SUCCESS.UPDATED('Banner'), profile);
    } catch (error) {
      handleAsyncError(error, next);
    }
  };
}

