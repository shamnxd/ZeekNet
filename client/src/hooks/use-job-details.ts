
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { companyApi } from '@/api/company.api';
import { jobApplicationApi } from '@/api';
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import type { CompanySideApplication } from '@/interfaces/company/company-data.interface';
import type { Applicant, StageFilter, ViewRange, AnalyticsData, TrafficChannel } from '@/interfaces/job/job-details.types';

export const useJobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [jobData, setJobData] = useState<JobPostingResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState<CompanySideApplication[]>([]);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'applicants' | 'details'>('details');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [stageFilter, setStageFilter] = useState<StageFilter>('all');
    const [viewRange, setViewRange] = useState<ViewRange>('7d');

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!id) {
                toast.error('Job ID not found');
                navigate('/company/job-listing');
                return;
            }

            try {
                setLoading(true);
                const response = await companyApi.getJobPosting(id);

                if (response.success && response.data) {
                    setJobData(response.data);
                } else {
                    toast.error('Failed to load job details');
                    navigate('/company/job-listing');
                }
            } catch {
                toast.error('Failed to load job details');
                navigate('/company/job-listing');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id, navigate]);

    useEffect(() => {
        const fetchApplications = async () => {
            if (!id || activeTab !== 'applicants') return;

            try {
                setApplicationsLoading(true);
                const response = await jobApplicationApi.getJobApplications(id, {
                    limit: 100,
                });

                if (response.data?.data?.applications) {
                    setApplications(response.data.data.applications);
                } else if (response.data?.applications) {
                    setApplications(response.data.applications);
                } else if (Array.isArray(response.data?.data)) {
                    setApplications(response.data.data);
                } else if (Array.isArray(response.data)) {
                    setApplications(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch applications:', error);
                setApplications([]);
            } finally {
                setApplicationsLoading(false);
            }
        };

        fetchApplications();
    }, [id, activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const normalizeStage = (stage: string) => {
        const value = stage.toLowerCase();
        if (value.includes('short')) return 'shortlisted';
        if (value.includes('inter')) return 'interview';
        if (value.includes('offer')) return 'offered';
        if (value.includes('hire')) return 'hired';
        if (value.includes('reject')) return 'rejected';
        return 'applied';
    };

    const applicants: Applicant[] = applications.length > 0
        ? applications.map((applicant, index: number) => ({
            id: applicant.id || applicant._id || `applicant-${index}`,
            name: applicant.seeker_name || applicant.name || applicant.full_name || 'Unknown Applicant',
            email: applicant.user?.email || applicant.email || '',
            stage: applicant.stage || 'applied',
            appliedDate: applicant.applied_date || applicant.appliedAt || applicant.created_at || applicant.createdAt || new Date().toISOString(),
            score: applicant.score || 0,
            avatar: applicant.seeker_avatar || applicant.avatar || '',
            experience: Array.isArray(applicant.experience) ? (applicant.experience[0] as Record<string, unknown>)?.title as string : typeof applicant.experience === 'string' ? applicant.experience : undefined,
            matchPercentage: applicant.match_percentage,
        }))
        : [];

    const filteredApplicants = applicants.filter((applicant) => {
        const matchesStage =
            stageFilter === 'all' || normalizeStage(applicant.stage) === stageFilter;
        const term = debouncedSearchTerm.toLowerCase();
        const matchesSearch =
            applicant.name.toLowerCase().includes(term) ||
            (applicant.email ? applicant.email.toLowerCase().includes(term) : false);
        return matchesStage && (term ? matchesSearch : true);
    });

    const stageCounts = applicants.reduce(
        (acc, applicant) => {
            const key = normalizeStage(applicant.stage) as keyof typeof acc;
            acc[key] = (acc[key] || 0) + 1;
            acc.total += 1;
            return acc;
        },
        {
            total: 0,
            applied: 0,
            shortlisted: 0,
            interview: 0,
            offered: 0,
            hired: 0,
            rejected: 0,
        }
    );


    const analyticsDefaults: AnalyticsData = {
        totalViews: 23564,
        totalViewsChange: 6.4,
        totalApplied: jobData?.applicationCount || jobData?.application_count || 132,
        totalAppliedChange: -0.4,
        traffic: [
            { label: 'Direct', value: 48, color: '#FFB836' },
            { label: 'Social', value: 23, color: '#4640DE' },
            { label: 'Organic', value: 24, color: '#C0C6F0' },
            { label: 'Other', value: 5, color: '#56CDAD' },
        ],
        visitors: [
            { country: 'USA', count: 3240, flag: '🇺🇸' },
            { country: 'France', count: 3188, flag: '🇫🇷' },
            { country: 'Italy', count: 2928, flag: '🇮🇹' },
            { country: 'Germany', count: 2624, flag: '🇩🇪' },
            { country: 'Japan', count: 2184, flag: '🇯🇵' },
            { country: 'United Kingdom', count: 1962, flag: '🇬🇧' },
        ],
    };

    const analyticsData = {
        ...analyticsDefaults,
        ...jobData?.analytics,
        totalApplied: jobData?.analytics?.totalApplied ?? analyticsDefaults.totalApplied,
        totalAppliedChange:
            jobData?.analytics?.totalAppliedChange ?? analyticsDefaults.totalAppliedChange,
        totalViews: jobData?.analytics?.totalViews ?? analyticsDefaults.totalViews,
        totalViewsChange:
            jobData?.analytics?.totalViewsChange ?? analyticsDefaults.totalViewsChange,
        traffic: jobData?.analytics?.traffic || analyticsDefaults.traffic,
        visitors: jobData?.analytics?.visitors || analyticsDefaults.visitors,
    };

    const chartPointsByRange: Record<ViewRange, { label: string; views: number }[]> = {
        '7d': [
            { label: '19 Jul', views: 180 },
            { label: '20 Jul', views: 420 },
            { label: '21 Jul', views: 260 },
            { label: '22 Jul', views: 520 },
            { label: '23 Jul', views: 380 },
            { label: '24 Jul', views: 460 },
            { label: '25 Jul', views: 243 },
        ],
        '14d': [
            { label: '12 Jul', views: 120 },
            { label: '14 Jul', views: 340 },
            { label: '16 Jul', views: 220 },
            { label: '18 Jul', views: 480 },
            { label: '20 Jul', views: 420 },
            { label: '22 Jul', views: 540 },
            { label: '24 Jul', views: 243 },
        ],
        '30d': [
            { label: 'Jul 1', views: 80 },
            { label: 'Jul 7', views: 210 },
            { label: 'Jul 13', views: 330 },
            { label: 'Jul 18', views: 280 },
            { label: 'Jul 21', views: 520 },
            { label: 'Jul 24', views: 460 },
            { label: 'Jul 25', views: 243 },
        ],
    };

    const chartPoints = chartPointsByRange[viewRange];
    const maxViews = Math.max(...chartPoints.map((point) => point.views)) || 1;
    const totalTraffic = analyticsData.traffic.reduce((sum: number, item: TrafficChannel) => sum + item.value, 0) || 1;
    type TrafficSegment = TrafficChannel & { start: number; end: number };
    const trafficSegments: TrafficSegment[] = analyticsData.traffic.map(
        (segment: TrafficChannel, index: number) => {
            const start =
                analyticsData.traffic.slice(0, index).reduce((sum: number, item: TrafficChannel) => sum + item.value, 0) /
                totalTraffic;
            const end = start + segment.value / totalTraffic;
            return { ...segment, start, end };
        }
    );

    const chartWidth = 520;
    const chartHeight = 220;
    const chartPadding = 28;
    const stepX = chartPoints.length > 1 ? (chartWidth - chartPadding * 2) / (chartPoints.length - 1) : 0;
    const chartCoordinates = chartPoints.map((point, index) => {
        const x = chartPadding + index * stepX;
        const y =
            chartHeight - chartPadding - (point.views / maxViews) * (chartHeight - chartPadding * 2);
        return { ...point, x, y };
    });
    const linePath = chartCoordinates
        .map((coordinate, index) => `${index === 0 ? 'M' : 'L'} ${coordinate.x} ${coordinate.y}`)
        .join(' ');
    const areaPath =
        `M ${chartPadding} ${chartHeight - chartPadding} ` +
        chartCoordinates.map((coordinate) => `L ${coordinate.x} ${coordinate.y}`).join(' ') +
        ` L ${chartPadding + stepX * (chartCoordinates.length - 1)} ${chartHeight - chartPadding} Z`;
    const lastCoordinate = chartCoordinates[chartCoordinates.length - 1];

    const getEmploymentType = () => {
        return jobData?.employmentTypes?.[0] || jobData?.employment_types?.[0] || 'Not specified';
    };

    const formatSalary = () => {
        if (jobData?.salary?.min && jobData?.salary?.max) {
            return `₹${jobData.salary.min.toLocaleString()}-₹${jobData.salary.max.toLocaleString()}`;
        }
        return 'Salary not specified';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return {
        id,
        navigate,
        jobData,
        loading,
        activeTab,
        setActiveTab,


        searchTerm,
        setSearchTerm,
        stageFilter,
        setStageFilter,
        applicationsLoading,
        filteredApplicants,
        normalizeStage,


        stageCounts,
        getEmploymentType,
        formatSalary,
        formatDate,


        viewRange,
        setViewRange,
        analyticsData,
        chartWidth,
        chartHeight,
        areaPath,
        linePath,
        chartCoordinates,
        lastCoordinate,
        trafficSegments,
    };
};
