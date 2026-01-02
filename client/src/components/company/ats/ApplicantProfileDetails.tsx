
import React from 'react';
import { Mail, Phone, MapPin, Briefcase, GraduationCap, Code } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CandidateDetailsResponse } from "@/api/company.api";
import { formatPeriod } from "@/utils/formatters";

interface ApplicantProfileDetailsProps {
    candidateData: CandidateDetailsResponse | null;
}

export const ApplicantProfileDetails: React.FC<ApplicantProfileDetailsProps> = ({ candidateData }) => {
    if (!candidateData) {
        return (
            <div className="text-center py-10 text-gray-500">
                <p>No profile data available.</p>
            </div>
        );
    }

    const { profile, user, experiences, educations } = candidateData;

    return (
        <div className="space-y-6">
            {}
            <Card className="border border-[#D6DDEB] rounded-lg shadow-sm">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-[#25324B] mb-4">About</h3>
                    {profile.summary ? (
                        <p className="text-sm text-[#515B6F] leading-relaxed whitespace-pre-wrap">
                            {profile.summary}
                        </p>
                    ) : (
                        <p className="text-sm text-[#7C8493] italic">No summary provided.</p>
                    )}

                    <div className="mt-6 flex flex-wrap gap-6">
                        {profile.location && (
                            <div className="flex items-center gap-2 text-sm text-[#515B6F]">
                                <MapPin className="h-4 w-4 text-[#7C8493]" />
                                <span>{profile.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-[#515B6F]">
                            <Mail className="h-4 w-4 text-[#7C8493]" />
                            <span>{profile.email || user.email}</span>
                        </div>
                        {profile.phone && (
                            <div className="flex items-center gap-2 text-sm text-[#515B6F]">
                                <Phone className="h-4 w-4 text-[#7C8493]" />
                                <span>{profile.phone}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {}
            <Card className="border border-[#D6DDEB] rounded-lg shadow-sm">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-[#25324B] mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-[#4640DE]" />
                        Experience
                    </h3>
                    <div className="space-y-6">
                        {experiences && experiences.length > 0 ? (
                            experiences.map((exp, index) => (
                                <div key={exp.id || index} className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-lg bg-[#F8F8FD] flex items-center justify-center flex-shrink-0 text-[#4640DE] font-bold text-lg">
                                        {exp.company?.[0]?.toUpperCase() || 'C'}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-base font-bold text-[#25324B]">{exp.title}</h4>
                                        <div className="flex flex-wrap items-center gap-2 text-sm text-[#515B6F] mt-1">
                                            <span className="font-medium text-[#25324B]">{exp.company}</span>
                                            <span className="w-1 h-1 rounded-full bg-[#D6DDEB]" />
                                            <span>{exp.employmentType}</span>
                                            <span className="w-1 h-1 rounded-full bg-[#D6DDEB]" />
                                            <span>{formatPeriod(exp.startDate, exp.endDate, exp.isCurrent)}</span>
                                        </div>
                                        {exp.location && (
                                            <p className="text-xs text-[#7C8493] mt-1">{exp.location}</p>
                                        )}
                                        {exp.description && (
                                            <p className="text-sm text-[#515B6F] mt-2 whitespace-pre-wrap">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-[#7C8493] italic">No experiences added.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {}
            <Card className="border border-[#D6DDEB] rounded-lg shadow-sm">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-[#25324B] mb-4 flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-[#4640DE]" />
                        Education
                    </h3>
                    <div className="space-y-6">
                        {educations && educations.length > 0 ? (
                            educations.map((edu, index) => (
                                <div key={edu.id || index} className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-[#F8F8FD] flex items-center justify-center flex-shrink-0 text-[#4640DE] font-bold text-lg">
                                        {edu.school?.[0]?.toUpperCase() || 'S'}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-base font-bold text-[#25324B]">{edu.school}</h4>
                                        <div className="text-sm text-[#515B6F] mt-1">
                                            <span className="font-medium text-[#25324B]">{edu.degree}</span>
                                            {edu.fieldOfStudy && <span> in {edu.fieldOfStudy}</span>}
                                        </div>
                                        <p className="text-xs text-[#7C8493] mt-1">
                                            {formatPeriod(edu.startDate, edu.endDate)}
                                        </p>
                                        {edu.grade && (
                                            <p className="text-xs text-[#515B6F] mt-1">Grade: {edu.grade}</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-[#7C8493] italic">No education history added.</p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {}
            <Card className="border border-[#D6DDEB] rounded-lg shadow-sm">
                <CardContent className="p-6">
                    <h3 className="text-lg font-bold text-[#25324B] mb-4 flex items-center gap-2">
                        <Code className="h-5 w-5 text-[#4640DE]" />
                        Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-[#F8F8FD] text-[#4640DE] hover:bg-[#EBEBFD] px-3 py-1 text-xs font-medium border border-[#CCCCF5]"
                                >
                                    {skill}
                                </Badge>
                            ))
                        ) : (
                            <p className="text-sm text-[#7C8493] italic">No skills listed.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
