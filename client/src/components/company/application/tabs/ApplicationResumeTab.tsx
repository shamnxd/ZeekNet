
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import type { ApplicationDetails as ApplicationDetailsData } from '@/interfaces/application/application-details.interface';
import { getInitials } from '@/utils/formatters';

interface ApplicationResumeTabProps {
    application: ApplicationDetailsData;
}

export const ApplicationResumeTab: React.FC<ApplicationResumeTabProps> = ({ application }) => {
    return (
        <div className="border border-[#D6DDEB] rounded-lg p-6">
            {}
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#D6DDEB]">
                <Avatar className="w-16 h-16">
                    {application.seeker_avatar ? (
                        <AvatarImage src={application.seeker_avatar} alt={application.seeker_name} />
                    ) : null}
                    <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-lg font-semibold">
                        {getInitials(application.seeker_name)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#25324B] mb-1">
                        {application.full_name || application.seeker_name}
                    </h3>
                    <p className="text-base text-[#25324B] mb-4">
                        {application.seeker_headline || 'Applicant'}
                    </p>
                    <div className="space-y-1 text-sm text-[#7C8493]">
                        {application.email && <p>{application.email}</p>}
                        {application.phone && <p>{application.phone}</p>}
                        {application.address && <p>{application.address}</p>}
                    </div>
                </div>
                {application.resume_url && (
                    <Button
                        variant="outline"
                        className="border-[#CCCCF5] text-[#4640DE]"
                        onClick={() => {
                            if (application.resume_url) {
                                window.open(application.resume_url, '_blank');
                            }
                        }}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        View Resume
                    </Button>
                )}
            </div>

            {}
            {application.cover_letter && (
                <div className="mb-6">
                    <h4 className="text-base font-semibold text-[#25324B] mb-3">Cover Letter</h4>
                    <p className="text-sm text-[#25324B] whitespace-pre-line">{application.cover_letter}</p>
                </div>
            )}

            {}
            {application.resume_data?.industry_knowledge && application.resume_data.industry_knowledge.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-base font-semibold text-[#25324B] mb-3">Industry Knowledge</h4>
                    <div className="flex flex-wrap gap-2">
                        {application.resume_data.industry_knowledge.map((skill, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="bg-[#F8F8FD] text-[#4640DE] border-0 px-3 py-1 rounded-lg text-sm"
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {}
            {application.resume_data?.tools_technologies && application.resume_data.tools_technologies.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-base font-semibold text-[#25324B] mb-3">Tools & Technologies</h4>
                    <p className="text-sm text-[#7C8493]">
                        {application.resume_data.tools_technologies.join(', ')}
                    </p>
                </div>
            )}

            {}
            {application.resume_data?.other_skills && application.resume_data.other_skills.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-base font-semibold text-[#25324B] mb-3">Other Skills</h4>
                    <p className="text-sm text-[#7C8493]">
                        {application.resume_data.other_skills.join(', ')}
                    </p>
                </div>
            )}

            {}
            {application.languages && application.languages.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-base font-semibold text-[#25324B] mb-3">Languages</h4>
                    <div className="space-y-1">
                        {application.languages.map((lang, index) => (
                            <p key={index} className="text-sm text-[#7C8493]">{lang}</p>
                        ))}
                    </div>
                </div>
            )}

            {}
            {(application.website || application.instagram || application.twitter) && (
                <div className="mb-6">
                    <h4 className="text-base font-semibold text-[#25324B] mb-3">Social</h4>
                    <div className="space-y-1">
                        {application.website && (
                            <a href={`https://${application.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4640DE] hover:underline block">
                                {application.website}
                            </a>
                        )}
                        {application.instagram && (
                            <a href={`https://${application.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4640DE] hover:underline block">
                                {application.instagram}
                            </a>
                        )}
                        {application.twitter && (
                            <a href={`https://${application.twitter}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4640DE] hover:underline block">
                                {application.twitter}
                            </a>
                        )}
                    </div>
                </div>
            )}

            {}
            {application.resume_data?.experience && application.resume_data.experience.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-base font-semibold text-[#25324B] mb-4 uppercase">experience</h4>
                    <div className="space-y-6">
                        {application.resume_data.experience.map((exp, index) => (
                            <div key={index} className="pb-4 border-b border-[#D6DDEB] last:border-0 last:pb-0">
                                <h5 className="text-base font-semibold text-[#25324B] mb-1">{exp.title}</h5>
                                <p className="text-sm text-[#25324B] mb-1">{exp.company}</p>
                                <p className="text-sm text-[#7C8493] mb-2">
                                    {exp.period}
                                    {exp.location && `, ${exp.location}`}
                                </p>
                                {exp.description && (
                                    <p className="text-sm text-[#7C8493]">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {}
            {application.resume_data?.education && application.resume_data.education.length > 0 && (
                <div>
                    <h4 className="text-base font-semibold text-[#25324B] mb-4 uppercase">education</h4>
                    <div className="space-y-4">
                        {application.resume_data.education.map((edu, index) => (
                            <div key={index}>
                                <h5 className="text-base font-semibold text-[#25324B] mb-1">{edu.degree}</h5>
                                <p className="text-sm text-[#25324B] mb-1">{edu.school}</p>
                                <p className="text-sm text-[#7C8493]">
                                    {edu.period}
                                    {edu.location && `, ${edu.location}`}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
