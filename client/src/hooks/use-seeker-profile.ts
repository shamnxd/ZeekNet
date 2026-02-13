
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from 'sonner';
import type { SeekerProfile as SeekerProfileType, Experience, Education } from '@/interfaces/seeker/seeker.interface';
import { seekerApi } from '@/api/seeker.api';
import { publicApi } from '@/api/public.api';
import type { Area } from 'react-easy-crop';
import type { ComboboxOption } from '@/components/ui/combobox';

export const useSeekerProfile = () => {
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
    const [deleteExperienceOpen, setDeleteExperienceOpen] = useState(false);
    const [experienceToDelete, setExperienceToDelete] = useState<string | null>(null);
    const [experienceErrors, setExperienceErrors] = useState<Record<string, string>>({});

    const [techSearchTerm, setTechSearchTerm] = useState('');
    const debouncedTechSearchTerm = useDebounce(techSearchTerm, 500);
    const [skillsSearchTerm, setSkillsSearchTerm] = useState('');
    const debouncedSkillsSearchTerm = useDebounce(skillsSearchTerm, 500);
    const [addEducationOpen, setAddEducationOpen] = useState(false);
    const [editEducationOpen, setEditEducationOpen] = useState(false);
    const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
    const [deleteEducationOpen, setDeleteEducationOpen] = useState(false);
    const [educationToDelete, setEducationToDelete] = useState<string | null>(null);
    const [addSkillOpen, setAddSkillOpen] = useState(false);
    const [deleteSkillOpen, setDeleteSkillOpen] = useState(false);
    const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
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

    const [technologyOptions, setTechnologyOptions] = useState<ComboboxOption[]>([]);
    const [technologyLoading, setTechnologyLoading] = useState(false);

    const [editingSocialLinks, setEditingSocialLinks] = useState<Array<{ name: string; link: string }>>([]);
    const [editingLanguages, setEditingLanguages] = useState<string[]>([]);
    const [newLanguage, setNewLanguage] = useState('');
    const [editingPhone, setEditingPhone] = useState<string>('');
    const [editingEmail, setEditingEmail] = useState<string>('');
    const [detailsErrors, setDetailsErrors] = useState<Record<string, string>>({});
    const [socialErrors, setSocialErrors] = useState<Record<string, string>>({});

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
                const newBannerUrl = response.data.bannerUrl || croppedImage;
                setBannerImage(newBannerUrl);
                if (profile) {
                    setProfile({ ...profile, bannerUrl: newBannerUrl });
                }
                toast.success('Banner updated successfully');
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
                const newAvatarUrl = response.data.avatarUrl || croppedImage;
                setProfilePhoto(newAvatarUrl);
                if (profile) {
                    setProfile({ ...profile, avatarUrl: newAvatarUrl });
                }
                toast.success('Profile photo updated successfully');
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

            const updatedProfileData = {
                name: profileData.name,
                headline: profileData.headline,
                location: profileData.location,
                dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toISOString() : undefined,
                gender: profileData.gender || undefined,
            };

            const response = await seekerApi.updateProfile(updatedProfileData);
            if (response.success) {
                if (profile) {
                    const newProfile = { ...profile };
                    if (updatedProfileData.name) newProfile.name = updatedProfileData.name;
                    if (updatedProfileData.headline) newProfile.headline = updatedProfileData.headline;
                    if (updatedProfileData.location) newProfile.location = updatedProfileData.location;
                    if (updatedProfileData.gender) newProfile.gender = updatedProfileData.gender;
                    if (updatedProfileData.dateOfBirth !== undefined) newProfile.dateOfBirth = updatedProfileData.dateOfBirth || null;

                    setProfile(newProfile);
                }
                toast.success('Profile updated successfully');
                setEditProfileOpen(false);
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
                if (profile) {
                    setProfile({ ...profile, summary: aboutData });
                }
                toast.success('About section updated successfully');
                setEditAboutOpen(false);
            } else {
                toast.error(response.message || 'Failed to update about section');
            }
        } catch {
            toast.error('Failed to update about section');
        } finally {
            setSaving(false);
        }
    };

    const validateExperience = (): Record<string, string> => {
        const errors: Record<string, string> = {};
        if (!experienceData.title.trim()) errors.title = 'Title is required';
        if (!experienceData.company.trim()) errors.company = 'Company is required';
        if (!experienceData.startDate) errors.startDate = 'Start date is required';
        if (!experienceData.employmentType) errors.employmentType = 'Employment type is required';

        if (!experienceData.isCurrent && experienceData.endDate) {
            const start = new Date(experienceData.startDate);
            const end = new Date(experienceData.endDate);
            const today = new Date();
            if (end < start) errors.endDate = 'End date cannot be before start date';
            if (end > today) errors.endDate = 'End date cannot be in the future';
        }

        if (!experienceData.isCurrent && !experienceData.endDate) {
            errors.endDate = 'End date is required for past experience';
        }

        return errors;
    };

    const handleAddExperience = async () => {
        setExperienceErrors({});

        const validationErrors = validateExperience();
        if (Object.keys(validationErrors).length > 0) {
            setExperienceErrors(validationErrors);
            return;
        }

        try {
            setSaving(true);
            const response = await seekerApi.addExperience({
                title: experienceData.title,
                company: experienceData.company,
                startDate: experienceData.startDate,
                endDate: experienceData.isCurrent ? undefined : (experienceData.endDate || undefined),
                employmentType: experienceData.employmentType,
                location: experienceData.location || undefined,
                description: experienceData.description || undefined,
                technologies: experienceData.technologies,
                isCurrent: experienceData.isCurrent,
            });
            if (response.success && response.data) {
                toast.success('Experience added successfully');
                setAddExperienceOpen(false);
                setExperiences(prev => [response.data!, ...prev]);
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
            } else {
                const msg = response.message || 'Failed to add experience';
                setExperienceErrors({ general: msg });
                toast.error(msg);
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add experience';
            setExperienceErrors({ general: msg });
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    const handleEditExperience = async () => {
        if (!editingExperienceId) return;
        setExperienceErrors({});

        const validationErrors = validateExperience();
        if (Object.keys(validationErrors).length > 0) {
            setExperienceErrors(validationErrors);
            return;
        }

        try {
            setSaving(true);
            const response = await seekerApi.updateExperience(editingExperienceId, {
                title: experienceData.title,
                company: experienceData.company,
                startDate: experienceData.startDate,
                endDate: experienceData.isCurrent ? undefined : (experienceData.endDate || undefined),
                employmentType: experienceData.employmentType,
                location: experienceData.location || undefined,
                description: experienceData.description || undefined,
                technologies: experienceData.technologies,
                isCurrent: experienceData.isCurrent,
            });
            if (response.success && response.data) {
                toast.success('Experience updated successfully');
                setEditExperienceOpen(false);
                setExperiences(prev => prev.map(exp => (exp.id === editingExperienceId || exp._id === editingExperienceId) ? response.data as Experience : exp));
                setEditingExperienceId(null);
            } else {
                const msg = response.message || 'Failed to update experience';
                setExperienceErrors({ general: msg });
                toast.error(msg);
            }
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update experience';
            setExperienceErrors({ general: msg });
            toast.error(msg);
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
                setExperiences(prev => prev.filter(exp => exp.id !== experienceToDelete && exp._id !== experienceToDelete));
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
            if (response.success && response.data) {
                toast.success('Education added successfully');
                setAddEducationOpen(false);
                setEducation(prev => [response.data!, ...prev]);
                setEducationData({
                    school: '',
                    degree: '',
                    fieldOfStudy: '',
                    startDate: '',
                    endDate: '',
                    grade: '',
                });
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
            if (response.success && response.data) {
                toast.success('Education updated successfully');
                setEditEducationOpen(false);
                setEducation(prev => prev.map(edu => (edu.id === editingEducationId || edu._id === editingEducationId) ? response.data as Education : edu));
                setEditingEducationId(null);
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
                setEducation(prev => prev.filter(edu => edu.id !== educationToDelete && edu._id !== educationToDelete));
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

    const fetchSkills = (searchTerm: string = '') => {
        setSkillsSearchTerm(searchTerm);
        setSkillsLoading(true);
    };

    useEffect(() => {
        if (!addSkillOpen) return;

        const loadSkills = async () => {
            try {
                // If this runs because addSkillOpen became true, or debounced term changed
                setSkillsLoading(true);
                const response = await publicApi.getAllSkills({
                    limit: 20,
                    search: debouncedSkillsSearchTerm,
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
        loadSkills();
    }, [debouncedSkillsSearchTerm, addSkillOpen]);

    const fetchTechnologies = (searchTerm: string = '') => {
        setTechSearchTerm(searchTerm);
        setTechnologyLoading(true);
    };

    useEffect(() => {
        if (!addExperienceOpen && !editExperienceOpen) return;

        const loadTechnologies = async () => {
            try {
                setTechnologyLoading(true);
                const response = await publicApi.getAllSkills({
                    limit: 20,
                    search: debouncedTechSearchTerm,
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
        loadTechnologies();
    }, [debouncedTechSearchTerm, addExperienceOpen, editExperienceOpen]);

    useEffect(() => {
        if (addSkillOpen) {
            fetchSkills();
            if (profile?.skills) {
                setSelectedSkills(profile.skills);
            }
        }
    }, [addSkillOpen, profile?.skills]);

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
                if (profile) {
                    setProfile({ ...profile, skills: response.data || selectedSkills });
                }
                setSelectedSkills([]);
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
                if (profile) {
                    setProfile({ ...profile, skills: updatedSkills });
                }
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

        // Validate language - should only contain letters and spaces
        if (!/^[a-zA-Z\s]+$/.test(trimmed)) {
            setDetailsErrors({ language: 'Language name can only contain letters and spaces' });
            return;
        }

        if (editingLanguages.includes(trimmed)) {
            toast.error('This language is already added');
            return;
        }
        setEditingLanguages([...editingLanguages, trimmed]);
        setNewLanguage('');
        setDetailsErrors({});
    };

    const handleRemoveLanguage = (language: string) => {
        setEditingLanguages(editingLanguages.filter(lang => lang !== language));
    };

    const handleEditDetails = async () => {
        if (!profile) return;
        setDetailsErrors({});

        const errors: Record<string, string> = {};

        // Validate email
        if (!editingEmail.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingEmail.trim())) {
            errors.email = 'Please enter a valid email address';
        }

        // Validate phone number - must have at least 10 digits and should not be just special characters
        if (editingPhone && editingPhone.trim()) {
            const trimmedPhone = editingPhone.trim();
            const digitsOnly = trimmedPhone.replace(/\D/g, '');

            if (digitsOnly.length < 10) {
                errors.phone = 'Phone number must be at least 10 digits';
            } else if (!/^[\d\s\-()+]+$/.test(trimmedPhone)) {
                errors.phone = 'Please enter a valid phone number';
            } else if (trimmedPhone.startsWith('-')) {
                // Prevent numbers starting with minus (negative numbers)
                errors.phone = 'Phone number cannot start with a minus sign';
            }
        }

        if (Object.keys(errors).length > 0) {
            setDetailsErrors(errors);
            return;
        }

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
                setDetailsErrors({});
                setEditDetailsOpen(false);

                if (profile) {
                    const newProfile = { ...profile };
                    if (updateData.phone) newProfile.phone = updateData.phone;
                    if (updateData.email) newProfile.email = updateData.email;
                    if (languagesChanged) newProfile.languages = editingLanguages;
                    setProfile(newProfile);
                }
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
            setSocialErrors({});

            const newErrors: Record<string, string> = {};

            // Validate links
            editingSocialLinks.forEach((link, index) => {
                if (!link.name?.trim() && !link.link?.trim()) {
                    // Skip empty rows if there are multiple, but if only one it might be an error if user intended to add something
                    return;
                }

                if (!link.name?.trim()) {
                    newErrors[`name-${index}`] = 'Platform name is required';
                }

                if (!link.link?.trim()) {
                    newErrors[`link-${index}`] = 'URL is required';
                } else {
                    const urlToCheck = link.link.startsWith('http') ? link.link : `https://${link.link}`;
                    try {
                        const parsedUrl = new URL(urlToCheck);
                        // Basic check for TLD-like structure (contains a dot and not at the end)
                        if (!parsedUrl.hostname.includes('.') || parsedUrl.hostname.endsWith('.')) {
                            newErrors[`link-${index}`] = 'Please enter a valid URL with a domain extension (e.g., .com)';
                        }
                    } catch {
                        newErrors[`link-${index}`] = 'Please enter a valid URL';
                    }
                }
            });

            if (Object.keys(newErrors).length > 0) {
                setSocialErrors(newErrors);
                setSaving(false);
                return;
            }

            const validLinks = editingSocialLinks
                .filter(link => link.name?.trim() && link.link?.trim())
                .map(link => {
                    const urlToCheck = link.link.startsWith('http') ? link.link : `https://${link.link}`;
                    return {
                        name: SOCIAL_PLATFORMS.find(p => p.value === link.name?.toLowerCase())
                            ? link.name.toLowerCase()
                            : link.name.trim(),
                        link: urlToCheck,
                    };
                });

            const response = await seekerApi.updateProfile({
                socialLinks: validLinks,
            });
            if (response.success) {
                if (profile) {
                    setProfile({ ...profile, socialLinks: validLinks });
                }
                toast.success('Social links updated successfully');
                setEditSocialOpen(false);
            } else {
                setSocialErrors({ general: response.message || 'Failed to update social links' });
            }
        } catch {
            setSocialErrors({ general: 'Failed to update social links' });
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (editSocialOpen && profile) {
            const links = profile.socialLinks || [];
            setSocialErrors({});
            setEditingSocialLinks(links.length > 0 ? links : [{ name: '', link: '' }]);
        }
        if (editDetailsOpen && profile) {
            setDetailsErrors({});
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

    return {

        loading, saving, profile, experiences, education,
        profilePhoto, bannerImage,


        editBannerOpen, setEditBannerOpen,
        bannerCropperOpen, setBannerCropperOpen,
        editProfileOpen, setEditProfileOpen,
        profileCropperOpen, setProfileCropperOpen,
        editAboutOpen, setEditAboutOpen,
        addExperienceOpen, setAddExperienceOpen,
        editExperienceOpen, setEditExperienceOpen,
        deleteExperienceOpen, setDeleteExperienceOpen,
        addEducationOpen, setAddEducationOpen,
        editEducationOpen, setEditEducationOpen,
        deleteEducationOpen, setDeleteEducationOpen,
        addSkillOpen, setAddSkillOpen,
        deleteSkillOpen, setDeleteSkillOpen,
        editDetailsOpen, setEditDetailsOpen,
        editSocialOpen, setEditSocialOpen,


        tempBannerImage, setTempBannerImage,
        tempProfileImage, setTempProfileImage,
        bannerImageFile,
        profilePhotoFile,
        profileData, setProfileData,
        aboutData, setAboutData,
        experienceData, setExperienceData,
        educationData, setEducationData,
        selectedSkills, setSelectedSkills,
        skillsOptions, skillsLoading, fetchSkills,
        technologyOptions, technologyLoading, fetchTechnologies,
        editingSocialLinks, setEditingSocialLinks,
        editingLanguages, setEditingLanguages,
        newLanguage, setNewLanguage,
        editingPhone, setEditingPhone,
        editingEmail, setEditingEmail,
        experienceToDelete, setExperienceToDelete,
        educationToDelete, setEducationToDelete,
        skillToDelete, setSkillToDelete,
        editingExperienceId, setEditingExperienceId,
        editingEducationId, setEditingEducationId,


        SOCIAL_PLATFORMS,


        handleBannerChange, handleBannerCropComplete, handleEditBanner,
        handlePhotoChange, handleProfileCropComplete,
        handleEditProfile,
        handleEditAbout,
        handleAddExperience, handleEditExperience, handleRemoveExperience, confirmRemoveExperience,
        experienceErrors, setExperienceErrors,
        handleAddEducation, handleEditEducation, handleRemoveEducation, confirmRemoveEducation,
        handleAddSkill, handleRemoveSkill, confirmRemoveSkill,
        handleAddLanguage, handleRemoveLanguage,
        handleEditDetails, handleEditSocial,
        detailsErrors, setDetailsErrors,
        socialErrors, setSocialErrors,


        formatDate, formatPeriod, isoToDateInput,
    }
}
