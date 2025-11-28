import { useState, useEffect } from 'react';
import { MapPin, Pencil, Plus, Globe, Mail, Phone, Trash2, X } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Loading } from '../../components/ui/loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Checkbox } from '../../components/ui/checkbox';
import { Combobox, type ComboboxOption } from '../../components/ui/combobox';
import FormDialog from '../../components/common/FormDialog';
import { ImageCropper } from '../../components/common/ImageCropper';
import { toast } from 'sonner';
import { seekerApi, type SeekerProfile as SeekerProfileType, type Experience, type Education } from '../../api/seeker.api';
import { publicApi } from '../../api/public.api';
import type { Area } from 'react-easy-crop';

export function SeekerProfile() {
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editBannerOpen, setEditBannerOpen] = useState(false);
  const [bannerCropperOpen, setBannerCropperOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileCropperOpen, setProfileCropperOpen] = useState(false);
  const [editAboutOpen, setEditAboutOpen] = useState(false);
  const [addExperienceOpen, setAddExperienceOpen] = useState(false);
  const [editExperienceOpen, setEditExperienceOpen] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [addEducationOpen, setAddEducationOpen] = useState(false);
  const [editEducationOpen, setEditEducationOpen] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [editSocialOpen, setEditSocialOpen] = useState(false);

  const [profile, setProfile] = useState<SeekerProfileType | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);

  const [tempBannerImage, setTempBannerImage] = useState<string>('');
  const [tempProfileImage, setTempProfileImage] = useState<string>('');

  const [bannerImage, setBannerImage] = useState<string>('');
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  
  const [profileData, setProfileData] = useState({
    name: '',
    headline: '',
    location: '',
    dateOfBirth: '',
    gender: '',
  });

  const [aboutData, setAboutData] = useState('');

  const [experienceData, setExperienceData] = useState({
    title: '',
    company: '',
    employmentType: 'full-time',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    technologies: [] as string[],
    isCurrent: false,
  });

  const [educationData, setEducationData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    grade: '',
  });


  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillsOptions, setSkillsOptions] = useState<ComboboxOption[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');

  const [technologyOptions, setTechnologyOptions] = useState<ComboboxOption[]>([]);
  const [technologyLoading, setTechnologyLoading] = useState(false); 
  const [editingSocialLinks, setEditingSocialLinks] = useState<Array<{ name: string; link: string }>>([]);
  const [editingLanguages, setEditingLanguages] = useState<string[]>([]);
  const [editingPhone, setEditingPhone] = useState<string>('');
  const [editingEmail, setEditingEmail] = useState<string>('');
  const [deleteExperienceOpen, setDeleteExperienceOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);
  const [deleteEducationOpen, setDeleteEducationOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState<string | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [deleteSkillOpen, setDeleteSkillOpen] = useState(false);

  const SOCIAL_PLATFORMS = [
    { value: 'github', label: 'GitHub' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'behance', label: 'Behance' },
    { value: 'dribbble', label: 'Dribbble' },
    { value: 'medium', label: 'Medium' },
    { value: 'custom', label: 'Custom' },
  ];

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileResponse = await seekerApi.getProfile();

                  if (profileResponse.success && profileResponse.data) {
                    const profileData = profileResponse.data;
                    setProfile(profileData);
                    setProfilePhoto(profileData.avatarUrl || '');
                    setBannerImage(profileData.bannerUrl || '');
                    const dateOfBirthValue = profileData.dateOfBirth 
                      ? (() => {
                          try {
                            const date = new Date(profileData.dateOfBirth);
                            if (isNaN(date.getTime())) return '';
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                          } catch {
                            return '';
                          }
                        })()
                      : '';
                    setProfileData({
                      name: profileData.name || '',
                      headline: profileData.headline || '',
                      location: profileData.location || '',
                      dateOfBirth: dateOfBirthValue,
                      gender: profileData.gender || '',
                    });
                    setAboutData(profileData.summary || '');
                    setEditingPhone(profileData.phone || '');
                    setEditingEmail(profileData.email || '');
                    setEditingLanguages(profileData.languages || []);

                    setExperiences(profileData.experiences || []);
                    setEducation(profileData.education || []);
                  }
    } catch {
      toast.error('Failed to load profile data, please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setTempBannerImage(imageUrl);
        setEditBannerOpen(false);
        setBannerCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleBannerCropComplete = async (_croppedAreaPixels: Area, croppedImage: string) => {
    try {
      setSaving(true);
      
      const file = dataURLtoFile(croppedImage, `banner-${Date.now()}.png`);
      const response = await seekerApi.uploadBanner(file);
      if (response.success && response.data) {
        setBannerImage(response.data.bannerUrl || croppedImage);
        toast.success('Banner updated successfully');
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to update banner');
      }
    } catch {
      toast.error('Failed to update banner');
    } finally {
      setBannerImageFile(null);
      setBannerCropperOpen(false);
      setSaving(false);
    }
  };

  const handleEditBanner = () => {
    setEditBannerOpen(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setTempProfileImage(imageUrl);
        setEditProfileOpen(false);
        setProfileCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileCropComplete = async (_croppedAreaPixels: Area, croppedImage: string) => {
    try {
      setSaving(true);
      
      const file = dataURLtoFile(croppedImage, `avatar-${Date.now()}.png`);
      const response = await seekerApi.uploadAvatar(file);
      if (response.success && response.data) {
        setProfilePhoto(response.data.avatarUrl || croppedImage);
        toast.success('Profile photo updated successfully');
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to update profile photo');
      }
    } catch {
      toast.error('Failed to update profile photo');
    } finally {
      setProfilePhotoFile(null);
      setProfileCropperOpen(false);
      setSaving(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      setSaving(true);

      const response = await seekerApi.updateProfile({
        name: profileData.name,
        headline: profileData.headline,
        location: profileData.location,
        dateOfBirth: profileData.dateOfBirth || undefined,
        gender: profileData.gender || undefined,
      });
      if (response.success) {
        toast.success('Profile updated successfully');
        setEditProfileOpen(false);
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleEditAbout = async () => {
    try {
      setSaving(true);
      const response = await seekerApi.updateProfile({
        summary: aboutData,
      });
      if (response.success) {
        toast.success('About section updated successfully');
        setEditAboutOpen(false);
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to update about section');
      }
    } catch {
      toast.error('Failed to update about section');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExperience = async () => {
    try {
      setSaving(true);
      const response = await seekerApi.addExperience({
        title: experienceData.title,
        company: experienceData.company,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate || undefined,
        employmentType: experienceData.employmentType,
        location: experienceData.location || undefined,
        description: experienceData.description || undefined,
        technologies: experienceData.technologies,
        isCurrent: experienceData.isCurrent,
      });
      if (response.success) {
        toast.success('Experience added successfully');
        setAddExperienceOpen(false);
        setExperienceData({
          title: '',
          company: '',
          employmentType: 'full-time',
          startDate: '',
          endDate: '',
          location: '',
          description: '',
          technologies: [],
          isCurrent: false,
        });
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to add experience');
      }
    } catch {
      toast.error('Failed to add experience');
    } finally {
      setSaving(false);
    }
  };

  const handleEditExperience = async () => {
    if (!editingExperienceId) return;
    try {
      setSaving(true);
      const response = await seekerApi.updateExperience(editingExperienceId, {
        title: experienceData.title,
        company: experienceData.company,
        startDate: experienceData.startDate,
        endDate: experienceData.endDate || undefined,
        employmentType: experienceData.employmentType,
        location: experienceData.location || undefined,
        description: experienceData.description || undefined,
        technologies: experienceData.technologies,
        isCurrent: experienceData.isCurrent,
      });
      if (response.success) {
        toast.success('Experience updated successfully');
        setEditExperienceOpen(false);
        setEditingExperienceId(null);
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to update experience');
      }
    } catch {
      toast.error('Failed to update experience, please refresh the page and try again');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveExperience = (experienceId: string) => {
    setExperienceToDelete(experienceId);
    setDeleteExperienceOpen(true);
  };

  const confirmRemoveExperience = async () => {
    if (!experienceToDelete) return;
    try {
      setSaving(true);
      const response = await seekerApi.removeExperience(experienceToDelete);
      if (response.success) {
        toast.success('Experience removed successfully');
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to remove experience');
      }
    } catch {
      toast.error('Failed to remove experience');
    } finally {
      setSaving(false);
      setDeleteExperienceOpen(false);
      setExperienceToDelete(null);
    }
  };

  const handleAddEducation = async () => {
    try {
      setSaving(true);
      const response = await seekerApi.addEducation({
        school: educationData.school,
        degree: educationData.degree || undefined,
        fieldOfStudy: educationData.fieldOfStudy || undefined,
        startDate: educationData.startDate,
        endDate: educationData.endDate || undefined,
        grade: educationData.grade || undefined,
      });
      if (response.success) {
        toast.success('Education added successfully');
        setAddEducationOpen(false);
        setEducationData({
          school: '',
          degree: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          grade: '',
        });
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to add education');
      }
    } catch {
      toast.error('Failed to add education');
    } finally {
      setSaving(false);
    }
  };

  const handleEditEducation = async () => {
    if (!editingEducationId) return;
    try {
      setSaving(true);
      const response = await seekerApi.updateEducation(editingEducationId, {
        school: educationData.school,
        degree: educationData.degree || undefined,
        fieldOfStudy: educationData.fieldOfStudy || undefined,
        startDate: educationData.startDate,
        endDate: educationData.endDate || undefined,
        grade: educationData.grade || undefined,
      });
      if (response.success) {
        toast.success('Education updated successfully');
        setEditEducationOpen(false);
        setEditingEducationId(null);
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to update education');
      }
    } catch {
      toast.error('Failed to update education');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveEducation = (educationId: string) => {
    setEducationToDelete(educationId);
    setDeleteEducationOpen(true);
  };

  const confirmRemoveEducation = async () => {
    if (!educationToDelete) return;
    try {
      setSaving(true);
      const response = await seekerApi.removeEducation(educationToDelete);
      if (response.success) {
        toast.success('Education removed successfully');
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to remove education');
      }
    } catch {
      toast.error('Failed to remove education');
    } finally {
      setSaving(false);
      setDeleteEducationOpen(false);
      setEducationToDelete(null);
    }
  };

  const fetchSkills = async (searchTerm?: string) => {
    try {
      setSkillsLoading(true);
      const response = await publicApi.getAllSkills({
        limit: 20,
        search: searchTerm,
      });
      if (response.success && response.data) {
        const options: ComboboxOption[] = response.data.map((skillName: string) => ({
          value: skillName,
          label: skillName,
        }));
        setSkillsOptions(options);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setSkillsLoading(false);
    }
  };

  const fetchTechnologies = async (searchTerm?: string) => {
    try {
      setTechnologyLoading(true);
      const response = await publicApi.getAllSkills({
        limit: 20,
        search: searchTerm,
      });
      if (response.success && response.data) {
        const options: ComboboxOption[] = response.data.map((skillName: string) => ({
          value: skillName,
          label: skillName,
        }));
        setTechnologyOptions(options);
      }
    } catch (error) {
      console.error('Failed to fetch technologies:', error);
    } finally {
      setTechnologyLoading(false);
    }
  };

  useEffect(() => {
    if (addSkillOpen) {
      fetchSkills();
      if (profile?.skills) {
        setSelectedSkills(profile.skills);
      }
    }
  }, [addSkillOpen]);

  useEffect(() => {
    if (addExperienceOpen || editExperienceOpen) {
      fetchTechnologies();
    }
  }, [addExperienceOpen, editExperienceOpen]);

  const handleAddSkill = async () => {
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill');
      return;
    }
    if (!profile) {
      toast.error('Profile not loaded');
      return;
    }
    try {
      setSaving(true);
      const response = await seekerApi.updateSkills(selectedSkills);
      if (response.success) {
        toast.success('Skills updated successfully');
        setAddSkillOpen(false);
        setSelectedSkills([]);
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to update skills');
      }
    } catch {
      toast.error('Failed to update skills');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSkill = async (skill: string) => {
    setSkillToDelete(skill);
    setDeleteSkillOpen(true);
  };

  const confirmRemoveSkill = async () => {
    if (!profile || !skillToDelete) return;
    try {
      setSaving(true);
      const updatedSkills = profile.skills.filter((s: string) => s !== skillToDelete);
      const response = await seekerApi.updateSkills(updatedSkills);
      if (response.success) {
        toast.success('Skill removed successfully');
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to remove skill');
      }
    } catch {
      toast.error('Failed to remove skill');
    } finally {
      setSaving(false);
      setDeleteSkillOpen(false);
      setSkillToDelete(null);
    }
  };

  const handleAddLanguage = () => {
    if (!newLanguage.trim()) {
      toast.error('Please enter a language name');
      return;
    }
    const trimmed = newLanguage.trim();
    if (editingLanguages.includes(trimmed)) {
      toast.error('This language is already added');
      return;
    }
    setEditingLanguages([...editingLanguages, trimmed]);
    setNewLanguage('');
  };

  const handleRemoveLanguage = (language: string) => {
    setEditingLanguages(editingLanguages.filter(lang => lang !== language));
  };

  const handleEditDetails = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      
      const updateData: {
        phone?: string;
        email?: string;
      } = {};

      let hasChanges = false;
      
      if (editingPhone !== profile.phone) {
        updateData.phone = editingPhone || undefined;
        hasChanges = true;
      }

      if (editingEmail !== profile.email) {
        if (!editingEmail.trim()) {
          toast.error('Email is required');
          setSaving(false);
          return;
        }
        updateData.email = editingEmail.trim();
        hasChanges = true;
      }

      const updatePromises = [];
      
      if (Object.keys(updateData).length > 0) {
        updatePromises.push(seekerApi.updateProfile(updateData));
      }

      const currentLanguages = profile.languages || [];
      const languagesChanged = JSON.stringify(editingLanguages.sort()) !== JSON.stringify(currentLanguages.sort());
      
      if (languagesChanged) {
        updatePromises.push(seekerApi.updateLanguages(editingLanguages));
        hasChanges = true;
      }

      if (hasChanges && updatePromises.length > 0) {
        await Promise.all(updatePromises);
        toast.success('Contact details updated successfully');
        setEditDetailsOpen(false);
        fetchProfileData();
      } else {
        setEditDetailsOpen(false);
      }
    } catch {
      toast.error('Failed to update contact details');
    } finally {
      setSaving(false);
    }
  };

  const handleEditSocial = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      
      const validLinks = editingSocialLinks
        .filter(link => link.name?.trim() && link.link?.trim())
        .map(link => ({
          name: SOCIAL_PLATFORMS.find(p => p.value === link.name?.toLowerCase()) 
            ? link.name.toLowerCase() 
            : link.name.trim(),
          link: link.link.startsWith('http') ? link.link : `https://${link.link}`,
        }));

      const response = await seekerApi.updateProfile({
        socialLinks: validLinks,
      });
      if (response.success) {
        toast.success('Social links updated successfully');
        setEditSocialOpen(false);
        fetchProfileData();
      } else {
        toast.error(response.message || 'Failed to update social links');
      }
    } catch {
      toast.error('Failed to update social links');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (editSocialOpen && profile) {
      const links = profile.socialLinks || [];
      
      setEditingSocialLinks(links.length > 0 ? links : [{ name: '', link: '' }]);
    }
    if (editDetailsOpen && profile) {
      setEditingPhone(profile.phone || '');
      setEditingEmail(profile.email || '');
      setEditingLanguages(profile.languages || []);
    }
  }, [editSocialOpen, editDetailsOpen, profile]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const formatPeriod = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = formatDate(startDate);
    if (isCurrent) {
      return `${start} - Present`;
    }
    if (endDate) {
      const end = formatDate(endDate);
      return `${start} - ${end}`;
    }
    return start;
  };

  const isoToDateInput = (isoDate: string): string => {
    if (!isoDate) return '';
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return '';
    }
  };

  if (loading) {
    return (
      <div className="p-10 max-w-7xl mx-auto flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        <div className="lg:col-span-2 space-y-5">
          
          <Card className="!py-0 border border-[#d6ddeb] overflow-hidden">
            <div className="h-[140px] relative overflow-hidden">
              <img 
                src={bannerImage || 'https://rerouting.ca/wp-content/uploads/2020/12/2.png'} 
                alt="Profile Banner" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <Button 
                variant="seekerOutline" 
                size="sm" 
                className="absolute top-5 right-5 h-8 w-8 bg-white/20 border-white/30 text-white hover:bg-white/80 hover:text-black backdrop-blur-sm !rounded-full"
                onClick={() => setEditBannerOpen(true)}
              >
                <Pencil className="w-3 h-3" />
              </Button>
            </div>
            <div className="px-5 pb-5 relative">
              <div className="flex items-end gap-5 -mt-25 mb-3">
                <div className="w-[112px] h-[112px] rounded-full border-[3px] border-white bg-gradient-to-br from-[#26a4ff] to-[#4640de] overflow-hidden flex items-center justify-center">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile Photo" className="w-full h-full object-cover rounded-full" onError={(e) => {
                      
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement?.querySelector('.fallback-avatar')?.classList.remove('hidden');
                    }} />
                  ) : null}
                  <div className={`fallback-avatar w-full h-full flex items-center justify-center text-white text-3xl font-bold ${profilePhoto ? 'hidden' : ''}`}>
                    {profile?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-[19px] text-[#25324b] font-extrabold leading-[1.2]">
                    {profile?.name || 'Your Name'}
                  </h2>
                  {profile?.headline && (
                    <p className="text-[14px] text-[#7c8493]">
                      {profile.headline}
                    </p>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-2 font-medium text-[#7c8493]">
                      <MapPin className="w-4 h-4" />
                      <span className="text-[14px]">{profile.location}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="seekerOutline" 
                  className="border-[#ccccf5] text-[#4640de] text-[13px] px-4 py-2"
                  onClick={() => setEditProfileOpen(true)}
                  disabled={saving}
                >  
                  <Pencil className="w-3 h-3 mr-2" />
                  <p className="text-[13px] font-bold">
                    Edit Profile
                  </p>
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-5 !gap-0 border border-[#d6ddeb]">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-[16px] text-[#25324b]">
                About Me
              </p>
              <Button 
                variant="seekerOutline" 
                size="sm" 
                className="h-8 w-8 !rounded-full"
                onClick={() => setEditAboutOpen(true)}
              >
                <Pencil className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-3 text-[#515b6f] text-[13px] leading-[1.6]">
              {aboutData ? (
                <p className="whitespace-pre-wrap">{aboutData}</p>
              ) : (
                <p className="text-[#7c8493] italic">No about information yet. Click edit to add your story.</p>
              )}
            </div>
          </Card>

          <Card className="!gap-0 !p-0 border border-[#d6ddeb]">
            <div className="p-5 flex items-center justify-between border-b border-[#d6ddeb]">
              <p className="font-bold text-[16px] text-[#25324b]">
                Experiences
              </p>
              <Button 
                variant="seekerOutline" 
                size="sm" 
                className="h-8 w-8 !rounded-full"
                onClick={() => {
                  setExperienceData({
                    title: '',
                    company: '',
                    employmentType: 'full-time',
                    startDate: '',
                    endDate: '',
                    location: '',
                    description: '',
                    technologies: [],
                    isCurrent: false,
                  });
                  setAddExperienceOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="divide-y divide-[#d6ddeb]">
              {experiences.length === 0 ? (
                <div className="p-6 text-center text-[#7c8493] text-[13px]">
                  No experiences yet. Click the + button to add your first experience.
                </div>
              ) : (
                experiences.map((exp) => (
                  <div key={exp.id} className="p-6 flex gap-5">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {exp.company[0]?.toUpperCase() || 'E'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-[14px] text-[#25324b] mb-1">
                            {exp.title}
                          </p>
                          <div className="flex items-center gap-2 text-[13px] text-[#7c8493] mb-1">
                            <span className="font-medium text-[#25324b]">
                              {exp.company}
                            </span>
                            <span>•</span>
                            <span>{exp.employmentType}</span>
                            <span>•</span>
                            <span>{formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                          </div>
                          {exp.location && (
                            <p className="text-[13px] text-[#7c8493]">
                              {exp.location}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="seekerOutline" 
                            size="sm" 
                            className="h-8 w-8 !rounded-full"
                            onClick={() => {
                              const expData = experiences.find(e => e.id === exp.id);
                              if (expData) {
                                setExperienceData({
                                  title: expData.title,
                                  company: expData.company,
                                  employmentType: expData.employmentType,
                                  startDate: isoToDateInput(expData.startDate),
                                  endDate: expData.endDate ? isoToDateInput(expData.endDate) : '',
                                  location: expData.location || '',
                                  description: expData.description || '',
                                  technologies: expData.technologies || [],
                                  isCurrent: expData.isCurrent,
                                });
                                setEditingExperienceId(exp.id);
                                setEditExperienceOpen(true);
                              }
                            }}
                            disabled={saving}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="seekerOutline" 
                            size="sm" 
                            className="h-8 w-8 !rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveExperience(exp.id)}
                            disabled={saving}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      {exp.description && (
                        <p className="text-[13px] text-[#25324b] mt-2">
                          {exp.description}
                        </p>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {exp.technologies.map((tech, idx) => (
                            <Badge key={idx} variant="skill" className="text-[11px]">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="!gap-0 !p-0 border border-[#d6ddeb]">
            <div className="p-5 flex items-center justify-between border-b border-[#d6ddeb]">
              <p className="font-bold text-[16px] text-[#25324b]">
                Educations
              </p>
              <Button 
                variant="seekerOutline" 
                size="sm" 
                className="h-8 w-8 !rounded-full"
                onClick={() => {
                  setEducationData({
                    school: '',
                    degree: '',
                    fieldOfStudy: '',
                    startDate: '',
                    endDate: '',
                    grade: '',
                  });
                  setAddEducationOpen(true);
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="divide-y divide-[#d6ddeb]">
              {education.length === 0 ? (
                <div className="p-6 text-center text-[#7c8493] text-[13px]">
                  No education records yet. Click the + button to add your first education.
                </div>
              ) : (
                education.map((edu) => (
                  <div key={edu.id} className="p-6 flex gap-5">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {edu.school[0]?.toUpperCase() || 'E'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-bold text-[14px] text-[#25324b] mb-1">
                            {edu.school}
                          </p>
                          {edu.degree && (
                            <p className="text-[13px] font-medium text-[#7c8493] mb-1">
                              {edu.degree}
                            </p>
                          )}
                          {edu.fieldOfStudy && (
                            <p className="text-[13px] text-[#7c8493] mb-1">
                              {edu.fieldOfStudy}
                            </p>
                          )}
                          <p className="text-[13px] text-[#7c8493]">
                            {formatPeriod(edu.startDate, edu.endDate)}
                          </p>
                          {edu.grade && (
                            <p className="text-[13px] text-[#7c8493] mt-1">
                              Grade: {edu.grade}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="seekerOutline" 
                            size="sm" 
                            className="h-8 w-8 !rounded-full"
                            onClick={() => {
                              const eduData = education.find(e => e.id === edu.id);
                              if (eduData) {
                                setEducationData({
                                  school: eduData.school,
                                  degree: eduData.degree || '',
                                  fieldOfStudy: eduData.fieldOfStudy || '',
                                  startDate: isoToDateInput(eduData.startDate),
                                  endDate: eduData.endDate ? isoToDateInput(eduData.endDate) : '',
                                  grade: eduData.grade || '',
                                });
                                setEditingEducationId(edu.id);
                                setEditEducationOpen(true);
                              }
                            }}
                            disabled={saving}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button 
                            variant="seekerOutline" 
                            size="sm" 
                            className="h-8 w-8 !rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRemoveEducation(edu.id)}
                            disabled={saving}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-5 !gap-0 border border-[#d6ddeb]">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-[16px] text-[#25324b]">Skills</p>
              <div className="flex gap-2">
                <Button 
                  variant="seekerOutline" 
                  size="sm" 
                  className="h-8 w-8 !rounded-full"
                  onClick={() => setAddSkillOpen(true)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill: string, idx: number) => (
                  <Badge
                    key={`${skill}-${idx}`}
                    variant="skill"
                    className="cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-1"
                    onClick={() => handleRemoveSkill(skill)}
                    title="Click to remove"
                  >
                    {skill}
                    <X className="w-3 h-3" />
                  </Badge>
                ))
              ) : (
                <p className="text-[#7c8493] text-[13px] italic">No skills added yet. Click the + button to add skills.</p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          
          <Card className="p-5 !gap-0 border border-[#d6ddeb]">
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-[16px] text-[#25324b]">
                Additional Details
              </p>
              <Button 
                variant="seekerOutline" 
                size="sm" 
                className="h-8 w-8 !rounded-full"
                onClick={() => setEditDetailsOpen(true)}
              >
                <Pencil className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-3">
              {profile?.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-[#7c8493] mb-1">Contact Email</p>
                    <p className="text-[13px] font-medium text-[#25324b]">
                      {profile.email}
                    </p>
                  </div>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-[#7c8493] mb-1">Phone</p>
                    <p className="text-[13px] font-medium text-[#25324b]">
                      {profile.phone}
                    </p>
                  </div>
                </div>
              )}
              {profile?.languages && profile.languages.length > 0 && (
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-[#7c8493] mb-1">Languages</p>
                    <p className="text-[13px] font-medium text-[#25324b]">
                      {profile.languages.join(', ')}
                    </p>
                  </div>
                </div>
              )}
              {(!profile?.email && !profile?.phone && (!profile?.languages || profile.languages.length === 0)) && (
                <p className="text-[#7c8493] text-[13px] italic">No contact details added yet.</p>
              )}
            </div>
          </Card>

          <Card className="p-5 !gap-0 border border-[#d6ddeb]">
            <div className="flex items-center justify-between mb-5">
              <p className="font-bold text-[16px] text-[#25324b]">
                Social Links
              </p>
              <Button 
                variant="seekerOutline" 
                size="sm" 
                className="h-8 w-8 !rounded-full"
                onClick={() => setEditSocialOpen(true)}
              >
                <Pencil className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-3">
              {profile?.socialLinks && profile.socialLinks.length > 0 ? (
                profile.socialLinks.map((link: { name: string; link: string }, idx: number) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#7c8493] flex-shrink-0" />
                    <div>
                      <p className="text-[13px] font-medium text-[#7c8493] mb-1 capitalize">
                        {link.name}
                      </p>
                      <a 
                        href={link.link.startsWith('http') ? link.link : `https://${link.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] text-[#4640de] font-medium hover:underline cursor-pointer"
                      >
                        {link.link}
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#7c8493] text-[13px] italic">No social links added yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <FormDialog
        open={editBannerOpen}
        onOpenChange={setEditBannerOpen}
        title="Change Banner"
        onSubmit={handleEditBanner}
        maxWidth="2xl"
      >
        
        <div className="flex flex-col items-center gap-4 pb-4 border-b border-[#e5e7eb]">
          <div className="w-full max-w-md">
            <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-[#e5e7eb] bg-gradient-to-br from-[#f8f9ff] to-[#e5e7eb]">
              <img 
                src={bannerImage} 
                alt="Banner Preview" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="mt-4 text-center">
              <Label htmlFor="banner-upload" className="cursor-pointer">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#4640de] text-white rounded-lg hover:bg-[#3b37c7] transition-colors">
                  <Pencil className="w-4 h-4" />
                  <span className="text-[14px] font-bold">Upload New Banner</span>
                </div>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </Label>
              <p className="text-[12px] text-[#6b7280] mt-2">
                {bannerImageFile ? bannerImageFile.name : 'Recommended size: 1200x300px'}
              </p>
            </div>
          </div>
        </div>
      </FormDialog>

      <FormDialog
        open={editProfileOpen}
        onOpenChange={setEditProfileOpen}
        title="Edit Profile"
        fields={[
          {
            id: 'name',
            label: 'Full Name',
            value: profileData.name,
            onChange: (value) => setProfileData({ ...profileData, name: value }),
            placeholder: 'e.g., John Doe',
            required: true,
            validation: {
              required: 'Name is required',
              maxLength: { value: 100, message: 'Name must not exceed 100 characters' },
            },
          },
          {
            id: 'headline',
            label: 'Headline',
            value: profileData.headline,
            onChange: (value) => setProfileData({ ...profileData, headline: value }),
            placeholder: 'e.g., Senior Software Engineer',
            validation: {
              maxLength: { value: 100, message: 'Headline must not exceed 100 characters' },
            },
          },
          {
            id: 'location',
            label: 'Location',
            value: profileData.location,
            onChange: (value) => setProfileData({ ...profileData, location: value }),
            placeholder: 'e.g., New York, NY',
            validation: {
              maxLength: { value: 100, message: 'Location must not exceed 100 characters' },
            },
          },
          {
            id: 'dateOfBirth',
            label: 'Date of Birth',
            type: 'date',
            value: profileData.dateOfBirth,
            onChange: (value) => setProfileData({ ...profileData, dateOfBirth: value }),
            validation: {
              validate: (value) => {
                if (!value) return true;
                const date = new Date(value);
                const today = new Date();
                const minDate = new Date();
                minDate.setFullYear(today.getFullYear() - 100);
                
                if (date > today) {
                  return 'Date of birth cannot be in the future';
                }
                if (date < minDate) {
                  return 'Please enter a valid date of birth';
                }
                return true;
              },
            },
          },
        ]}
        onSubmit={handleEditProfile}
        maxWidth="2xl"
      >
        <div className="flex flex-col items-center gap-4 pb-4 border-b border-[#e5e7eb]">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-[#26a4ff] to-[#4640de] overflow-hidden shadow-lg flex items-center justify-center">
              {profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  alt="Profile Photo" 
                  className="w-full h-full object-cover rounded-full" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : null}
              <div className={`w-full h-full flex items-center justify-center text-white text-2xl font-bold ${profilePhoto ? 'hidden' : ''}`}>
                {profile?.name?.[0]?.toUpperCase() || profile?.headline?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <label
              htmlFor="profile-photo-upload"
              className="absolute bottom-0 right-0 w-8 h-8 bg-[#4640de] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3b37c7] transition-colors shadow-md"
            >
              <Pencil className="w-4 h-4 text-white" />
              <input
                id="profile-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
          <div className="text-center">
            <p className="text-[14px] font-medium text-[#25324b] mb-1">Profile Photo</p>
            <p className="text-[12px] text-[#6b7280]">
              {profilePhotoFile ? profilePhotoFile.name : 'Click the icon to upload a new photo'}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={profileData.gender || 'prefer-not-to-say'} onValueChange={(value) => setProfileData({ ...profileData, gender: value === 'prefer-not-to-say' ? '' : value })}>
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormDialog>

      <FormDialog
        open={editAboutOpen}
        onOpenChange={setEditAboutOpen}
        title="Edit About Me"
        fields={[
          {
            id: 'about',
            label: 'About Me',
            type: 'textarea',
            rows: 6,
            value: aboutData,
            onChange: (value) => setAboutData(value),
            validation: {
              maxLength: { value: 2000, message: 'Summary must not exceed 2000 characters' },
            },
          },
        ]}
        onSubmit={handleEditAbout}
        maxWidth="2xl"
      />

      <Dialog open={addExperienceOpen} onOpenChange={setAddExperienceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="!text-lg !font-bold">Add Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exp-title">Job Title</Label>
              <Input
                id="exp-title"
                value={experienceData.title}
                onChange={(e) => setExperienceData({ ...experienceData, title: e.target.value })}
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-company">Company</Label>
              <Input
                id="exp-company"
                value={experienceData.company}
                onChange={(e) => setExperienceData({ ...experienceData, company: e.target.value })}
                placeholder="e.g., Google"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-description">Description</Label>
              <Textarea
                id="exp-description"
                rows={4}
                value={experienceData.description}
                onChange={(e) => setExperienceData({ ...experienceData, description: e.target.value })}
                placeholder="Describe your role and responsibilities..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exp-type">Employment Type</Label>
                <Input
                  id="exp-type"
                  value={experienceData.employmentType}
                  onChange={(e) => setExperienceData({ ...experienceData, employmentType: e.target.value })}
                  placeholder="e.g., full-time, part-time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-location">Location</Label>
                <Input
                  id="exp-location"
                  value={experienceData.location}
                  onChange={(e) => setExperienceData({ ...experienceData, location: e.target.value })}
                  placeholder="e.g., Remote, New York, NY"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exp-start">Start Date</Label>
                <Input
                  id="exp-start"
                  type="date"
                  value={experienceData.startDate}
                  onChange={(e) => setExperienceData({ ...experienceData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-end">End Date</Label>
                <Input
                  id="exp-end"
                  type="date"
                  value={experienceData.endDate}
                  onChange={(e) => setExperienceData({ ...experienceData, endDate: e.target.value })}
                  disabled={experienceData.isCurrent}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="exp-current"
                checked={experienceData.isCurrent}
                onCheckedChange={(checked) => {
                  setExperienceData({ 
                    ...experienceData, 
                    isCurrent: checked === true,
                    endDate: checked === true ? '' : experienceData.endDate
                  });
                }}
              />
              <Label htmlFor="exp-current" className="text-sm font-normal cursor-pointer">
                I currently work here
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-technologies">Technologies / Skills Learned</Label>
              <Combobox
                options={technologyOptions}
                value={experienceData.technologies}
                onChange={(technologies) => setExperienceData({ ...experienceData, technologies })}
                placeholder="Type to search and select technologies..."
                multiple={true}
                loading={technologyLoading}
                onSearch={(searchTerm) => {
                  if (searchTerm.length >= 2 || searchTerm.length === 0) {
                    fetchTechnologies(searchTerm);
                  }
                }}
              />
              <p className="text-xs text-[#7c8493]">Type to search and select technologies from the list</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddExperienceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExperience} className="bg-cyan-600 hover:bg-cyan-700" disabled={saving}>
              {saving ? 'Adding...' : 'Add Experience'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editExperienceOpen} onOpenChange={setEditExperienceOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="!text-lg !font-bold">Edit Experience</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-exp-title">Job Title</Label>
              <Input
                id="edit-exp-title"
                value={experienceData.title}
                onChange={(e) => setExperienceData({ ...experienceData, title: e.target.value })}
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-exp-company">Company</Label>
              <Input
                id="edit-exp-company"
                value={experienceData.company}
                onChange={(e) => setExperienceData({ ...experienceData, company: e.target.value })}
                placeholder="e.g., Google"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-exp-description">Description</Label>
              <Textarea
                id="edit-exp-description"
                rows={4}
                value={experienceData.description}
                onChange={(e) => setExperienceData({ ...experienceData, description: e.target.value })}
                placeholder="Describe your role and responsibilities..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-exp-type">Employment Type</Label>
                <Input
                  id="edit-exp-type"
                  value={experienceData.employmentType}
                  onChange={(e) => setExperienceData({ ...experienceData, employmentType: e.target.value })}
                  placeholder="e.g., full-time, part-time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-exp-location">Location</Label>
                <Input
                  id="edit-exp-location"
                  value={experienceData.location}
                  onChange={(e) => setExperienceData({ ...experienceData, location: e.target.value })}
                  placeholder="e.g., Remote, New York, NY"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-exp-start">Start Date</Label>
                <Input
                  id="edit-exp-start"
                  type="date"
                  value={experienceData.startDate}
                  onChange={(e) => setExperienceData({ ...experienceData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-exp-end">End Date</Label>
                <Input
                  id="edit-exp-end"
                  type="date"
                  value={experienceData.endDate}
                  onChange={(e) => setExperienceData({ ...experienceData, endDate: e.target.value })}
                  disabled={experienceData.isCurrent}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-exp-current"
                checked={experienceData.isCurrent}
                onCheckedChange={(checked) => {
                  setExperienceData({ 
                    ...experienceData, 
                    isCurrent: checked === true,
                    endDate: checked === true ? '' : experienceData.endDate
                  });
                }}
              />
              <Label htmlFor="edit-exp-current" className="text-sm font-normal cursor-pointer">
                I currently work here
              </Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-exp-technologies">Technologies / Skills Learned</Label>
              <Combobox
                options={technologyOptions}
                value={experienceData.technologies}
                onChange={(technologies) => setExperienceData({ ...experienceData, technologies })}
                placeholder="Type to search and select technologies..."
                multiple={true}
                loading={technologyLoading}
                onSearch={(searchTerm) => {
                  if (searchTerm.length >= 2 || searchTerm.length === 0) {
                    fetchTechnologies(searchTerm);
                  }
                }}
              />
              <p className="text-xs text-[#7c8493]">Type to search and select technologies from the list</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExperienceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditExperience} className="bg-cyan-600 hover:bg-cyan-700" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FormDialog
        open={addEducationOpen}
        onOpenChange={setAddEducationOpen}
        title="Add Education"
        fields={[
          {
            id: 'edu-school',
            label: 'School/University',
            value: educationData.school,
            onChange: (value) => setEducationData({ ...educationData, school: value }),
            required: true,
            validation: {
              required: 'School/University is required',
              maxLength: { value: 200, message: 'School name must not exceed 200 characters' },
            },
          },
          {
            id: 'edu-degree',
            label: 'Degree',
            value: educationData.degree,
            onChange: (value) => setEducationData({ ...educationData, degree: value }),
            validation: {
              maxLength: { value: 100, message: 'Degree must not exceed 100 characters' },
            },
          },
          {
            id: 'edu-field-of-study',
            label: 'Field of Study (Optional)',
            value: educationData.fieldOfStudy,
            onChange: (value) => setEducationData({ ...educationData, fieldOfStudy: value }),
            validation: {
              maxLength: { value: 100, message: 'Field of study must not exceed 100 characters' },
            },
          },
          {
            id: 'edu-grade',
            label: 'Grade (Optional)',
            value: educationData.grade,
            onChange: (value) => setEducationData({ ...educationData, grade: value }),
            validation: {
              maxLength: { value: 50, message: 'Grade must not exceed 50 characters' },
            },
          },
        ]}
        fieldGroups={[
          {
            fields: [
              {
                id: 'edu-start',
                label: 'Start Date',
                type: 'date',
                value: educationData.startDate,
                onChange: (value) => setEducationData({ ...educationData, startDate: value }),
                required: true,
                validation: {
                  required: 'Start date is required',
                  validate: (value) => {
                    if (!value) return 'Start date is required';
                    const date = new Date(value);
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    
                    if (date > today) {
                      return 'Start date cannot be in the future';
                    }
                    return true;
                  },
                },
              },
              {
                id: 'edu-end',
                label: 'End Date',
                type: 'date',
                value: educationData.endDate,
                onChange: (value) => setEducationData({ ...educationData, endDate: value }),
                validation: {
                  validate: (value) => {
                    if (!value) return true;
                    const endDate = new Date(value);
                    const startDate = new Date(educationData.startDate);
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    
                    if (endDate > today) {
                      return 'End date cannot be in the future';
                    }
                    if (educationData.startDate && endDate < startDate) {
                      return 'End date must be after start date';
                    }
                    return true;
                  },
                },
              },
            ],
            gridCols: 2,
          },
        ]}
        onSubmit={handleAddEducation}
        submitLabel="Add Education"
        maxWidth="2xl"
      />

      <FormDialog
        open={editEducationOpen}
        onOpenChange={setEditEducationOpen}
        title="Edit Education"
        fields={[
          {
            id: 'edit-edu-school',
            label: 'School/University',
            value: educationData.school,
            onChange: (value) => setEducationData({ ...educationData, school: value }),
            required: true,
            validation: {
              required: 'School/University is required',
              maxLength: { value: 200, message: 'School name must not exceed 200 characters' },
            },
          },
          {
            id: 'edit-edu-degree',
            label: 'Degree',
            value: educationData.degree,
            onChange: (value) => setEducationData({ ...educationData, degree: value }),
            validation: {
              maxLength: { value: 100, message: 'Degree must not exceed 100 characters' },
            },
          },
          {
            id: 'edit-edu-field-of-study',
            label: 'Field of Study (Optional)',
            value: educationData.fieldOfStudy,
            onChange: (value) => setEducationData({ ...educationData, fieldOfStudy: value }),
            validation: {
              maxLength: { value: 100, message: 'Field of study must not exceed 100 characters' },
            },
          },
          {
            id: 'edit-edu-grade',
            label: 'Grade (Optional)',
            value: educationData.grade,
            onChange: (value) => setEducationData({ ...educationData, grade: value }),
            validation: {
              maxLength: { value: 50, message: 'Grade must not exceed 50 characters' },
            },
          },
        ]}
        fieldGroups={[
          {
            fields: [
              {
                id: 'edit-edu-start',
                label: 'Start Date',
                type: 'date',
                value: educationData.startDate,
                onChange: (value) => setEducationData({ ...educationData, startDate: value }),
                required: true,
                validation: {
                  required: 'Start date is required',
                  validate: (value) => {
                    if (!value) return 'Start date is required';
                    const date = new Date(value);
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    
                    if (date > today) {
                      return 'Start date cannot be in the future';
                    }
                    return true;
                  },
                },
              },
              {
                id: 'edit-edu-end',
                label: 'End Date',
                type: 'date',
                value: educationData.endDate,
                onChange: (value) => setEducationData({ ...educationData, endDate: value }),
                validation: {
                  validate: (value) => {
                    if (!value) return true;
                    const endDate = new Date(value);
                    const startDate = new Date(educationData.startDate);
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    
                    if (endDate > today) {
                      return 'End date cannot be in the future';
                    }
                    if (educationData.startDate && endDate < startDate) {
                      return 'End date must be after start date';
                    }
                    return true;
                  },
                },
              },
            ],
            gridCols: 2,
          },
        ]}
        onSubmit={handleEditEducation}
        maxWidth="2xl"
      />

      <Dialog open={addSkillOpen} onOpenChange={setAddSkillOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="!text-lg !font-bold">Add Skills</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Skills</Label>
              <Combobox
                options={skillsOptions}
                value={selectedSkills}
                onChange={setSelectedSkills}
                placeholder="Type to search skills..."
                multiple={true}
                loading={skillsLoading}
                onSearch={(searchTerm) => {
                  if (searchTerm.length >= 2 || searchTerm.length === 0) {
                    fetchSkills(searchTerm);
                  }
                }}
              />
              <p className="text-xs text-[#7c8493]">Type to search and select skills from the list</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAddSkillOpen(false);
              setSelectedSkills([]);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddSkill} disabled={saving || selectedSkills.length === 0}>
              {saving ? 'Saving...' : 'Save Skills'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDetailsOpen} onOpenChange={setEditDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="!text-lg !font-bold">Edit Additional Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={editingEmail}
                onChange={(e) => setEditingEmail(e.target.value)}
                placeholder="e.g., contact@example.com"
              />
              <p className="text-xs text-[#7c8493]">This is your contact email for job applications</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={editingPhone}
                onChange={(e) => setEditingPhone(e.target.value)}
                placeholder="e.g., +1 234 567 8900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="languages">Languages</Label>
              <div className="flex gap-2">
                <Input
                  id="languages"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Enter a language (e.g., English, French)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLanguage();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddLanguage}
                  disabled={!newLanguage.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              {editingLanguages.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {editingLanguages.map((lang, idx) => (
                    <Badge
                      key={`${lang}-${idx}`}
                      variant="skill"
                      className="cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                      onClick={() => handleRemoveLanguage(lang)}
                      title="Click to remove"
                    >
                      {lang}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
              {editingLanguages.length === 0 && (
                <p className="text-xs text-[#7c8493] italic">No languages added yet. Enter a language and click Add.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDetailsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditDetails} className="bg-cyan-600 hover:bg-cyan-700" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editSocialOpen} onOpenChange={setEditSocialOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="!text-lg !font-bold">Edit Social Links</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingSocialLinks.map((link, index) => (
              <div key={index} className="flex gap-2 items-start p-3 border border-[#d6ddeb] rounded-lg">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`link-platform-${index}`}>Platform</Label>
                    <Select
                      value={
                        SOCIAL_PLATFORMS.find(p => p.value === link.name?.toLowerCase())?.value || 
                        (link.name && !SOCIAL_PLATFORMS.find(p => p.value === link.name?.toLowerCase()) ? 'custom' : '') || 
                        ''
                      }
                      onValueChange={(value) => {
                        const newLinks = [...editingSocialLinks];
                        if (value === 'custom') {
                          newLinks[index].name = '';
                        } else {
                          newLinks[index].name = value;
                        }
                        setEditingSocialLinks(newLinks);
                      }}
                    >
                      <SelectTrigger id={`link-platform-${index}`}>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {SOCIAL_PLATFORMS.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(!link.name || !SOCIAL_PLATFORMS.find(p => p.value === link.name?.toLowerCase())) && (
                    <div className="space-y-2">
                      <Label htmlFor={`link-custom-name-${index}`}>Custom Name</Label>
                      <Input
                        id={`link-custom-name-${index}`}
                        value={SOCIAL_PLATFORMS.find(p => p.value === link.name?.toLowerCase()) ? '' : (link.name || '')}
                        onChange={(e) => {
                          const newLinks = [...editingSocialLinks];
                          newLinks[index].name = e.target.value;
                          setEditingSocialLinks(newLinks);
                        }}
                        placeholder="Enter custom platform name"
                      />
                    </div>
                  )}
                  <div className={`space-y-2 ${(!link.name || !SOCIAL_PLATFORMS.find(p => p.value === link.name?.toLowerCase())) ? 'col-span-2' : ''}`}>
                    <Label htmlFor={`link-url-${index}`}>URL</Label>
                    <Input
                      id={`link-url-${index}`}
                      type="url"
                      value={link.link}
                      onChange={(e) => {
                        const newLinks = [...editingSocialLinks];
                        newLinks[index].link = e.target.value;
                        setEditingSocialLinks(newLinks);
                      }}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-6 h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    const newLinks = editingSocialLinks.filter((_, i) => i !== index);
                    setEditingSocialLinks(newLinks);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setEditingSocialLinks([...editingSocialLinks, { name: '', link: '' }]);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Social Link
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSocialOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSocial} className="bg-cyan-600 hover:bg-cyan-700" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageCropper
        open={bannerCropperOpen}
        onOpenChange={setBannerCropperOpen}
        image={tempBannerImage}
        aspect={4 / 1} 
        cropShape="rect"
        onCropComplete={handleBannerCropComplete}
        title="Crop Banner Image"
      />

      <ImageCropper
        open={profileCropperOpen}
        onOpenChange={setProfileCropperOpen}
        image={tempProfileImage}
        aspect={1} 
        cropShape="round"
        onCropComplete={handleProfileCropComplete}
        title="Crop Profile Photo"
      />

      <Dialog open={deleteSkillOpen} onOpenChange={setDeleteSkillOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="!text-lg !font-bold">Remove Skill</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-[#515b6f]">
                    Are you sure you want to remove <span className="font-semibold text-[#25324b]">{skillToDelete}</span> from your skills?
                  </p>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDeleteSkillOpen(false);
                      setSkillToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmRemoveSkill} 
                    className="bg-red-600 hover:bg-red-700" 
                    disabled={saving}
                  >
                    {saving ? 'Removing...' : 'Remove'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={deleteExperienceOpen} onOpenChange={setDeleteExperienceOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="!text-lg !font-bold">Remove Experience</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-[#515b6f]">
                    Are you sure you want to remove this experience?
                  </p>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDeleteExperienceOpen(false);
                      setExperienceToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmRemoveExperience} 
                    className="bg-red-600 hover:bg-red-700" 
                    disabled={saving}
                  >
                    {saving ? 'Removing...' : 'Remove'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={deleteEducationOpen} onOpenChange={setDeleteEducationOpen}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="!text-lg !font-bold">Remove Education</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-[#515b6f]">
                    Are you sure you want to remove this education?
                  </p>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setDeleteEducationOpen(false);
                      setEducationToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmRemoveEducation} 
                    className="bg-red-600 hover:bg-red-700" 
                    disabled={saving}
                  >
                    {saving ? 'Removing...' : 'Remove'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
    </div>
  );
}

export default SeekerProfile;