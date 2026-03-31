
import React from 'react';
import { MapPin, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FormDialog from '@/components/common/FormDialog';
import { ImageCropper } from '@/components/common/ImageCropper';
import type { SeekerProfile } from '@/interfaces/seeker/seeker.interface';
import type { Area } from 'react-easy-crop';

interface ProfileHeaderProps {
    loading: boolean;
    saving: boolean;
    profile: SeekerProfile | null;
    bannerImage: string;
    profilePhoto: string;


    editBannerOpen: boolean;
    setEditBannerOpen: (open: boolean) => void;
    bannerCropperOpen: boolean;
    setBannerCropperOpen: (open: boolean) => void;
    tempBannerImage: string;
    bannerImageFile: File | null;
    handleBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEditBanner: () => void;
    handleBannerCropComplete: (croppedAreaPixels: Area, croppedImage: string) => Promise<void>;


    editProfileOpen: boolean;
    setEditProfileOpen: (open: boolean) => void;
    profileCropperOpen: boolean;
    setProfileCropperOpen: (open: boolean) => void;
    tempProfileImage: string;
    profilePhotoFile: File | null;
    handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleProfileCropComplete: (croppedAreaPixels: Area, croppedImage: string) => Promise<void>;
    handleEditProfile: () => Promise<void>;


    profileData: {
        name: string;
        headline: string;
        location: string;
        dateOfBirth: string;
        gender: string;
    };
    setProfileData: React.Dispatch<React.SetStateAction<{
        name: string;
        headline: string;
        location: string;
        dateOfBirth: string;
        gender: string;
    }>>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
    saving,
    profile,
    bannerImage,
    profilePhoto,
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
}) => {
    return (
        <>
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
                            {bannerImage ? (
                                <img
                                    src={bannerImage}
                                    alt="Banner Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement?.querySelector('.fallback-banner')?.classList.remove('hidden');
                                    }}
                                />
                            ) : null}
                            <div className={`fallback-banner absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400 ${bannerImage ? 'hidden' : ''}`}>
                                <div className="text-center">
                                    <p className="text-sm font-medium">No Banner Selected</p>
                                </div>
                            </div>
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
        </>
    );
};
