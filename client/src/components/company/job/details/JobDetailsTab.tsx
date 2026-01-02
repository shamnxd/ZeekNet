
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, CircleCheck, Heart, Mountain, GraduationCap, Users, Coffee, Car, Globe } from 'lucide-react';
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";

interface JobDetailsTabProps {
    jobData: JobPostingResponse;
    stageCounts: Record<string, number>;
    employmentType: string;
    formattedSalary: string;
    onEdit: () => void;
    formatDate: (date: string) => string;
}

export const JobDetailsTab: React.FC<JobDetailsTabProps> = ({
    jobData,
    stageCounts,
    employmentType,
    formattedSalary,
    onEdit,
    formatDate,
}) => {
    const responsibilities = jobData.responsibilities || [];
    const whoYouAre = jobData.qualifications || [];
    const niceToHaves = jobData.niceToHaves || jobData.nice_to_haves || [];
    const requiredSkills = jobData.skillsRequired || jobData.skills_required || [];
    const benefits = jobData.benefits || [];


    const benefitsListDefaults = [
        {
            icon: Heart,
            title: 'Full Healthcare',
            description: 'We believe in thriving communities and that starts with our team being happy and healthy.'
        },
        {
            icon: Mountain,
            title: 'Unlimited Vacation',
            description: 'We believe you should have a flexible schedule that makes space for family, wellness, and fun.'
        },
        {
            icon: GraduationCap,
            title: 'Skill Development',
            description: 'We believe in always learning and leveling up our skills. Whether it\'s a conference or online course.'
        },
        {
            icon: Users,
            title: 'Team Summits',
            description: 'Every 6 months we have a full team summit where we have fun, reflect, and plan for the upcoming quarter.'
        },
        {
            icon: Coffee,
            title: 'Remote Working',
            description: 'You know how you perform your best. Work from home, coffee shop or anywhere when you feel like it.'
        },
        {
            icon: Car,
            title: 'Commuter Benefits',
            description: 'We\'re grateful for all the time and energy each team member puts into getting to work every day.'
        },
        {
            icon: Globe,
            title: 'We give back.',
            description: 'We anonymously match any donation our employees make (up to ₹50,000) so they can support the organizations they care about most—times two.'
        }
    ];

    return (
        <>
            <div className="flex items-center justify-between mb-7">
                <div className="flex items-center gap-5">
                    <h2 className="text-2xl font-bold text-[#25324B]">{jobData.title}</h2>
                </div>
                <Button variant="outline" className="border-[#CCCCF5] text-[#4640DE] text-sm px-3 py-1.5" onClick={onEdit}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Edit Job Details
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                <div className="lg:col-span-2 space-y-9">
                    <div>
                        <h3 className="text-xl font-semibold text-[#25324B] mb-3.5">Description</h3>
                        <p className="text-sm text-[#515B6F] leading-relaxed">{jobData.description || 'No description provided'}</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-[#25324B] mb-3.5">Responsibilities</h3>
                        <div className="space-y-3.5">
                            {responsibilities.map((item: string, index: number) => (
                                <div key={index} className="flex items-start gap-2.5">
                                    <CircleCheck className="w-5 h-5 text-[#56CDAD] mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-[#515B6F]">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-[#25324B] mb-3.5">Who You Are</h3>
                        <div className="space-y-3.5">
                            {whoYouAre.map((item: string, index: number) => (
                                <div key={index} className="flex items-start gap-2.5">
                                    <CircleCheck className="w-5 h-5 text-[#56CDAD] mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-[#515B6F]">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold text-[#25324B] mb-3.5">Nice-To-Haves</h3>
                        <div className="space-y-3.5">
                            {niceToHaves.map((item: string, index: number) => (
                                <div key={index} className="flex items-start gap-2.5">
                                    <CircleCheck className="w-5 h-5 text-[#56CDAD] mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-[#515B6F]">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-7">
                    <Card className="border border-[#D6DDEB] rounded-lg">
                        <CardContent className="p-3.5 space-y-5">
                            <h3 className="text-xl font-semibold text-[#25324B]">About this role</h3>
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-sm font-semibold text-[#25324B]">{jobData.applicationCount || jobData.application_count || 0} applied</span>
                                    <span className="text-xs text-[#7C8493]">{stageCounts.shortlisted} shortlisted</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#F8F8FD] rounded-lg overflow-hidden">
                                    <div
                                        className="h-full bg-[#56CDAD] rounded-l-lg"
                                        style={{
                                            width: `${Math.min(100, (stageCounts.shortlisted / Math.max(1, stageCounts.total)) * 100)}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="space-y-3.5">
                                <div className="flex justify-between">
                                    <span className="text-sm text-[#515B6F]">Job Posted On</span>
                                    <span className="text-sm font-semibold text-[#25324B]">{formatDate(jobData.createdAt || '')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-[#515B6F]">Last Updated</span>
                                    <span className="text-sm font-semibold text-[#25324B]">{formatDate(jobData.updatedAt || '')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-[#515B6F]">Job Type</span>
                                    <span className="text-sm font-semibold text-[#25324B]">{employmentType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-[#515B6F]">Salary</span>
                                    <span className="text-sm font-semibold text-[#202430]">{formattedSalary}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-[#515B6F]">Location</span>
                                    <span className="text-sm font-semibold text-[#25324B]">{jobData.location || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-[#515B6F]">Status</span>
                                    <div className="flex flex-col items-end gap-1">
                                        {(() => {
                                            const status = jobData.status ?? 'unlisted';
                                            const statusConfig = {
                                                active: { label: 'Active', color: 'text-[#56CDAD]' },
                                                unlisted: { label: 'Unlisted', color: 'text-[#FFB836]' },
                                                expired: { label: 'Expired', color: 'text-[#7C8493]' },
                                                blocked: { label: 'Blocked', color: 'text-red-600' }
                                            };
                                            const config = statusConfig[status as keyof typeof statusConfig] || { label: 'Unknown', color: 'text-[#7C8493]' };
                                            return (
                                                <span className={`text-sm font-semibold ${config.color}`}>
                                                    {config.label}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </div>
                                {jobData.status === 'blocked' && (jobData.unpublishReason || jobData.unpublish_reason) && (
                                    <div className="flex justify-between pt-2 border-t border-[#D6DDEB]">
                                        <span className="text-sm text-[#515B6F]">Block Reason</span>
                                        <span className="text-sm font-semibold text-red-600 max-w-[60%] text-right">
                                            {jobData.unpublishReason || jobData.unpublish_reason}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-[#D6DDEB] rounded-lg">
                        <CardContent className="p-3.5">
                            <h3 className="text-xl font-semibold text-[#25324B] mb-5">Categories</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {((jobData.categoryIds || jobData.category_ids) ?? []).length > 0 ? (
                                    (jobData.categoryIds || jobData.category_ids)?.map((category: string, index: number) => (
                                        <Badge key={index} className="bg-[#EB8533]/10 text-[#FFB836] border-0 px-2.5 py-1 rounded-full text-xs">
                                            {category}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-[#515B6F]">No categories specified</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-[#D6DDEB] rounded-lg">
                        <CardContent className="p-3.5">
                            <h3 className="text-xl font-semibold text-[#25324B] mb-5">Required Skills</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {requiredSkills.length > 0 ? (
                                    requiredSkills.map((skill: string, index: number) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="bg-[#F8F8FD] text-[#4640DE] border-0 px-2.5 py-1 rounded-lg text-xs"
                                        >
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-[#515B6F]">No skills specified</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="w-full h-px bg-[#D6DDEB] my-7"></div>

            <div className="space-y-5">
                <div>
                    <h3 className="text-xl font-semibold text-[#25324B] mb-1.5">Perks & Benefits</h3>
                    <p className="text-sm text-[#515B6F]">This job comes with several perks and benefits</p>
                </div>

                {benefits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                        {benefits.map((benefit: string, index: number) => (
                            <Card key={index} className="border border-[#D6DDEB] rounded-lg">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-5">
                                        <div className="w-10 h-10 bg-[#4640DE]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Heart className="w-5 h-5 text-[#4640DE]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-[#25324B] mb-2.5">Benefit</h4>
                                            <p className="text-sm text-[#515B6F] leading-relaxed">{benefit}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                        {benefitsListDefaults.slice(0, 3).map((benefit, index) => (
                            <Card key={index} className="border border-[#D6DDEB] rounded-lg">
                                <CardContent className="p-5">
                                    <div className="flex items-start gap-5">
                                        <div className="w-10 h-10 bg-[#4640DE]/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <benefit.icon className="w-5 h-5 text-[#4640DE]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-[#25324B] mb-2.5">{benefit.title}</h4>
                                            <p className="text-sm text-[#515B6F] leading-relaxed">{benefit.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};
