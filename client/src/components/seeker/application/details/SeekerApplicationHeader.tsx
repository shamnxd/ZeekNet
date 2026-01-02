
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SeekerApplicationHeaderProps {
    jobTitle: string;
    onBack: () => void;
}

export const SeekerApplicationHeader: React.FC<SeekerApplicationHeaderProps> = ({ jobTitle, onBack }) => {
    return (
        <div className="flex items-center gap-4 mb-6">
            <Button
                variant="outline"
                onClick={onBack}
                className="gap-2"
            >
                <ArrowLeft className="h-4 w-4" />
                Back
            </Button>
            <div className="flex-1">
                <h1 className="text-[26px] font-bold text-[#1f2937]">Application Details</h1>
                <p className="text-[14px] text-[#6b7280] mt-1">{jobTitle}</p>
            </div>
        </div>
    );
};
