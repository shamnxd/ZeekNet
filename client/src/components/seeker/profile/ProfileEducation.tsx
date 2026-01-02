
import React from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import FormDialog from '@/components/common/FormDialog';
import type { Education } from '@/interfaces/seeker/seeker.interface';

interface ProfileEducationProps {
    education: Education[];
    educationData: {
        school: string;
        degree: string;
        fieldOfStudy: string;
        startDate: string;
        endDate: string;
        grade: string;
    };
    setEducationData: React.Dispatch<React.SetStateAction<{
        school: string;
        degree: string;
        fieldOfStudy: string;
        startDate: string;
        endDate: string;
        grade: string;
    }>>;
    addEducationOpen: boolean;
    setAddEducationOpen: (open: boolean) => void;
    editEducationOpen: boolean;
    setEditEducationOpen: (open: boolean) => void;
    deleteEducationOpen: boolean;
    setDeleteEducationOpen: (open: boolean) => void;
    setEditingEducationId: (id: string | null) => void;
    setEducationToDelete: (id: string | null) => void;
    handleAddEducation: () => Promise<void>;
    handleEditEducation: () => Promise<void>;
    handleRemoveEducation: (id: string) => void;
    confirmRemoveEducation: () => Promise<void>;
    saving: boolean;
    isoToDateInput: (isoDate: string) => string;
    formatPeriod: (startDate: string, endDate?: string, isCurrent?: boolean) => string;
}

export const ProfileEducation: React.FC<ProfileEducationProps> = ({
    education,
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
    saving,
    isoToDateInput,
    formatPeriod,
}) => {
    return (
        <>
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
        </>
    );
};
