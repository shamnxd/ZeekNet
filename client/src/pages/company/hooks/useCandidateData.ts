import { useState, useCallback, useEffect } from "react";
import { companyApi } from "@/api/company.api";
import { atsService } from "@/services/ats.service";
import { toast } from "@/hooks/use-toast";
import {
    ATSStage,
} from "@/constants/ats-stages";
import type { CandidateDetailsResponse } from "@/api/company.api";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import type {
    ATSInterview,
    ATSComment,
} from "@/types/ats";
import type {
    ExtendedATSTechnicalTask,
    ExtendedATSOfferDocument,
    CompensationMeeting,
    CompensationData
} from "../CandidateProfileTypes";

export const useCandidateData = (currentId: string | undefined, isATSMode: boolean) => {
    // Non-ATS Data
    const [candidateData, setCandidateData] =
        useState<CandidateDetailsResponse | null>(null);

    // ATS Data
    const [atsApplication, setAtsApplication] =
        useState<CompanySideApplication | null>(null);
    const [atsJob, setAtsJob] = useState<JobPostingResponse | null>(null);
    const [interviews, setInterviews] = useState<ATSInterview[]>([]);
    const [technicalTasks, setTechnicalTasks] = useState<
        ExtendedATSTechnicalTask[]
    >([]);
    const [offerDocuments, setOfferDocuments] = useState<
        ExtendedATSOfferDocument[]
    >([]);
    const [comments, setComments] = useState<ATSComment[]>([]);

    const [loading, setLoading] = useState(true);

    // Compensation state
    const [compensationData, setCompensationData] = useState<CompensationData | null>(null);
    const [compensationNotes, setCompensationNotes] = useState<
        Array<{
            comment: string;
            recruiterName?: string;
            createdAt: string;
        }>
    >([]);
    const [compensationMeetings, setCompensationMeetings] = useState<
        CompensationMeeting[]
    >([]);

    // Offer state
    const [currentOffer, setCurrentOffer] =
        useState<ExtendedATSOfferDocument | null>(null);

    // Limit exceeded state
    const [showLimitExceededDialog, setShowLimitExceededDialog] = useState(false);
    const [limitExceededData, setLimitExceededData] = useState<{ currentLimit: number; used: number } | null>(null);

    const reloadData = useCallback(async () => {
        if (!currentId) return;

        try {
            if (isATSMode) {
                // ATS Mode: Fetch Application Details first
                const appRes = await companyApi.getApplicationDetails(currentId);
                if (appRes.data) {
                    // Map server response (snake_case) to client interface (supports both naming conventions)
                    const applicationData = appRes.data as Record<string, unknown>;
                    const getString = (val: unknown): string | undefined =>
                        typeof val === "string" ? val : undefined;
                    const getNumber = (val: unknown): number | undefined =>
                        typeof val === "number" ? val : undefined;
                    const getStringArray = (val: unknown): string[] | undefined =>
                        Array.isArray(val) && val.every((v) => typeof v === "string")
                            ? (val as string[])
                            : undefined;
                    const mappedApplication: CompanySideApplication = {
                        // IDs - preserve both formats
                        id: getString(applicationData.id || applicationData._id),
                        _id: getString(applicationData.id || applicationData._id),
                        jobId: getString(applicationData.job_id),
                        job_id: getString(applicationData.job_id),
                        seekerId: getString(applicationData.seeker_id),
                        seeker_id: getString(applicationData.seeker_id),
                        companyId: getString(applicationData.company_id),
                        company_id: getString(applicationData.company_id),

                        // Stage info
                        stage: getString(applicationData.stage),
                        subStage: getString(applicationData.sub_stage),
                        sub_stage: getString(applicationData.sub_stage),

                        // Resume and cover letter - preserve both formats
                        resumeUrl: getString(applicationData.resume_url),
                        resume_url: getString(applicationData.resume_url),
                        resume_filename: getString(applicationData.resume_filename),
                        coverLetter: getString(applicationData.cover_letter),
                        cover_letter: getString(applicationData.cover_letter),

                        // Dates - preserve both formats
                        createdAt: getString(applicationData.created_at),
                        created_at: getString(applicationData.created_at),
                        updatedAt: getString(applicationData.updated_at),
                        updated_at: getString(applicationData.updated_at),
                        applied_date: getString(applicationData.applied_date),
                        appliedAt: getString(applicationData.applied_date),

                        // Seeker info - preserve all fields
                        seeker_name: getString(applicationData.seeker_name),
                        seeker_avatar: getString(applicationData.seeker_avatar),
                        seeker_headline: getString(applicationData.seeker_headline),
                        name: getString(
                            applicationData.seeker_name || applicationData.full_name
                        ),
                        full_name: getString(
                            applicationData.full_name || applicationData.seeker_name
                        ),
                        email: getString(applicationData.email),
                        phone: getString(applicationData.phone),
                        score: getNumber(applicationData.score),
                        avatar: getString(applicationData.seeker_avatar),

                        // Profile details from server
                        date_of_birth:
                            getString(applicationData.date_of_birth) ||
                            (applicationData.date_of_birth as Date | undefined),
                        gender: getString(applicationData.gender),
                        languages: getStringArray(applicationData.languages),
                        address: getString(applicationData.address),
                        about_me: getString(applicationData.about_me),
                        skills: getStringArray(applicationData.skills),
                        resume_data:
                            applicationData.resume_data as CompanySideApplication["resume_data"],

                        // Nested objects
                        seeker: applicationData.seeker_id
                            ? {
                                id: getString(applicationData.seeker_id) || "",
                                name: getString(applicationData.seeker_name) || "",
                                email: getString(applicationData.email) || "",
                                avatar: getString(applicationData.seeker_avatar),
                            }
                            : undefined,
                        job: applicationData.job_id
                            ? {
                                id: getString(applicationData.job_id) || "",
                                title: getString(applicationData.job_title) || "",
                                job_title: getString(applicationData.job_title),
                                job_company: getString(applicationData.job_company),
                                job_location: getString(applicationData.job_location),
                                job_type: getString(applicationData.job_type),
                            }
                            : undefined,
                    };

                    setAtsApplication(mappedApplication);

                    // Get IDs for parallel fetching
                    const jobId =
                        getString(applicationData.job_id) ||
                        mappedApplication.jobId ||
                        mappedApplication.job?.id;
                    const seekerId =
                        getString(applicationData.seeker_id) ||
                        mappedApplication.seekerId ||
                        mappedApplication.seeker?.id;
                    const currentStage = mappedApplication.stage;

                    // Fetch Job Details, Candidate Details, and ATS Activities in parallel
                    const fetchPromises = [
                        // Job Details
                        jobId
                            ? companyApi.getJobPosting(jobId).catch((e) => {
                                console.error("Failed to fetch job", e);
                                return { data: null };
                            })
                            : Promise.resolve({ data: null }),
                        // Candidate Details
                        seekerId
                            ? companyApi.getCandidateDetails(seekerId).catch((e) => {
                                console.error("Failed to fetch candidate details", e);
                                return { data: null };
                            })
                            : Promise.resolve({ data: null }),
                        // ATS Activities
                        atsService
                            .getInterviewsByApplication(currentId)
                            .catch(() => ({ data: [] })),
                        atsService
                            .getTechnicalTasksByApplication(currentId)
                            .catch(() => ({ data: [] })),
                        atsService
                            .getOffersByApplication(currentId)
                            .catch(() => ({ data: [] })),
                        atsService
                            .getCommentsByApplication(currentId)
                            .catch(() => ({ data: [] })),
                    ];

                    // Add compensation-related fetches if in COMPENSATION stage
                    if (currentStage === ATSStage.COMPENSATION) {
                        fetchPromises.push(
                            atsService.getCompensation(currentId).catch((err) => {
                                console.error("Failed to fetch compensation:", err);
                                return null;
                            }),
                            atsService.getCompensationMeetings(currentId).catch((err) => {
                                console.error("Failed to fetch meetings:", err);
                                return [];
                            })
                        );
                    }

                    const results = await Promise.all(fetchPromises);
                    const [
                        jobRes,
                        candRes,
                        interviewsRes,
                        tasksRes,
                        offersRes,
                        commentsRes,
                        ...compensationResults
                    ] = results;

                    if (jobRes.data) {
                        setAtsJob(jobRes.data);
                    }

                    if (candRes.data) {
                        setCandidateData(candRes.data);
                    } else if (
                        getString(applicationData.seeker_name) ||
                        getString(applicationData.email)
                    ) {
                        // Minimal candidate data fallback
                        const resumeData = applicationData.resume_data as
                            | {
                                experience?: Array<Record<string, unknown>>;
                                education?: Array<Record<string, unknown>>;
                            }
                            | undefined;
                        setCandidateData({
                            profile: {
                                name: getString(applicationData.seeker_name || applicationData.full_name) || "",
                                email: getString(applicationData.email) || "",
                                avatarUrl: getString(applicationData.seeker_avatar),
                                headline: getString(applicationData.seeker_headline),
                                summary: getString(applicationData.about_me),
                                skills: getStringArray(applicationData.skills) || [],
                                languages: getStringArray(applicationData.languages) || [],
                                dateOfBirth: getString(applicationData.date_of_birth),
                                gender: getString(applicationData.gender),
                                phone: getString(applicationData.phone),
                                location: getString(applicationData.address),
                            },
                            user: {
                                _id: getString(applicationData.seeker_id) || "",
                                name: getString(applicationData.seeker_name || applicationData.full_name) || "",
                                email: getString(applicationData.email) || "",
                            },
                            experiences:
                                resumeData?.experience?.map((exp: Record<string, unknown>) => {
                                    const period = typeof exp.period === "string" ? exp.period : "";
                                    return {
                                        id: "",
                                        title: typeof exp.title === "string" ? exp.title : "",
                                        company: typeof exp.company === "string" ? exp.company : "",
                                        startDate: period.split(" - ")[0] || "",
                                        endDate: period.includes("Present") ? undefined : period.split(" - ")[1],
                                        location: typeof exp.location === "string" ? exp.location : undefined,
                                        description: typeof exp.description === "string" ? exp.description : undefined,
                                        employmentType: "full-time",
                                        isCurrent: period.includes("Present") || false,
                                        technologies: [],
                                    };
                                }) || [],
                            educations: [],
                        } as CandidateDetailsResponse);
                    }

                    setInterviews(interviewsRes.data || []);
                    setTechnicalTasks(tasksRes.data || []);
                    setOfferDocuments(offersRes.data || []);

                    const applicationStage = mappedApplication.stage;
                    if (
                        applicationStage === ATSStage.OFFER &&
                        offersRes.data &&
                        offersRes.data.length > 0
                    ) {
                        setCurrentOffer(offersRes.data[0]);
                    } else {
                        setCurrentOffer(null);
                    }
                    setComments(commentsRes.data || []);

                    if (
                        currentStage === ATSStage.COMPENSATION &&
                        compensationResults.length >= 2
                    ) {
                        const [compensationRes, meetingsRes] = compensationResults;
                        setCompensationData(compensationRes || null);

                        const meetingsData: CompensationMeeting[] = Array.isArray(meetingsRes)
                            ? meetingsRes
                                .filter((m): m is CompensationMeeting => m != null)
                                .map((m) => ({
                                    ...m,
                                    id: String(m.id || ""),
                                    scheduledDate: String(m.scheduledDate || ""),
                                }))
                            : [];
                        setCompensationMeetings(meetingsData);
                    } else {
                        setCompensationData(null);
                        setCompensationMeetings([]);
                        setCompensationNotes([]);
                    }
                }
            } else {
                // Non-ATS Mode
                try {
                    const candRes = await companyApi.getCandidateDetails(currentId);
                    if (candRes.data) {
                        setCandidateData(candRes.data);
                    }
                } catch (e: unknown) {
                    console.error("Failed to fetch candidate details", e);
                    const error = e as { response?: { status?: number; data?: { message?: string; data?: { limitExceeded?: boolean; currentLimit?: number; used?: number } } } };
                    if (error.response?.status === 403 && error.response.data?.data?.limitExceeded) {
                        setShowLimitExceededDialog(true);
                        setLimitExceededData({
                            currentLimit: error.response.data.data.currentLimit || 0,
                            used: error.response.data.data.used || 0,
                        });
                    } else {
                        toast({
                            title: "Error",
                            description: error.response?.data?.message || "Failed to load candidate data.",
                            variant: "destructive",
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
            toast({
                title: "Error",
                description: "Failed to load candidate data.",
                variant: "destructive",
            });
        }
    }, [currentId, isATSMode]);

    useEffect(() => {
        const loadData = async () => {
            if (!currentId) return;
            setLoading(true);
            await reloadData();
            setLoading(false);
        };
        loadData();
    }, [currentId, isATSMode, reloadData]);

    return {
        candidateData,
        atsApplication,
        setAtsApplication, // Export setter to update local state
        atsJob,
        interviews,
        technicalTasks,
        offerDocuments,
        comments,
        setComments,
        loading,
        compensationData,
        setCompensationData,
        compensationNotes,
        compensationMeetings,
        setCompensationMeetings,
        currentOffer,
        showLimitExceededDialog,
        setShowLimitExceededDialog,
        limitExceededData,
        reloadData,
    };
};
