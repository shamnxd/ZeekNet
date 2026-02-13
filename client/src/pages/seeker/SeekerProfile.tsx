

import { Loader2 } from 'lucide-react';
import { useSeekerProfile } from '@/hooks/use-seeker-profile';
import { ProfileHeader } from '@/components/seeker/profile/ProfileHeader';
import { ProfileAbout } from '@/components/seeker/profile/ProfileAbout';
import { ProfileExperiences } from '@/components/seeker/profile/ProfileExperiences';
import { ProfileEducation } from '@/components/seeker/profile/ProfileEducation';
import { ProfileSkills } from '@/components/seeker/profile/ProfileSkills';
import { ProfileSidebar } from '@/components/seeker/profile/ProfileSidebar';

export default function SeekerProfile() {
  const {
    loading,
    saving,
    profile,
    experiences,
    education,
    profilePhoto,
    bannerImage,

    editBannerOpen,
    setEditBannerOpen,
    bannerCropperOpen,
    setBannerCropperOpen,
    tempBannerImage,
    bannerImageFile,
    handleBannerChange,
    handleEditBanner,
    handleBannerCropComplete,

    editProfileOpen,
    setEditProfileOpen,
    profileCropperOpen,
    setProfileCropperOpen,
    tempProfileImage,
    profilePhotoFile,
    handlePhotoChange,
    handleProfileCropComplete,
    handleEditProfile,
    profileData,
    setProfileData,

    aboutData,
    setAboutData,
    editAboutOpen,
    setEditAboutOpen,
    handleEditAbout,

    experienceData,
    setExperienceData,
    addExperienceOpen,
    setAddExperienceOpen,
    editExperienceOpen,
    setEditExperienceOpen,
    deleteExperienceOpen,
    setDeleteExperienceOpen,
    setEditingExperienceId,
    setExperienceToDelete,
    technologyOptions,
    technologyLoading,
    fetchTechnologies,
    handleAddExperience,
    handleEditExperience,
    handleRemoveExperience,
    confirmRemoveExperience,
    experienceErrors,
    setExperienceErrors,

    educationData,
    setEducationData,
    addEducationOpen,
    setAddEducationOpen,
    editEducationOpen,
    setEditEducationOpen,
    deleteEducationOpen,
    setDeleteEducationOpen,
    setEditingEducationId,
    setEducationToDelete,
    handleAddEducation,
    handleEditEducation,
    handleRemoveEducation,
    confirmRemoveEducation,

    selectedSkills,
    setSelectedSkills,
    skillsOptions,
    skillsLoading,
    fetchSkills,
    addSkillOpen,
    setAddSkillOpen,
    deleteSkillOpen,
    setDeleteSkillOpen,
    skillToDelete,
    setSkillToDelete,
    handleAddSkill,
    handleRemoveSkill,
    confirmRemoveSkill,

    editDetailsOpen,
    setEditDetailsOpen,
    editingEmail,
    setEditingEmail,
    editingPhone,
    setEditingPhone,
    newLanguage,
    setNewLanguage,
    editingLanguages,
    handleAddLanguage,
    handleRemoveLanguage,
    handleEditDetails,
    detailsError,
    setDetailsError,

    editSocialOpen,
    setEditSocialOpen,
    editingSocialLinks,
    setEditingSocialLinks,
    handleEditSocial,
    SOCIAL_PLATFORMS,

    isoToDateInput,
    formatPeriod,
  } = useSeekerProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1100px]">
      <div className="grid grid-cols-[1fr,320px] gap-6">
        <div className="space-y-6">
          <ProfileHeader
            loading={loading}
            saving={saving}
            profile={profile}
            bannerImage={bannerImage}
            profilePhoto={profilePhoto}
            editBannerOpen={editBannerOpen}
            setEditBannerOpen={setEditBannerOpen}
            bannerCropperOpen={bannerCropperOpen}
            setBannerCropperOpen={setBannerCropperOpen}
            tempBannerImage={tempBannerImage}
            bannerImageFile={bannerImageFile}
            handleBannerChange={handleBannerChange}
            handleEditBanner={handleEditBanner}
            handleBannerCropComplete={handleBannerCropComplete}
            editProfileOpen={editProfileOpen}
            setEditProfileOpen={setEditProfileOpen}
            profileCropperOpen={profileCropperOpen}
            setProfileCropperOpen={setProfileCropperOpen}
            tempProfileImage={tempProfileImage}
            profilePhotoFile={profilePhotoFile}
            handlePhotoChange={handlePhotoChange}
            handleProfileCropComplete={handleProfileCropComplete}
            handleEditProfile={handleEditProfile}
            profileData={profileData}
            setProfileData={setProfileData}
          />

          <ProfileAbout
            aboutData={aboutData}
            editAboutOpen={editAboutOpen}
            setEditAboutOpen={setEditAboutOpen}
            setAboutData={setAboutData}
            handleEditAbout={handleEditAbout}
          />

          <ProfileExperiences
            experiences={experiences}
            experienceData={experienceData}
            setExperienceData={setExperienceData}
            addExperienceOpen={addExperienceOpen}
            setAddExperienceOpen={setAddExperienceOpen}
            editExperienceOpen={editExperienceOpen}
            setEditExperienceOpen={setEditExperienceOpen}
            deleteExperienceOpen={deleteExperienceOpen}
            setDeleteExperienceOpen={setDeleteExperienceOpen}
            setEditingExperienceId={setEditingExperienceId}
            setExperienceToDelete={setExperienceToDelete}
            technologyOptions={technologyOptions}
            technologyLoading={technologyLoading}
            fetchTechnologies={fetchTechnologies}
            handleAddExperience={handleAddExperience}
            handleEditExperience={handleEditExperience}
            handleRemoveExperience={handleRemoveExperience}
            confirmRemoveExperience={confirmRemoveExperience}
            experienceErrors={experienceErrors}
            setExperienceErrors={setExperienceErrors}
            saving={saving}
            isoToDateInput={isoToDateInput}
            formatPeriod={formatPeriod}
          />

          <ProfileEducation
            education={education}
            educationData={educationData}
            setEducationData={setEducationData}
            addEducationOpen={addEducationOpen}
            setAddEducationOpen={setAddEducationOpen}
            editEducationOpen={editEducationOpen}
            setEditEducationOpen={setEditEducationOpen}
            deleteEducationOpen={deleteEducationOpen}
            setDeleteEducationOpen={setDeleteEducationOpen}
            setEditingEducationId={setEditingEducationId}
            setEducationToDelete={setEducationToDelete}
            handleAddEducation={handleAddEducation}
            handleEditEducation={handleEditEducation}
            handleRemoveEducation={handleRemoveEducation}
            confirmRemoveEducation={confirmRemoveEducation}
            saving={saving}
            isoToDateInput={isoToDateInput}
            formatPeriod={formatPeriod}
          />

          <ProfileSkills
            skills={profile?.skills || []}
            addSkillOpen={addSkillOpen}
            setAddSkillOpen={setAddSkillOpen}
            deleteSkillOpen={deleteSkillOpen}
            setDeleteSkillOpen={setDeleteSkillOpen}
            skillToDelete={skillToDelete}
            setSkillToDelete={setSkillToDelete}
            selectedSkills={selectedSkills}
            setSelectedSkills={setSelectedSkills}
            skillsOptions={skillsOptions}
            skillsLoading={skillsLoading}
            fetchSkills={fetchSkills}
            saving={saving}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
            confirmRemoveSkill={confirmRemoveSkill}
          />
        </div>

        <ProfileSidebar
          profile={profile}
          editDetailsOpen={editDetailsOpen}
          setEditDetailsOpen={setEditDetailsOpen}
          editingEmail={editingEmail}
          setEditingEmail={setEditingEmail}
          editingPhone={editingPhone}
          setEditingPhone={setEditingPhone}
          newLanguage={newLanguage}
          setNewLanguage={setNewLanguage}
          editingLanguages={editingLanguages}
          handleAddLanguage={handleAddLanguage}
          handleRemoveLanguage={handleRemoveLanguage}
          handleEditDetails={handleEditDetails}
          detailsError={detailsError}
          setDetailsError={setDetailsError}
          editSocialOpen={editSocialOpen}
          setEditSocialOpen={setEditSocialOpen}
          editingSocialLinks={editingSocialLinks}
          setEditingSocialLinks={setEditingSocialLinks}
          handleEditSocial={handleEditSocial}
          SOCIAL_PLATFORMS={SOCIAL_PLATFORMS}
          saving={saving}
        />
      </div>
    </div>
  );
}