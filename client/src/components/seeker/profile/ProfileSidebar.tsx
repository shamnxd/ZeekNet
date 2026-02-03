
import React from 'react';
import { Pencil, Mail, Phone, Globe, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { SeekerProfile } from '@/interfaces/seeker/seeker.interface';

interface ProfileSidebarProps {
    profile: SeekerProfile | null;

    
    editDetailsOpen: boolean;
    setEditDetailsOpen: (open: boolean) => void;
    editingEmail: string;
    setEditingEmail: (email: string) => void;
    editingPhone: string;
    setEditingPhone: (phone: string) => void;
    newLanguage: string;
    setNewLanguage: (lang: string) => void;
    editingLanguages: string[];
    handleAddLanguage: () => void;
    handleRemoveLanguage: (lang: string) => void;
    handleEditDetails: () => Promise<void>;
    detailsError: string;
    setDetailsError: (msg: string) => void;

    
    editSocialOpen: boolean;
    setEditSocialOpen: (open: boolean) => void;
    editingSocialLinks: Array<{ name: string; link: string }>;
    setEditingSocialLinks: (links: Array<{ name: string; link: string }>) => void;
    handleEditSocial: () => Promise<void>;

    SOCIAL_PLATFORMS: Array<{ value: string; label: string }>;
    saving: boolean;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
    profile,
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
    saving,
}) => {
    return (
        <div className="space-y-5">
            {}
            <Card className="p-5 !gap-0 border border-[#d6ddeb]">
                <div className="flex items-center justify-between mb-5">
                    <p className="font-bold text-[16px] text-[#25324b]">
                        Additional Details
                    </p>
                    <Button
                        variant="seekerOutline"
                        size="sm"
                        className="h-8 w-8 !rounded-full"
                        onClick={() => { setDetailsError(''); setEditDetailsOpen(true); }}
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

            {}
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

            {}
            <Dialog open={editDetailsOpen} onOpenChange={setEditDetailsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="!text-lg !font-bold">Edit Additional Details</DialogTitle>
                    </DialogHeader>
                    {detailsError && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{detailsError}</p>
                    )}
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

            {}
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
        </div>
    );
};
