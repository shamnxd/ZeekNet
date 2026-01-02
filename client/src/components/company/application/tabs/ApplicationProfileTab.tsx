
import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ApplicationDetails as ApplicationDetailsData } from '@/interfaces/application/application-details.interface';

interface ApplicationProfileTabProps {
    application: ApplicationDetailsData;
}

export const ApplicationProfileTab: React.FC<ApplicationProfileTabProps> = ({ application }) => {
    return (
        <>
            <div className="mb-7">
                <h3 className="text-lg font-semibold text-[#25324B] mb-5">Personal Info</h3>
                <div className="grid grid-cols-2 gap-6 mb-5">
                    <div>
                        <p className="text-sm text-[#7C8493] mb-1">Full Name</p>
                        <p className="text-sm font-medium text-[#25324B]">{application.full_name || application.seeker_name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-[#7C8493] mb-1">Date of Birth</p>
                        <p className="text-sm font-medium text-[#25324B]">
                            {application.date_of_birth ? new Date(application.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-[#7C8493] mb-1">Gender</p>
                        <p className="text-sm font-medium text-[#25324B]">
                            {application.gender ? application.gender.charAt(0).toUpperCase() + application.gender.slice(1) : 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-[#7C8493] mb-1">Language</p>
                        <p className="text-sm font-medium text-[#25324B]">{application.languages?.join(', ') || 'N/A'}</p>
                    </div>
                </div>
                <div>
                    <p className="text-sm text-[#7C8493] mb-1">Address</p>
                    <p className="text-sm font-medium text-[#25324B]">{application.address || 'N/A'}</p>
                </div>
            </div>

            <div className="h-px bg-[#D6DDEB] mb-7"></div>

            <div>
                <h3 className="text-lg font-semibold text-[#25324B] mb-5">Professional Info</h3>
                {application.about_me && (
                    <div className="mb-5">
                        <p className="text-sm text-[#7C8493] mb-2">About Me</p>
                        <div className="space-y-2">
                            {application.about_me.split('\n').map((paragraph, index) => (
                                <p key={index} className="text-sm font-medium text-[#25324B]">{paragraph}</p>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <p className="text-sm text-[#7C8493] mb-2">Skill set</p>
                    <div className="flex flex-wrap gap-2">
                        {application.skills && application.skills.length > 0 ? (
                            application.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="bg-[#F8F8FD] text-[#4640DE] border-0 px-2.5 py-1 rounded-lg text-xs">
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-[#7C8493]">N/A</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
