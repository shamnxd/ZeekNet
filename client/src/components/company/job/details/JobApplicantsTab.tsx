
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, FilterIcon, Star } from 'lucide-react';

import type { Applicant, StageFilter } from '@/interfaces/job/job-details.types';

interface JobApplicantsTabProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    stageFilter: StageFilter;
    setStageFilter: (filter: StageFilter) => void;
    applicationsLoading: boolean;
    filteredApplicants: Applicant[];
    onViewApplication: (id: string) => void;
    formatDate: (date: string) => string;
    normalizeStage: (stage: string) => string;
}

export const JobApplicantsTab: React.FC<JobApplicantsTabProps> = ({
    searchTerm,
    setSearchTerm,
    stageFilter,
    setStageFilter,
    applicationsLoading,
    filteredApplicants,
    onViewApplication,
    formatDate,
    normalizeStage,
}) => {

    
    const getInitials = (name: string) =>
        name
            .split(' ')
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase();

    const stageStyleMap = {
        applied: { bg: 'bg-[#F8F8FD]', text: 'text-[#4640DE]', dot: 'bg-[#4640DE]' },
        shortlisted: { bg: 'bg-[#E9EBFD]', text: 'text-[#25324B]', dot: 'bg-[#4640DE]' },
        interview: { bg: 'bg-[#FFF4E6]', text: 'text-[#EB8533]', dot: 'bg-[#EB8533]' },
        offered: { bg: 'bg-[#F3FFEB]', text: 'text-[#56CDAD]', dot: 'bg-[#56CDAD]' },
        hired: { bg: 'bg-[#E8FFF9]', text: 'text-[#1F8A70]', dot: 'bg-[#1F8A70]' },
        rejected: { bg: 'bg-[#FFECEC]', text: 'text-[#E5484D]', dot: 'bg-[#E5484D]' },
    };

    const renderStageBadge = (stage: string) => {
        const normalized = normalizeStage(stage) as keyof typeof stageStyleMap;
        const styles = stageStyleMap[normalized] || stageStyleMap.applied;
        return (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${styles.bg} ${styles.text}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
                {stage}
            </span>
        );
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7C8493]" />
                    <Input
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Search Applicants"
                        className="pl-9 pr-4 h-11 rounded-lg border-[#D6DDEB]"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <FilterIcon className="w-4 h-4 text-[#7C8493]" />
                    <Select
                        value={stageFilter}
                        onValueChange={(value: StageFilter) => setStageFilter(value)}
                    >
                        <SelectTrigger className="h-11 min-w-[190px] rounded-lg border-[#D6DDEB] bg-white">
                            <SelectValue placeholder="All stages" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Stages</SelectItem>
                            <SelectItem value="applied">Applied</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="hired">Hired</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {applicationsLoading ? (
                <div className="py-10 text-center">
                    <Loading />
                </div>
            ) : filteredApplicants.length === 0 ? (
                <div className="py-10 text-center text-sm text-[#7C8493]">
                    No applicants found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-[#F8F8FD]">
                            <tr className="text-left text-xs font-medium uppercase tracking-wide text-[#7C8493]">
                                <th className="py-4 pr-4 text-[#7C8493]"> Full Name</th>
                                <th className="py-4 pr-4 text-[#7C8493]">Score</th>
                                <th className="py-4 pr-4 text-[#7C8493]">Hiring Stage</th>
                                <th className="py-4 pr-4 text-[#7C8493]">Applied Date</th>
                                <th className="py-4 pr-6 text-[#7C8493] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6EAF5]">
                            {filteredApplicants.map((applicant) => (
                                <tr key={applicant.id} className="hover:bg-[#F8F8FD]/60">
                                    <td className="py-4 pr-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                {applicant.avatar ? (
                                                    <AvatarImage src={applicant.avatar} alt={applicant.name} />
                                                ) : (
                                                    <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] font-semibold">
                                                        {getInitials(applicant.name)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-[#25324B]">{applicant.name}</p>
                                                {applicant.email && (
                                                    <p className="text-xs text-[#7C8493]">{applicant.email}</p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 align-middle">
                                        <div className="flex items-center gap-1 text-sm font-semibold text-[#25324B]">
                                            <Star className="h-4 w-4 text-[#FFB836] fill-[#FFB836]" />
                                            {applicant.score ? applicant.score.toFixed(1) : '—'}
                                        </div>
                                    </td>
                                    <td className="py-4 pr-4 align-middle">
                                        {renderStageBadge(applicant.stage)}
                                    </td>
                                    <td className="py-4 pr-4 align-middle text-sm font-medium text-[#25324B]">
                                        {formatDate(applicant.appliedDate)}
                                    </td>
                                    <td className="py-4 pr-6 align-middle">
                                        <div className="flex items-center justify-end gap-3">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-9 rounded-lg border-[#CCCCF5] bg-[#E9EBFD] text-[#4640DE]"
                                                onClick={() => onViewApplication(applicant.id)}
                                            >
                                                See Application
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
