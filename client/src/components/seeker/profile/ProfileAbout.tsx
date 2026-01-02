
import React from 'react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FormDialog from '@/components/common/FormDialog';

interface ProfileAboutProps {
    aboutData: string;
    editAboutOpen: boolean;
    setEditAboutOpen: (open: boolean) => void;
    setAboutData: (data: string) => void;
    handleEditAbout: () => Promise<void>;
}

export const ProfileAbout: React.FC<ProfileAboutProps> = ({
    aboutData,
    editAboutOpen,
    setEditAboutOpen,
    setAboutData,
    handleEditAbout,
}) => {
    return (
        <>
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
        </>
    );
};
