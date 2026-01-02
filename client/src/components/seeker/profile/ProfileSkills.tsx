
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';

interface ProfileSkillsProps {
    skills: string[];
    addSkillOpen: boolean;
    setAddSkillOpen: (open: boolean) => void;
    deleteSkillOpen: boolean;
    setDeleteSkillOpen: (open: boolean) => void;
    skillToDelete: string | null;
    setSkillToDelete: (skill: string | null) => void;

    selectedSkills: string[];
    setSelectedSkills: (skills: string[]) => void;
    skillsOptions: ComboboxOption[];
    skillsLoading: boolean;
    fetchSkills: (search?: string) => void;

    saving: boolean;
    handleAddSkill: () => Promise<void>;
    handleRemoveSkill: (skill: string) => void;
    confirmRemoveSkill: () => Promise<void>;
}

export const ProfileSkills: React.FC<ProfileSkillsProps> = ({
    skills,
    addSkillOpen,
    setAddSkillOpen,
    deleteSkillOpen,
    setDeleteSkillOpen,
    skillToDelete,
    setSkillToDelete,
    selectedSkills,
    setSelectedSkills,
    skillsOptions,
    skillsLoading,
    fetchSkills,
    saving,
    handleAddSkill,
    handleRemoveSkill,
    confirmRemoveSkill,
}) => {
    return (
        <>
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
                    {skills && skills.length > 0 ? (
                        skills.map((skill: string, idx: number) => (
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
        </>
    );
};
