
import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import type { Experience } from '@/interfaces/seeker/seeker.interface';

interface ProfileExperiencesProps {
    experiences: Experience[];
    experienceData: {
        title: string;
        company: string;
        employmentType: string;
        startDate: string;
        endDate: string;
        location: string;
        description: string;
        technologies: string[];
        isCurrent: boolean;
    };
    setExperienceData: React.Dispatch<React.SetStateAction<{
        title: string;
        company: string;
        employmentType: string;
        startDate: string;
        endDate: string;
        location: string;
        description: string;
        technologies: string[];
        isCurrent: boolean;
    }>>;
    addExperienceOpen: boolean;
    setAddExperienceOpen: (open: boolean) => void;
    editExperienceOpen: boolean;
    setEditExperienceOpen: (open: boolean) => void;
    deleteExperienceOpen: boolean;
    setDeleteExperienceOpen: (open: boolean) => void;
    setEditingExperienceId: (id: string | null) => void;
    setExperienceToDelete: (id: string | null) => void;
    technologyOptions: ComboboxOption[];
    technologyLoading: boolean;
    fetchTechnologies: (search?: string) => void;
    handleAddExperience: () => Promise<void>;
    handleEditExperience: () => Promise<void>;
    handleRemoveExperience: (id: string) => void;
    confirmRemoveExperience: () => Promise<void>;
    experienceErrors: Record<string, string>;
    setExperienceErrors: (errors: Record<string, string>) => void;
    saving: boolean;
    isoToDateInput: (isoDate: string) => string;
    formatPeriod: (startDate: string, endDate?: string, isCurrent?: boolean) => string;
}

export const ProfileExperiences: React.FC<ProfileExperiencesProps> = ({
    experiences,
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
    saving,
    isoToDateInput,
    formatPeriod,
}) => {
    return (
        <>
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
                            setExperienceErrors({});
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
                                                        setEditingExperienceId(exp.id);
                                                        setExperienceErrors({});
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
            </Card >

            <Dialog open={addExperienceOpen} onOpenChange={setAddExperienceOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="!text-lg !font-bold">Add Experience</DialogTitle>
                    </DialogHeader>
                    {experienceErrors.general && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{experienceErrors.general}</p>
                    )}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="exp-title">Job Title</Label>
                            <Input
                                id="exp-title"
                                value={experienceData.title}
                                onChange={(e) => {
                                    setExperienceData({ ...experienceData, title: e.target.value });
                                    if (experienceErrors.title) setExperienceErrors({ ...experienceErrors, title: '' });
                                }}
                                placeholder="e.g., Software Engineer"
                                className={experienceErrors.title ? 'border-red-500' : ''}
                            />
                            {experienceErrors.title && <p className="text-xs text-red-500">{experienceErrors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="exp-company">Company</Label>
                            <Input
                                id="exp-company"
                                value={experienceData.company}
                                onChange={(e) => {
                                    setExperienceData({ ...experienceData, company: e.target.value });
                                    if (experienceErrors.company) setExperienceErrors({ ...experienceErrors, company: '' });
                                }}
                                placeholder="e.g., Google"
                                className={experienceErrors.company ? 'border-red-500' : ''}
                            />
                            {experienceErrors.company && <p className="text-xs text-red-500">{experienceErrors.company}</p>}
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
                                    onChange={(e) => {
                                        setExperienceData({ ...experienceData, employmentType: e.target.value });
                                        if (experienceErrors.employmentType) setExperienceErrors({ ...experienceErrors, employmentType: '' });
                                    }}
                                    placeholder="e.g., full-time, part-time"
                                    className={experienceErrors.employmentType ? 'border-red-500' : ''}
                                />
                                {experienceErrors.employmentType && <p className="text-xs text-red-500">{experienceErrors.employmentType}</p>}
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
                                    onChange={(e) => {
                                        setExperienceData({ ...experienceData, startDate: e.target.value });
                                        if (experienceErrors.startDate) setExperienceErrors({ ...experienceErrors, startDate: '' });
                                    }}
                                    className={experienceErrors.startDate ? 'border-red-500' : ''}
                                />
                                {experienceErrors.startDate && <p className="text-xs text-red-500">{experienceErrors.startDate}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="exp-end">End Date</Label>
                                <Input
                                    id="exp-end"
                                    type="date"
                                    value={experienceData.endDate}
                                    onChange={(e) => {
                                        setExperienceData({ ...experienceData, endDate: e.target.value });
                                        if (experienceErrors.endDate) setExperienceErrors({ ...experienceErrors, endDate: '' });
                                    }}
                                    disabled={experienceData.isCurrent}
                                    className={experienceErrors.endDate ? 'border-red-500' : ''}
                                />
                                {experienceErrors.endDate && <p className="text-xs text-red-500">{experienceErrors.endDate}</p>}
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
                        <Button
                            onClick={handleAddExperience}
                            className="bg-cyan-600 hover:bg-cyan-700"
                            disabled={saving}
                        >
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
                    {experienceErrors.general && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{experienceErrors.general}</p>
                    )}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-exp-title">Job Title</Label>
                            <Input
                                id="edit-exp-title"
                                value={experienceData.title}
                                onChange={(e) => {
                                    setExperienceData({ ...experienceData, title: e.target.value });
                                    if (experienceErrors.title) setExperienceErrors({ ...experienceErrors, title: '' });
                                }}
                                placeholder="e.g., Software Engineer"
                                className={experienceErrors.title ? 'border-red-500' : ''}
                            />
                            {experienceErrors.title && <p className="text-xs text-red-500">{experienceErrors.title}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-exp-company">Company</Label>
                            <Input
                                id="edit-exp-company"
                                value={experienceData.company}
                                onChange={(e) => {
                                    setExperienceData({ ...experienceData, company: e.target.value });
                                    if (experienceErrors.company) setExperienceErrors({ ...experienceErrors, company: '' });
                                }}
                                placeholder="e.g., Google"
                                className={experienceErrors.company ? 'border-red-500' : ''}
                            />
                            {experienceErrors.company && <p className="text-xs text-red-500">{experienceErrors.company}</p>}
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
                                    onChange={(e) => {
                                        setExperienceData({ ...experienceData, employmentType: e.target.value });
                                        if (experienceErrors.employmentType) setExperienceErrors({ ...experienceErrors, employmentType: '' });
                                    }}
                                    placeholder="e.g., full-time, part-time"
                                    className={experienceErrors.employmentType ? 'border-red-500' : ''}
                                />
                                {experienceErrors.employmentType && <p className="text-xs text-red-500">{experienceErrors.employmentType}</p>}
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
                                    onChange={(e) => {
                                        setExperienceData({ ...experienceData, startDate: e.target.value });
                                        if (experienceErrors.startDate) setExperienceErrors({ ...experienceErrors, startDate: '' });
                                    }}
                                    className={experienceErrors.startDate ? 'border-red-500' : ''}
                                />
                                {experienceErrors.startDate && <p className="text-xs text-red-500">{experienceErrors.startDate}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-exp-end">End Date</Label>
                                <Input
                                    id="edit-exp-end"
                                    type="date"
                                    value={experienceData.endDate}
                                    onChange={(e) => {
                                        setExperienceData({ ...experienceData, endDate: e.target.value });
                                        if (experienceErrors.endDate) setExperienceErrors({ ...experienceErrors, endDate: '' });
                                    }}
                                    disabled={experienceData.isCurrent}
                                    className={experienceErrors.endDate ? 'border-red-500' : ''}
                                />
                                {experienceErrors.endDate && <p className="text-xs text-red-500">{experienceErrors.endDate}</p>}
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
                        <Button
                            onClick={handleEditExperience}
                            className="bg-cyan-600 hover:bg-cyan-700"
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
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
        </>
    );
};
