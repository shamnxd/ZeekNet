
import React from 'react';

interface JobTabsProps {
    activeTab: 'applicants' | 'details';
    setActiveTab: (tab: 'applicants' | 'details') => void;
}

export const JobTabs: React.FC<JobTabsProps> = ({ activeTab, setActiveTab }) => {
    return (
        <div className="border-b border-[#D6DDEB]">
            <div className="px-7">
                <div className="flex gap-9">
                    <button
                        className={`py-3.5 text-sm border-b-2 transition-colors ${activeTab === 'applicants'
                            ? 'font-semibold text-[#25324B] border-[#4640DE]'
                            : 'font-medium text-[#7C8493] border-transparent'
                            }`}
                        onClick={() => setActiveTab('applicants')}
                    >
                        Applicants
                    </button>
                    <button
                        className={`py-3.5 text-sm border-b-2 transition-colors ${activeTab === 'details'
                            ? 'font-semibold text-[#25324B] border-[#4640DE]'
                            : 'font-medium text-[#7C8493] border-transparent'
                            }`}
                        onClick={() => setActiveTab('details')}
                    >
                        Job Details
                    </button>
                </div>
            </div>
        </div>
    );
};
