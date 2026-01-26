import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CompanyLayout from "@/components/layouts/CompanyLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScoreBadge } from "@/components/ui/score-badge";
import {
  Loader2,
  ArrowLeft,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Video,
  Star,
  Plus,
  X,
  Globe,
  ExternalLink,
  Briefcase,
  User,
  Download,
  MapPin,
  Instagram,
  Twitter,
  File as FileIcon,
  Edit,
  XCircle,
  DollarSign,
  TrendingUp,
  CheckCircle,
  FileText,
  Bell,
  UserCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { companyApi } from "@/api/company.api";
import { atsService } from "@/services/ats.service";
import { chatApi } from "@/api/chat.api";
import { toast } from "@/hooks/use-toast";
import { ScheduleInterviewModal } from "@/components/company/ats/ScheduleInterviewModal";
import { AddCommentModal } from "@/components/company/ats/AddCommentModal";
import { MoveToStageModal } from "@/components/company/ats/MoveToStageModal";
import { InterviewFeedbackModal } from "@/components/company/ats/InterviewFeedbackModal";
import { AssignTaskModal } from "@/components/company/ats/AssignTaskModal";
import { CompensationInitModal } from "@/components/company/ats/CompensationInitModal";
import { CompensationUpdateModal } from "@/components/company/ats/CompensationUpdateModal";
import { CompensationMeetingModal } from "@/components/company/ats/CompensationMeetingModal";
import { CreateOfferModal } from "@/components/company/ats/CreateOfferModal";
import { StageBasedActivityView } from "@/components/company/ats/StageBasedActivityView";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { CandidateDetailsResponse } from "@/api/company.api";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import type {
  ATSInterview,
  ATSComment,
  ATSTechnicalTask,
  ATSOfferDocument,
} from "@/types/ats";

type ExtendedATSTechnicalTask = ATSTechnicalTask & {
  documentUrl?: string;
  documentFilename?: string;
  submissionUrl?: string;
  submissionFilename?: string;
  submissionLink?: string;
  submissionNote?: string;
  submittedAt?: string;
};

type ExtendedATSOfferDocument = ATSOfferDocument & {
  documentUrl?: string;
  documentFilename?: string;
  offerAmount?: string;
  sentAt?: string;
  signedAt?: string;
  declinedAt?: string;
  signedDocumentUrl?: string;
  signedDocumentFilename?: string;
  withdrawalReason?: string;
  withdrawnByName?: string;
  declineReason?: string;
  employmentType?: string;
};
import {
  ATSStage,
  STAGE_SUB_STAGES,
  ATSStageDisplayNames,
  ShortlistedSubStage,
  InterviewSubStage,
  TechnicalTaskSubStage,
  CompensationSubStage,
  OfferSubStage,
  SubStageDisplayNames,
} from "@/constants/ats-stages";

interface ATSActivity {
  id: string;
  applicationId: string;
  type: string;
  title: string;
  description: string;
  performedBy: string;
  performedByName: string;
  stage?: ATSStage;
  subStage?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

interface CompensationMeeting {
  id?: string;
  type: "call" | "online" | "in-person";
  scheduledDate: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  status?: "scheduled" | "completed" | "cancelled";
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

const CandidateProfileView = () => {
  const { id, candidateId } = useParams<{
    id?: string;
    candidateId?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

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
  const [activeTab, setActiveTab] = useState<
    "profile" | "resume" | "hiring" | "activity"
  >("profile");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [activities, setActivities] = useState<ATSActivity[]>([]);
  const [activitiesNextCursor, setActivitiesNextCursor] = useState<
    string | null
  >(null);
  const [activitiesHasMore, setActivitiesHasMore] = useState(false);
  const [loadingMoreActivities, setLoadingMoreActivities] = useState(false);

  // Modals
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showMoveToStageModal, setShowMoveToStageModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] =
    useState<ATSInterview | null>(null);
  const [selectedInterviewForReschedule, setSelectedInterviewForReschedule] =
    useState<ATSInterview | null>(null);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [selectedTaskForReview, setSelectedTaskForReview] =
    useState<ExtendedATSTechnicalTask | null>(null);
  const [showLimitExceededDialog, setShowLimitExceededDialog] = useState(false);
  const [limitExceededData, setLimitExceededData] = useState<{ currentLimit: number; used: number } | null>(null);
  const [selectedTaskForEdit, setSelectedTaskForEdit] =
    useState<ExtendedATSTechnicalTask | null>(null);
  const [showRevokeConfirmDialog, setShowRevokeConfirmDialog] = useState(false);
  const [showRejectConfirmDialog, setShowRejectConfirmDialog] = useState(false);
  const [taskToRevoke, setTaskToRevoke] = useState<string | null>(null);

  // Compensation state
  const [compensationData, setCompensationData] = useState<{
    candidateExpected?: string;
    companyProposed?: string;
    finalAgreed?: string;
    expectedJoining?: string;
    benefits?: string[];
    approvedAt?: string;
    approvedBy?: string;
    approvedByName?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null>(null);
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
  const [showCompensationInitModal, setShowCompensationInitModal] =
    useState(false);
  const [showCompensationUpdateModal, setShowCompensationUpdateModal] =
    useState(false);
  const [showCompensationMeetingModal, setShowCompensationMeetingModal] =
    useState(false);
  const [selectedMeetingForEdit, setSelectedMeetingForEdit] =
    useState<CompensationMeeting | null>(null);

  // Offer state
  const [currentOffer, setCurrentOffer] =
    useState<ExtendedATSOfferDocument | null>(null);
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [showEditOfferModal] = useState(false);

  const [showWithdrawOfferModal, setShowWithdrawOfferModal] = useState(false);

  const [withdrawReason, setWithdrawReason] = useState<string>("");

  const [withdrawOtherNote, setWithdrawOtherNote] = useState<string>("");

  const [withdrawing, setWithdrawing] = useState(false);

  const isATSMode =
    location.pathname.includes("/ats/candidate/") ||
    location.pathname.includes("/company/applicants/");
  const currentId = candidateId || id;

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "CN"
    );
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

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
          // Don't set selectedStage here - let the useEffect handle it when hiring tab is active

          // Get IDs for parallel fetching - use both snake_case and camelCase
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
            // Candidate Details - use server data if available, otherwise fetch
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
            // Activity Logs - use paginated API
            atsService
              .getActivitiesByApplicationPaginated(currentId, 20)
              .catch(() => ({
                activities: [],
                nextCursor: null,
                hasMore: false,
              })),
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
              }),
              atsService.getCompensationNotes(currentId).catch((err) => {
                console.error("Failed to fetch notes:", err);
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
            activitiesRes,
            ...compensationResults
          ] = results;

          // Set job data
          if (jobRes.data) {
            setAtsJob(jobRes.data);
          }

          // Set candidate data - prioritize fetched data, but use application data as fallback
          if (candRes.data) {
            setCandidateData(candRes.data);
          } else if (
            getString(applicationData.seeker_name) ||
            getString(applicationData.email)
          ) {
            // If candidate details fetch failed but we have data in application, create minimal candidate data
            const resumeData = applicationData.resume_data as
              | {
                experience?: Array<Record<string, unknown>>;
                education?: Array<Record<string, unknown>>;
              }
              | undefined;
            setCandidateData({
              profile: {
                name:
                  getString(
                    applicationData.seeker_name || applicationData.full_name
                  ) || "",
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
                name:
                  getString(
                    applicationData.seeker_name || applicationData.full_name
                  ) || "",
                email: getString(applicationData.email) || "",
              },
              experiences:
                resumeData?.experience?.map((exp: Record<string, unknown>) => {
                  const period =
                    typeof exp.period === "string" ? exp.period : "";
                  return {
                    id: "",
                    title: typeof exp.title === "string" ? exp.title : "",
                    company: typeof exp.company === "string" ? exp.company : "",
                    startDate: period.split(" - ")[0] || "",
                    endDate: period.includes("Present")
                      ? undefined
                      : period.split(" - ")[1],
                    location:
                      typeof exp.location === "string"
                        ? exp.location
                        : undefined,
                    description:
                      typeof exp.description === "string"
                        ? exp.description
                        : undefined,
                    employmentType: "full-time",
                    technologies: [],
                    isCurrent: period.includes("Present") || false,
                  };
                }) || [],
              educations:
                resumeData?.education?.map((edu: Record<string, unknown>) => {
                  const period =
                    typeof edu.period === "string" ? edu.period : "";
                  return {
                    id: "",
                    school: typeof edu.school === "string" ? edu.school : "",
                    degree:
                      typeof edu.degree === "string" ? edu.degree : undefined,
                    startDate: period.split(" - ")[0] || "",
                    endDate: period.includes("Present")
                      ? undefined
                      : period.split(" - ")[1],
                    fieldOfStudy: "",
                    grade: undefined,
                  };
                }) || [],
            } as CandidateDetailsResponse);
          }

          // Set ATS activities
          setInterviews(interviewsRes.data || []);
          setTechnicalTasks(tasksRes.data || []);
          setOfferDocuments(offersRes.data || []);
          // Set current offer if in offer stage
          const applicationStage = mappedApplication.stage;
          if (
            applicationStage === ATSStage.OFFER &&
            offersRes.data &&
            offersRes.data.length > 0
          ) {
            setCurrentOffer(offersRes.data[0]); // Get the most recent offer
          } else {
            setCurrentOffer(null);
          }
          setComments(commentsRes.data || []);
          // Handle paginated activities response
          // The service returns response.data?.data || response.data, so activitiesRes is already the inner data
          const activitiesData = activitiesRes || {
            activities: [],
            nextCursor: null,
            hasMore: false,
          };
          // Backend now returns newest first, but we want chronological order (oldest first) for timeline
          // So we reverse the array to get oldest first
          const initialActivities = (activitiesData.activities || []).reverse();
          setActivities(initialActivities);
          setActivitiesNextCursor(activitiesData.nextCursor || null);
          setActivitiesHasMore(activitiesData.hasMore || false);

          // Handle compensation data if in compensation stage
          if (
            currentStage === ATSStage.COMPENSATION &&
            compensationResults.length >= 3
          ) {
            const [compensationRes, meetingsRes, notesRes] =
              compensationResults;

            setCompensationData(compensationRes || null);
            const meetingsData: CompensationMeeting[] = Array.isArray(
              meetingsRes
            )
              ? meetingsRes
                .filter((m): m is CompensationMeeting => m != null)
                .map((m) => ({
                  id:
                    typeof m === "object" && m !== null && "id" in m
                      ? String(m.id)
                      : undefined,
                  type:
                    typeof m === "object" &&
                      m !== null &&
                      "type" in m &&
                      (m.type === "call" ||
                        m.type === "online" ||
                        m.type === "in-person")
                      ? m.type
                      : "call",
                  scheduledDate:
                    typeof m === "object" &&
                      m !== null &&
                      "scheduledDate" in m
                      ? String(m.scheduledDate)
                      : "",
                  location:
                    typeof m === "object" && m !== null && "location" in m
                      ? String(m.location)
                      : undefined,
                  meetingLink:
                    typeof m === "object" && m !== null && "meetingLink" in m
                      ? String(m.meetingLink)
                      : undefined,
                  notes:
                    typeof m === "object" && m !== null && "notes" in m
                      ? String(m.notes)
                      : undefined,
                  status:
                    typeof m === "object" &&
                      m !== null &&
                      "status" in m &&
                      (m.status === "scheduled" ||
                        m.status === "completed" ||
                        m.status === "cancelled")
                      ? m.status
                      : undefined,
                  completedAt:
                    typeof m === "object" && m !== null && "completedAt" in m
                      ? String(m.completedAt)
                      : undefined,
                  createdAt:
                    typeof m === "object" && m !== null && "createdAt" in m
                      ? String(m.createdAt)
                      : new Date().toISOString(),
                  updatedAt:
                    typeof m === "object" && m !== null && "updatedAt" in m
                      ? String(m.updatedAt)
                      : undefined,
                }))
              : [];
            setCompensationMeetings(meetingsData);
            setCompensationNotes(Array.isArray(notesRes) ? notesRes : []);
          } else {
            // Clear compensation data if not in compensation stage
            setCompensationData(null);
            setCompensationMeetings([]);
            setCompensationNotes([]);
          }
        }
      } else {
        // Non-ATS Mode: Fetch candidate details directly
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

  // Derived State for Hiring Stages
  const hiringStages = useMemo(() => {
    const allStages =
      (atsJob?.enabled_stages as string[]) || Object.values(ATSStage);

    // Always include APPLIED as the first stage
    const stagesWithApplied = ["APPLIED", ...allStages];

    // Determine current stage - applications start in IN_REVIEW, so APPLIED is always completed for active applications
    // APPLIED is shown for reference to represent the initial application state
    const currentStage = atsApplication?.stage || ATSStage.IN_REVIEW;
    // Find the index of current stage in the stages array (APPLIED is at index 0, IN_REVIEW at index 1, etc.)
    const currentStageIndex = stagesWithApplied.indexOf(currentStage);
    // If current stage index is -1 (not found), default to 1 (IN_REVIEW position)
    const finalCurrentStageIndex =
      currentStageIndex >= 0 ? currentStageIndex : 1;

    // APPLIED is completed if we have any stage set (since applications start in IN_REVIEW, not APPLIED)
    const isAppliedCompleted =
      currentStage !== undefined && currentStage !== "APPLIED";

    return stagesWithApplied.map((stage, index) => {
      const isApplied = stage === "APPLIED";
      const isCompleted = isApplied
        ? isAppliedCompleted
        : index < finalCurrentStageIndex;
      const isCurrent = index === finalCurrentStageIndex;
      const isDisabled = index > finalCurrentStageIndex;

      return {
        key: stage,
        label: isApplied ? "Applied" : ATSStageDisplayNames[stage] || stage,
        completed: isCompleted,
        current: isCurrent,
        disabled: isDisabled,
      };
    });
  }, [atsApplication, atsJob]);

  // Set selected stage to current stage when hiring tab becomes active or when application stage changes
  useEffect(() => {
    if (activeTab === "hiring") {
      if (atsApplication?.stage) {
        // Always select the current application stage when viewing hiring tab
        setSelectedStage(atsApplication.stage);
      }
    }
  }, [activeTab, atsApplication?.stage]);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleUpdateStage = async (stage: string, subStage?: string) => {
    if (!currentId) {
      console.error("No currentId found");
      return;
    }

    try {
      const requestData = {
        stage,
        ...(subStage && subStage !== "" ? { subStage } : {}),
      };

      await atsService.updateApplicationStage(currentId, requestData);
      toast({ title: "Success", description: "Stage updated successfully." });
      await reloadData();
    } catch (error) {
      console.error("Failed to update stage:", error);
      toast({
        title: "Error",
        description: "Failed to update stage.",
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (comment: string) => {
    if (!currentId || !atsApplication) return;

    try {
      // If selectedStage is 'APPLIED' or 'Applied', use the actual application stage (which should be IN_REVIEW)
      // APPLIED is only a UI display stage, not a real ATS stage
      const validStage =
        selectedStage === "APPLIED" || selectedStage === "Applied"
          ? atsApplication.stage || ATSStage.IN_REVIEW
          : atsApplication.stage || selectedStage || ATSStage.IN_REVIEW;

      await atsService.addComment({
        applicationId: currentId,
        comment,
        stage: validStage as ATSStage,
        subStage: atsApplication.subStage,
      });
      toast({ title: "Success", description: "Comment added successfully." });
      await reloadData();
      setShowCommentModal(false);
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment.",
        variant: "destructive",
      });
    }
  };

  const handleMoveToStage = async (targetStage: ATSStage, reason?: string) => {
    if (!currentId || !atsApplication) return;

    try {
      // Set default substage when moving to specific stages
      let subStage: string | undefined;
      if (targetStage === ATSStage.SHORTLISTED) {
        subStage = ShortlistedSubStage.READY_FOR_INTERVIEW;
      } else if (targetStage === ATSStage.INTERVIEW) {
        // When moving to INTERVIEW, set to NOT_SCHEDULED
        // Candidate is ready for interview, but nothing is scheduled yet
        subStage = InterviewSubStage.NOT_SCHEDULED;
      } else if (targetStage === ATSStage.TECHNICAL_TASK) {
        // When moving to TECHNICAL_TASK, set to NOT_ASSIGNED (no task assigned yet)
        subStage = TechnicalTaskSubStage.NOT_ASSIGNED;
      } else if (targetStage === ATSStage.COMPENSATION) {
        // When moving to COMPENSATION, set to NOT_INITIATED (no discussion started yet)
        subStage = CompensationSubStage.NOT_INITIATED;
      } else if (targetStage === ATSStage.OFFER) {
        // When moving to OFFER, set to NOT_SENT (no offer created yet)
        subStage = OfferSubStage.NOT_SENT;
      }

      // Use the moveApplicationStage API with the reason as a comment
      await companyApi.moveApplicationStage(currentId, {
        nextStage: targetStage,
        subStage: subStage,
        comment:
          reason ||
          `Moved to ${ATSStageDisplayNames[targetStage] || targetStage}`,
      });
      toast({
        title: "Success",
        description: "Candidate moved to new stage successfully.",
      });
      await reloadData();
      setShowMoveToStageModal(false);
    } catch (error) {
      console.error("Failed to move stage:", error);
      toast({
        title: "Error",
        description: "Failed to move stage.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleInterview = async (
    data: {
      title: string;
      type: "online" | "offline";
      videoType?: "in-app" | "external";
      date: string;
      time: string;
      location?: string;
      meetingLink?: string;
      notes?: string;
    },
    interviewId?: string
  ) => {
    if (!currentId) return;

    try {
      const scheduledDate = new Date(data.date + "T" + data.time);

      // If interviewId is provided, this is a reschedule - update existing interview
      if (interviewId) {
        await atsService.updateInterview(interviewId, {
          status: "cancelled",
        });

        // Create new interview with updated details
        await atsService.scheduleInterview({
          applicationId: currentId,
          title: data.title,
          scheduledDate: scheduledDate.toISOString(),
          type: data.type,
          videoType: data.videoType,
          meetingLink:
            data.videoType === "external" ? data.meetingLink : undefined,
          location: data.location,
        });
      } else {
        // Create new interview
        await atsService.scheduleInterview({
          applicationId: currentId,
          title: data.title,
          scheduledDate: scheduledDate.toISOString(),
          type: data.type,
          videoType: data.videoType,
          meetingLink:
            data.videoType === "external" ? data.meetingLink : undefined,
          location: data.location,
        });

        // Move to INTERVIEW stage if not already there
        if (atsApplication?.stage !== ATSStage.INTERVIEW) {
          await companyApi.moveApplicationStage(currentId, {
            nextStage: ATSStage.INTERVIEW,
            subStage: InterviewSubStage.SCHEDULED,
            comment: "Interview scheduled",
          });
        } else {
          // If already in INTERVIEW stage, update substage to SCHEDULED if not already
          if (
            atsApplication.subStage !== InterviewSubStage.SCHEDULED &&
            atsApplication.subStage !== InterviewSubStage.EVALUATION_PENDING
          ) {
            await companyApi.updateApplicationSubStage(currentId, {
              subStage: InterviewSubStage.SCHEDULED,
              comment: "Interview scheduled",
            });
          }
        }
      }
      await reloadData();
      // Auto-update substage based on interview status
      await updateInterviewSubStageBasedOnStatus();
      toast({
        title: "Success",
        description: interviewId
          ? "Interview rescheduled successfully."
          : "Interview scheduled successfully.",
      });
      setShowScheduleModal(false);
      setSelectedInterviewForReschedule(null);
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      toast({
        title: "Error",
        description: interviewId
          ? "Failed to reschedule interview."
          : "Failed to schedule interview.",
        variant: "destructive",
      });
    }
  };

  // Helper function to update interview substage based on interview status
  const updateInterviewSubStageBasedOnStatus = async () => {
    if (
      !currentId ||
      !atsApplication ||
      atsApplication.stage !== ATSStage.INTERVIEW
    )
      return;

    try {
      // Reload to get latest interview data
      const interviewsRes = await atsService.getInterviewsByApplication(
        currentId
      );
      const activeInterviews = (interviewsRes.data || []).filter(
        (i: ATSInterview) => i.status !== "cancelled"
      );
      const hasScheduledInterviews = activeInterviews.some(
        (i: ATSInterview) => i.status === "scheduled"
      );
      const allCompleted =
        activeInterviews.length > 0 &&
        activeInterviews.every((i: ATSInterview) => i.status === "completed");

      let targetSubStage: string | undefined = undefined;
      // If all interviews are completed (no scheduled interviews), set to EVALUATION_PENDING
      if (
        allCompleted &&
        activeInterviews.length > 0 &&
        !hasScheduledInterviews
      ) {
        targetSubStage = InterviewSubStage.EVALUATION_PENDING;
      } else if (hasScheduledInterviews) {
        // If there are scheduled interviews, set to SCHEDULED
        targetSubStage = InterviewSubStage.SCHEDULED;
      }

      if (targetSubStage && atsApplication.subStage !== targetSubStage) {
        await companyApi.updateApplicationSubStage(currentId, {
          subStage: targetSubStage,
          comment: allCompleted
            ? "All interviews completed"
            : "Interview status updated",
        });
        await reloadData();
      }
    } catch (error) {
      console.error("Failed to update interview substage:", error);
    }
  };

  const handleMarkInterviewComplete = async (interviewId: string) => {
    if (!currentId) return;
    try {
      await atsService.updateInterview(interviewId, {
        status: "completed",
      });
      await reloadData();
      // Auto-update substage after marking complete
      await updateInterviewSubStageBasedOnStatus();
      toast({
        title: "Success",
        description: "Interview marked as completed.",
      });
    } catch (error) {
      console.error("Failed to mark interview as completed:", error);
      toast({
        title: "Error",
        description: "Failed to mark interview as completed.",
        variant: "destructive",
      });
    }
  };

  const handleCancelInterview = async (interviewId: string) => {
    if (!currentId) return;
    try {
      await atsService.updateInterview(interviewId, {
        status: "cancelled",
      });
      await reloadData();
      // Auto-update substage after cancellation
      await updateInterviewSubStageBasedOnStatus();
      toast({ title: "Success", description: "Interview cancelled." });
    } catch (error) {
      console.error("Failed to cancel interview:", error);
      toast({
        title: "Error",
        description: "Failed to cancel interview.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitFeedback = async (
    interviewId: string,
    rating: number,
    feedback: string
  ) => {
    if (!currentId) return;
    try {
      await atsService.updateInterview(interviewId, {
        rating,
        feedback,
      });
      await reloadData();
      // Don't update substage when feedback is added - only update when interviews are marked as completed
      toast({
        title: "Success",
        description: "Feedback submitted successfully.",
      });
      setShowFeedbackModal(false);
      setSelectedInterviewForFeedback(null);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
        variant: "destructive",
      });
      throw error; // Re-throw to let modal handle error display
    }
  };

  // Technical Task handlers
  const handleAssignTask = async (taskData: {
    title: string;
    description: string;
    deadline: string;
    documentUrl?: string;
    documentFilename?: string;
    document?: File;
  }) => {
    if (!currentId) return;
    try {
      if (selectedTaskForEdit?.id) {
        // Edit existing task
        await atsService.updateTechnicalTask(selectedTaskForEdit.id, {
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline,
          document: taskData.document,
          documentUrl: taskData.documentUrl,
          documentFilename: taskData.documentFilename,
        });
        toast({
          title: "Success",
          description: "Technical task updated successfully.",
        });
      } else {
        // Assign new task
        await atsService.assignTechnicalTask({
          applicationId: currentId,
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline,
          document: taskData.document,
          documentUrl: taskData.documentUrl,
          documentFilename: taskData.documentFilename,
        });

        // Update substage to ASSIGNED after task is assigned
        if (atsApplication?.stage === ATSStage.TECHNICAL_TASK) {
          await companyApi.moveApplicationStage(currentId, {
            nextStage: ATSStage.TECHNICAL_TASK,
            subStage: TechnicalTaskSubStage.ASSIGNED,
            comment: `Technical task assigned – Due ${new Date(
              taskData.deadline
            ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`,
          });
        }
        toast({
          title: "Success",
          description: "Technical task assigned successfully.",
        });
      }

      await reloadData();
      setShowAssignTaskModal(false);
      setSelectedTaskForEdit(null);
    } catch (error) {
      console.error("Failed to assign/update task:", error);
      toast({
        title: "Error",
        description: selectedTaskForEdit
          ? "Failed to update task."
          : "Failed to assign task.",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = (task: ExtendedATSTechnicalTask) => {
    setSelectedTaskForEdit(task);
    setShowAssignTaskModal(true);
  };

  const handleRevokeTaskClick = (taskId: string) => {
    setTaskToRevoke(taskId);
    setShowRevokeConfirmDialog(true);
  };

  const handleRevokeTask = async () => {
    if (!currentId || !taskToRevoke) return;
    try {
      await atsService.updateTechnicalTask(taskToRevoke, {
        status: "cancelled",
      });
      toast({ title: "Success", description: "Task revoked successfully." });
      await reloadData();

      // Check if there are no active tasks and update substage to NOT_ASSIGNED
      const tasksRes = await atsService.getTechnicalTasksByApplication(
        currentId
      );
      const allTasks = tasksRes.data || [];
      const activeTasks = allTasks.filter(
        (t: ExtendedATSTechnicalTask) => t.status !== "completed"
      );
      if (
        activeTasks.length === 0 &&
        atsApplication?.stage === ATSStage.TECHNICAL_TASK
      ) {
        await companyApi.moveApplicationStage(currentId, {
          nextStage: ATSStage.TECHNICAL_TASK,
          subStage: TechnicalTaskSubStage.NOT_ASSIGNED,
          comment: "All active tasks revoked",
        });
        await reloadData();
      }
      setShowRevokeConfirmDialog(false);
      setTaskToRevoke(null);
    } catch (error) {
      console.error("Failed to revoke task:", error);
      toast({
        title: "Error",
        description: "Failed to revoke task.",
        variant: "destructive",
      });
    }
  };

  // Compensation handlers
  const handleInitiateCompensation = async (data: {
    candidateExpected: string;
    companyProposed?: string;
    benefits?: string[];
    expectedJoining?: string;
    notes?: string;
  }) => {
    if (!currentId) return;
    try {
      const existingCompensation = compensationData;
      let compensationRes;

      if (existingCompensation) {
        // Update existing compensation - update all fields
        compensationRes = await atsService.updateCompensation(currentId, {
          candidateExpected: data.candidateExpected,
          companyProposed: data.companyProposed,
          benefits: data.benefits,
          expectedJoining: data.expectedJoining,
        });
      } else {
        // Initiate new compensation
        compensationRes = await atsService.initiateCompensation(currentId, {
          candidateExpected: data.candidateExpected,
          notes: data.notes,
        });
        // If companyProposed, benefits, or expectedJoining are provided, update them
        if (
          data.companyProposed ||
          (data.benefits && data.benefits.length > 0) ||
          data.expectedJoining
        ) {
          compensationRes = await atsService.updateCompensation(currentId, {
            companyProposed: data.companyProposed,
            benefits: data.benefits,
            expectedJoining: data.expectedJoining,
          });
        }
      }

      // Update substage to INITIATED if not already
      if (atsApplication?.subStage === CompensationSubStage.NOT_INITIATED) {
        await companyApi.moveApplicationStage(currentId, {
          nextStage: ATSStage.COMPENSATION,
          subStage: CompensationSubStage.INITIATED,
          comment: `Compensation discussion initiated - Candidate expects ${data.candidateExpected}`,
        });
      }

      // Update local state immediately without full reload
      const updatedCompensation = compensationRes.data || compensationRes;
      setCompensationData(updatedCompensation);

      if (data.notes) {
        await atsService.addCompensationNote(currentId, { note: data.notes });
        const notesRes = await atsService.getCompensationNotes(currentId);
        setCompensationNotes(notesRes.data || []);
      }

      // Update application state
      if (atsApplication) {
        setAtsApplication({
          ...atsApplication,
          subStage: CompensationSubStage.INITIATED,
        });
      }

      toast({
        title: "Success",
        description: existingCompensation
          ? "Expected salary updated successfully."
          : "Compensation discussion started successfully.",
      });
    } catch (error) {
      console.error("Failed to initiate/update compensation:", error);
      toast({
        title: "Error",
        description: "Failed to save expected salary.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCompensation = async (data: {
    companyProposed?: string;
    expectedJoining?: string;
    benefits?: string[];
    notes?: string;
  }) => {
    if (!currentId) return;
    try {
      // Check if this is a subsequent update (compensation already has companyProposed or was updated before)
      const isSubsequentUpdate =
        compensationData?.companyProposed ||
        (compensationData?.updatedAt &&
          compensationData?.createdAt &&
          new Date(compensationData.updatedAt) >
          new Date(compensationData.createdAt));

      // Update compensation
      const updatedRes = await atsService.updateCompensation(currentId, data);

      // Update local state immediately
      setCompensationData(updatedRes.data);

      // If this is a subsequent update and current substage is INITIATED, auto-move to NEGOTIATION_ONGOING
      if (
        isSubsequentUpdate &&
        atsApplication?.subStage === CompensationSubStage.INITIATED
      ) {
        await companyApi.moveApplicationStage(currentId, {
          nextStage: ATSStage.COMPENSATION,
          subStage: CompensationSubStage.NEGOTIATION_ONGOING,
          comment: "Negotiation started - Compensation updated",
        });
        // Update application state
        if (atsApplication) {
          setAtsApplication({
            ...atsApplication,
            subStage: CompensationSubStage.NEGOTIATION_ONGOING,
          });
        }
      }

      if (data.notes) {
        await atsService.addCompensationNote(currentId, { note: data.notes });
        const notesRes = await atsService.getCompensationNotes(currentId);
        setCompensationNotes(notesRes.data || []);
      }

      toast({
        title: "Success",
        description: "Compensation updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update compensation:", error);
      toast({
        title: "Error",
        description: "Failed to update compensation.",
        variant: "destructive",
      });
    }
  };

  const handleScheduleCompensationMeeting = async (data: {
    type: string;
    videoType?: "in-app" | "external";
    date: string;
    time: string;
    location?: string;
    meetingLink?: string;
    notes?: string;
  }) => {
    if (!currentId) return;
    try {
      const meetingRes = await atsService.scheduleCompensationMeeting(
        currentId,
        {
          ...data,
          meetingLink:
            data.videoType === "external" ? data.meetingLink : undefined,
        }
      );
      // Update local state immediately
      setCompensationMeetings((prev) => [...(prev || []), meetingRes.data]);
      toast({
        title: "Success",
        description: "Compensation meeting scheduled successfully.",
      });
    } catch (error) {
      console.error("Failed to schedule compensation meeting:", error);
      toast({
        title: "Error",
        description: "Failed to schedule compensation meeting.",
        variant: "destructive",
      });
    }
  };

  // Offer handlers
  const handleCreateOffer = async (data: {
    offerAmount: string;
    employmentType: string;
    joiningDate: string;
    validityDate: string;
    documentUrl?: string;
    documentFilename?: string;
    document?: File;
    notes?: string;
  }) => {
    if (!currentId) return;
    try {
      // Get the file from the modal data
      const file = data.document;

      if (!file) {
        toast({
          title: "Error",
          description: "Please upload an offer document.",
          variant: "destructive",
        });
        return;
      }

      await atsService.uploadOffer({
        applicationId: currentId,
        offerAmount: data.offerAmount,
        document: file,
      });

      // Update substage to OFFER_SENT
      await companyApi.moveApplicationStage(currentId, {
        nextStage: ATSStage.OFFER,
        subStage: OfferSubStage.OFFER_SENT,
        comment: `Offer created and sent - ${data.offerAmount}`,
      });

      if (data.notes && data.notes.trim()) {
        await atsService.addComment({
          applicationId: currentId,
          comment: data.notes.trim(),
          stage: ATSStage.OFFER,
        });
      }

      toast({
        title: "Success",
        description: "Offer created and sent successfully.",
      });
      await reloadData();
    } catch (error) {
      console.error("Failed to create offer:", error);
      toast({
        title: "Error",
        description: "Failed to create offer.",
        variant: "destructive",
      });
    }
  };

  const handleSendReminder = async () => {
    if (!currentId) return;
    try {
      toast({ title: "Success", description: "Reminder sent to candidate." });
      await atsService.addComment({
        applicationId: currentId,
        comment: "Reminder sent to candidate about pending offer",
        stage: ATSStage.OFFER,
      });
      await reloadData();
    } catch (error) {
      console.error("Failed to send reminder:", error);
      toast({
        title: "Error",
        description: "Failed to send reminder.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsHired = async () => {
    if (!currentId) return;
    try {
      await companyApi.markApplicationAsHired(currentId);
      toast({ title: "Success", description: "Candidate marked as hired." });
      await reloadData();
    } catch (error) {
      console.error("Failed to mark as hired:", error);
      toast({
        title: "Error",
        description: "Failed to mark as hired.",
        variant: "destructive",
      });
    }
  };

  const handleReviewTask = async (taskId: string) => {
    if (!currentId) return;
    try {
      // Update task status to under_review
      await atsService.updateTechnicalTask(taskId, {
        status: "under_review",
      });

      // Update substage to UNDER_REVIEW if it's not already
      if (
        atsApplication?.stage === ATSStage.TECHNICAL_TASK &&
        atsApplication?.subStage !== TechnicalTaskSubStage.UNDER_REVIEW
      ) {
        await companyApi.moveApplicationStage(currentId, {
          nextStage: ATSStage.TECHNICAL_TASK,
          subStage: TechnicalTaskSubStage.UNDER_REVIEW,
          comment: "Task review started",
        });
      }

      await reloadData();
      // Get updated task list to find the task
      const tasksRes = await atsService.getTechnicalTasksByApplication(
        currentId
      );
      const updatedTasks = tasksRes.data || [];
      const task = updatedTasks.find(
        (t: ExtendedATSTechnicalTask) => t.id === taskId
      );
      if (task) {
        setSelectedTaskForReview(task);
        setShowFeedbackModal(true);
      }
    } catch (error) {
      console.error("Failed to start review:", error);
      toast({
        title: "Error",
        description: "Failed to start review.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitTaskFeedback = async (
    taskId: string,
    rating: number,
    feedback: string
  ) => {
    if (!currentId) return;
    try {
      await atsService.updateTechnicalTask(taskId, {
        status: "completed",
        rating,
        feedback,
      });

      toast({
        title: "Success",
        description: "Feedback submitted successfully.",
      });
      await reloadData();

      // After reload, check if all tasks are completed and update substage
      const updatedTasksRes = await atsService.getTechnicalTasksByApplication(
        currentId
      );
      const updatedTasks = updatedTasksRes.data || [];
      const allTasksCompleted =
        updatedTasks.length > 0 &&
        updatedTasks.every(
          (t: ExtendedATSTechnicalTask) => t.status === "completed"
        );
      if (
        allTasksCompleted &&
        atsApplication?.stage === ATSStage.TECHNICAL_TASK
      ) {
        await companyApi.moveApplicationStage(currentId, {
          nextStage: ATSStage.TECHNICAL_TASK,
          subStage: TechnicalTaskSubStage.COMPLETED,
          comment: "Task feedback added",
        });
        await reloadData(); // Reload again to get updated substage
      }

      setShowFeedbackModal(false);
      setSelectedTaskForReview(null);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Calculate Interview Summary
  const interviewSummary = useMemo(() => {
    const scheduledInterviews = interviews.filter(
      (i) => i.status === "scheduled"
    );
    const completedInterviews = interviews.filter(
      (i) => i.status === "completed"
    );
    // EVALUATION_PENDING only when ALL completed interviews have feedback (not just some)
    const allCompletedHaveFeedback =
      completedInterviews.length > 0 &&
      completedInterviews.every((i) => i.feedback && i.rating);
    const upcomingInterview =
      scheduledInterviews.length > 0 ? scheduledInterviews[0] : null;
    const hasIncompleteInterviews = scheduledInterviews.length > 0;

    let overallStatus = "Scheduled";
    if (completedInterviews.length > 0 && !allCompletedHaveFeedback) {
      overallStatus = "Evaluation Pending";
    } else if (
      completedInterviews.length > 0 &&
      allCompletedHaveFeedback &&
      !hasIncompleteInterviews
    ) {
      overallStatus = "Ready for Decision";
    }

    return {
      overallStatus,
      interviewsConducted: completedInterviews.length,
      upcomingInterview,
      hasIncompleteInterviews,
      allCompletedHaveFeedback,
    };
  }, [interviews]);

  // Helper function to check if the selected stage is the current application stage
  const isCurrentStage = (selectedStage: string): boolean => {
    const actualStage = atsApplication?.stage || ATSStage.IN_REVIEW;
    // Handle APPLIED UI stage (maps to IN_REVIEW)
    if (selectedStage === "APPLIED" || selectedStage === "Applied") {
      return actualStage === ATSStage.IN_REVIEW;
    }
    return selectedStage === actualStage;
  };

  // Helper function to check if there are next stages available
  const hasNextStages = (currentStage: ATSStage | string): boolean => {
    const enabledStagesRaw =
      atsJob?.enabled_stages || atsJob?.enabledStages || [];
    if (!Array.isArray(enabledStagesRaw) || enabledStagesRaw.length === 0) {
      return false;
    }

    // Convert display names back to enum values if needed
    // Create reverse mapping from display name to enum value
    const displayNameToEnum = Object.entries(ATSStageDisplayNames).reduce(
      (acc, [enumValue, displayName]) => {
        acc[displayName] = enumValue;
        return acc;
      },
      {} as Record<string, string>
    );

    const allStages = enabledStagesRaw.map((stage: string) => {
      // If it's already an enum value, return as-is
      if (Object.values(ATSStage).includes(stage as ATSStage)) {
        return stage;
      }
      // Otherwise, try to convert from display name to enum
      return displayNameToEnum[stage] || stage;
    }) as ATSStage[];

    // For APPLIED stage (UI-only), always return true if there are any enabled stages
    if (currentStage === "APPLIED" || currentStage === "Applied") {
      return allStages.length > 0;
    }

    if (!currentStage) {
      return false;
    }
    const currentIndex = allStages.indexOf(currentStage as ATSStage);
    return currentIndex >= 0 && currentIndex < allStages.length - 1;
  };

  // Helper function to get the next stage after current stage
  const getNextStage = (currentStage: ATSStage | string): ATSStage | null => {
    const enabledStagesRaw =
      atsJob?.enabled_stages || atsJob?.enabledStages || [];
    if (!Array.isArray(enabledStagesRaw) || enabledStagesRaw.length === 0) {
      return null;
    }

    // Convert display names back to enum values if needed
    const displayNameToEnum = Object.entries(ATSStageDisplayNames).reduce(
      (acc, [enumValue, displayName]) => {
        acc[displayName] = enumValue;
        return acc;
      },
      {} as Record<string, string>
    );

    const allStages = enabledStagesRaw.map((stage: string) => {
      if (Object.values(ATSStage).includes(stage as ATSStage)) {
        return stage;
      }
      return displayNameToEnum[stage] || stage;
    }) as ATSStage[];

    if (
      !currentStage ||
      currentStage === "APPLIED" ||
      currentStage === "Applied"
    ) {
      return allStages.length > 0 ? allStages[0] : null;
    }

    const currentIndex = allStages.indexOf(currentStage as ATSStage);
    if (currentIndex >= 0 && currentIndex < allStages.length - 1) {
      return allStages[currentIndex + 1];
    }
    return null;
  };

  // Render Applied Stage
  const renderAppliedStage = () => {
    // Only show action buttons if this is the current stage
    // Check if user is viewing APPLIED tab AND the application is actually in APPLIED stage
    const actualStage = atsApplication?.stage;
    const isViewingApplied =
      selectedStage === "APPLIED" || selectedStage === "Applied";
    // Only show buttons when actual stage is APPLIED (not IN_REVIEW or any other stage)
    const isInAppliedStage = actualStage === "APPLIED" || !actualStage;
    const showActions = isViewingApplied && isInAppliedStage;

    return (
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <div className="text-center py-8">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Application Received
          </h3>
          <p className="text-sm text-gray-600">
            Applied on{" "}
            {atsApplication?.applied_date
              ? formatDateTime(atsApplication.applied_date)
              : "Recently"}
          </p>
        </div>

        {/* Action buttons - only show if this is the current stage */}
        {showActions && (
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              className="gap-2 bg-[#4640DE] hover:bg-[#3730A3]"
              onClick={() => {
                handleUpdateStage(ATSStage.IN_REVIEW, "PROFILE_REVIEW");
              }}
            >
              <ChevronRight className="h-4 w-4" />
              Move to In Review
            </Button>

            {/* Move to Another Stage button - only show if not last stage */}
            {(() => {
              const currentStage = atsApplication?.stage as ATSStage;
              if (!currentStage) return false;
              return hasNextStages(currentStage);
            })() && (
                <Button
                  variant="outline"
                  className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                  onClick={() => setShowMoveToStageModal(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                  Move to Another Stage
                </Button>
              )}
          </div>
        )}
      </div>
    );
  };

  // Render In Review Stage
  const renderInReviewStage = () => {
    const currentSubStage = atsApplication?.subStage || "PROFILE_REVIEW";
    const subStages = STAGE_SUB_STAGES[ATSStage.IN_REVIEW] || [];
    // Only show action buttons if this is the current stage
    const showActions = isCurrentStage(selectedStage);

    return (
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            In Review Stage
          </h3>
          {showActions && (
            <p className="text-sm text-gray-600 mb-4">
              Current sub-stage:{" "}
              <span className="font-medium text-gray-900">
                {subStages.find((s) => s.key === currentSubStage)?.label ||
                  currentSubStage}
              </span>
            </p>
          )}
        </div>

        {/* Show comments */}
        {comments.filter((c) => c.stage === ATSStage.IN_REVIEW).length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Comments</h4>
            {comments
              .filter((c) => c.stage === ATSStage.IN_REVIEW)
              .map((comment, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border">
                  <p className="text-sm text-gray-700">{comment.comment}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    by{" "}
                    {comment.recruiterName ||
                      comment.addedByName ||
                      comment.addedBy ||
                      "Recruiter"}{" "}
                    •{" "}
                    {formatDateTime(
                      comment.createdAt || comment.timestamp || ""
                    )}
                  </p>
                </div>
              ))}
          </div>
        )}

        {/* Sub-stage action buttons - only show if this is the current stage */}
        {showActions && (
          <div className="flex flex-col gap-3">
            {subStages.map((subStage, idx) => {
              // Don't show button for current sub-stage
              if (subStage.key === currentSubStage) return null;

              // Don't show "Move to Profile Review" button when current sub-stage is PENDING_DECISION
              // Once at PENDING_DECISION, you can't go back to PROFILE_REVIEW
              if (
                currentSubStage === "PENDING_DECISION" &&
                subStage.key === "PROFILE_REVIEW"
              )
                return null;

              // Only show buttons for sub-stages that can be reached from current position
              // Allow moving to any sub-stage in IN_REVIEW stage
              return (
                <Button
                  key={subStage.key}
                  variant={idx === subStages.length - 1 ? "default" : "outline"}
                  className={`gap-2 ${idx === subStages.length - 1
                    ? "bg-[#4640DE] hover:bg-[#3730A3]"
                    : ""
                    }`}
                  onClick={async () => {
                    if (!currentId) return;
                    try {
                      // Update sub-stage using the new API
                      await companyApi.updateApplicationSubStage(currentId, {
                        subStage: subStage.key,
                        comment: `Moved to ${subStage.label}`,
                      });
                      toast({
                        title: "Success",
                        description: `Moved to ${subStage.label}`,
                      });
                      await reloadData();
                    } catch (error: unknown) {
                      console.error("Failed to update sub-stage:", error);
                      toast({
                        title: "Error",
                        description:
                          (
                            error as {
                              response?: { data?: { message?: string } };
                            }
                          )?.response?.data?.message ||
                          "Failed to update sub-stage.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                  Move to {subStage.label}
                </Button>
              );
            })}

            {/* Move to next stage button - only show when in last sub-stage */}
            {currentSubStage === "PENDING_DECISION" && (
              <div className="flex gap-3 pt-2 border-t">
                <Button
                  className="flex-1 gap-2 bg-[#4640DE] hover:bg-[#3730A3]"
                  onClick={() =>
                    handleUpdateStage(
                      ATSStage.SHORTLISTED,
                      "READY_FOR_INTERVIEW"
                    )
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                  Move to Shortlisted
                </Button>
                {/* Hide reject button when stage is OFFER and substage is OFFER_SENT */}
                {!(
                  selectedStage === ATSStage.OFFER &&
                  String(currentSubStage) === String(OfferSubStage.OFFER_SENT)
                ) && (
                    <Button
                      variant="destructive"
                      className="flex-1 gap-2"
                      onClick={() => setShowRejectConfirmDialog(true)}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  )}
              </div>
            )}

            <div className="flex flex-col gap-3 mt-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowCommentModal(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Add Comment
              </Button>

              {/* Move to Another Stage button - only show if not last stage */}
              {(() => {
                const currentStage = atsApplication?.stage as ATSStage;
                if (!currentStage) return false;
                return hasNextStages(currentStage);
              })() && (
                  <Button
                    variant="outline"
                    className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                    onClick={() => setShowMoveToStageModal(true)}
                  >
                    <ChevronRight className="h-4 w-4" />
                    Move to Another Stage
                  </Button>
                )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Shortlisted Stage
  const renderShortlistedStage = () => {
    const currentSubStage = atsApplication?.subStage || "READY_FOR_INTERVIEW";
    // Only show action buttons if this is the current stage
    const showActions = isCurrentStage(selectedStage);

    return (
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shortlisted Stage
          </h3>
          {showActions && (
            <Badge className="bg-blue-100 text-blue-700 mb-4">
              Current Sub-stage:{" "}
              {currentSubStage === "READY_FOR_INTERVIEW"
                ? "Ready for Interview"
                : currentSubStage === "CONTACTED"
                  ? "Contacted"
                  : currentSubStage === "AWAITING_RESPONSE"
                    ? "Awaiting Response"
                    : currentSubStage}
            </Badge>
          )}
        </div>

        {/* Primary CTA - only show if this is the current stage */}
        {showActions && (
          <div className="flex flex-col gap-3">
            <Button
              className="gap-2 bg-[#4640DE] hover:bg-[#3730A3] text-lg py-6"
              onClick={() => setShowScheduleModal(true)}
            >
              <Calendar className="h-5 w-5" />
              Schedule Interview
            </Button>

            {/* Optional status buttons */}
            <div className="flex gap-2">
              {currentSubStage === "READY_FOR_INTERVIEW" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={async () => {
                    if (!currentId) return;
                    try {
                      await companyApi.updateApplicationSubStage(currentId, {
                        subStage: "CONTACTED",
                        comment: "Candidate contacted",
                      });
                      toast({
                        title: "Success",
                        description: "Marked as Contacted",
                      });
                      await reloadData();
                    } catch (error: unknown) {
                      console.error("Failed to update sub-stage:", error);
                      toast({
                        title: "Error",
                        description:
                          (
                            error as {
                              response?: { data?: { message?: string } };
                            }
                          )?.response?.data?.message ||
                          "Failed to update sub-stage.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Mark as Contacted
                </Button>
              )}
              {currentSubStage === "CONTACTED" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={async () => {
                    if (!currentId) return;
                    try {
                      await companyApi.updateApplicationSubStage(currentId, {
                        subStage: "AWAITING_RESPONSE",
                        comment: "Awaiting candidate response",
                      });
                      toast({
                        title: "Success",
                        description: "Marked as Awaiting Response",
                      });
                      await reloadData();
                    } catch (error: unknown) {
                      console.error("Failed to update sub-stage:", error);
                      toast({
                        title: "Error",
                        description:
                          (
                            error as {
                              response?: { data?: { message?: string } };
                            }
                          )?.response?.data?.message ||
                          "Failed to update sub-stage.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Mark Awaiting Response
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowCommentModal(true)}
              >
                <MessageSquare className="h-4 w-4" />
                Add Comment
              </Button>

              {/* Move to Another Stage button - only show if not last stage */}
              {(() => {
                const currentStage = atsApplication?.stage as ATSStage;
                if (!currentStage) return false;
                return hasNextStages(currentStage);
              })() && (
                  <Button
                    variant="outline"
                    className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                    onClick={() => setShowMoveToStageModal(true)}
                  >
                    <ChevronRight className="h-4 w-4" />
                    Move to Another Stage
                  </Button>
                )}
            </div>
          </div>
        )}

        {/* Show comments */}
        {comments.filter((c) => c.stage === ATSStage.SHORTLISTED).length >
          0 && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium text-gray-900">Comments</h4>
              {comments
                .filter((c) => c.stage === ATSStage.SHORTLISTED)
                .map((comment, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      by{" "}
                      {comment.recruiterName ||
                        comment.addedByName ||
                        comment.addedBy ||
                        "Recruiter"}{" "}
                      •{" "}
                      {formatDateTime(
                        comment.createdAt || comment.timestamp || ""
                      )}
                    </p>
                  </div>
                ))}
            </div>
          )}
      </div>
    );
  };

  // Render Interview Stage
  const renderInterviewStage = () => {
    const { overallStatus, interviewsConducted, upcomingInterview } =
      interviewSummary;
    const currentSubStage =
      atsApplication?.subStage || InterviewSubStage.NOT_SCHEDULED;
    // Only show action buttons if this is the current stage
    const showActions = isCurrentStage(selectedStage);

    return (
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* Interview Stage Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Interview Stage
          </h3>
          {showActions && (
            <Badge className="bg-purple-100 text-purple-700 mb-4">
              Current Sub-stage:{" "}
              {currentSubStage === InterviewSubStage.NOT_SCHEDULED
                ? "Not Scheduled"
                : currentSubStage === InterviewSubStage.SCHEDULED
                  ? "Scheduled"
                  : currentSubStage === InterviewSubStage.COMPLETED
                    ? "Completed"
                    : currentSubStage === InterviewSubStage.EVALUATION_PENDING
                      ? "Evaluation Pending"
                      : currentSubStage}
            </Badge>
          )}
        </div>

        {/* Interview Summary */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Interview Summary
              </h3>
              <p className="text-sm text-gray-600">Stage: Interview</p>
            </div>
            <Badge
              className={
                overallStatus === "Ready for Decision"
                  ? "bg-green-100 text-green-700"
                  : overallStatus === "Evaluation Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-blue-100 text-blue-700"
              }
            >
              {overallStatus}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Interviews Conducted</p>
              <p className="text-2xl font-bold text-gray-900">
                {interviewsConducted}
              </p>
            </div>
            {upcomingInterview && (
              <div>
                <p className="text-sm text-gray-600">Upcoming Interview</p>
                <p className="text-sm font-medium text-gray-900">
                  {upcomingInterview.title}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDateTime(upcomingInterview.scheduledDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interview Timeline */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Interview Timeline</h4>
            {showActions && (
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={() => setShowScheduleModal(true)}
              >
                <Plus className="h-4 w-4" />
                Schedule Another Interview
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {interviews.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg border">
                No interviews scheduled yet
              </div>
            ) : (
              interviews.map((interview, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${interview.status === "completed"
                          ? "bg-green-100"
                          : "bg-blue-100"
                          }`}
                      >
                        {interview.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {interview.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {interview.type === "online" ? "Online" : "In-Person"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        interview.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }
                    >
                      {interview.status}
                    </Badge>
                  </div>

                  <div className="pl-13 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateTime(interview.scheduledDate)}</span>
                    </div>
                    {interview.meetingLink &&
                      interview.status === "scheduled" && (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#4640DE] hover:underline flex items-center gap-2"
                        >
                          <Video className="h-4 w-4" />
                          Join Meeting
                        </a>
                      )}
                    {interview.feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          Feedback:
                        </p>
                        <p className="text-sm text-gray-600">
                          {interview.feedback}
                        </p>
                        {interview.rating && (
                          <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${interview.rating && star <= interview.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                            <span className="text-sm text-gray-700 ml-2">
                              {interview.rating}/5
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Per-interview actions */}
                  {showActions && (
                    <div className="mt-3 pt-3 border-t flex gap-2 flex-wrap">
                      {interview.status === "scheduled" && (
                        <>
                          {('videoType' in interview) && (interview as unknown as { videoType: string }).videoType === "in-app" &&
                            ('webrtcRoomId' in interview) && (interview as unknown as { webrtcRoomId: string }).webrtcRoomId ? (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                navigate(
                                  `/video-call/${(interview as unknown as { webrtcRoomId: string }).webrtcRoomId
                                  }`
                                )
                              }
                              className='mb-2'
                            >
                              <Video className="h-3.5 w-3.5 mr-1" />
                              Join In-App Video
                            </Button>
                          ) : interview.meetingLink ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(interview.meetingLink, "_blank")
                              }
                            >
                              <Video className="h-3.5 w-3.5 mr-1" />
                              Join External Link
                            </Button>
                          ) : null}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedInterviewForReschedule(interview);
                              setShowScheduleModal(true);
                            }}
                          >
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Reschedule
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelInterview(interview.id)}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#4640DE] hover:bg-[#3730A3]"
                            onClick={() =>
                              handleMarkInterviewComplete(interview.id)
                            }
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                            Mark as Complete
                          </Button>
                        </>
                      )}
                      {interview.status === "completed" &&
                        (!interview.feedback || !interview.rating) && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedInterviewForFeedback(interview);
                              setShowFeedbackModal(true);
                            }}
                          >
                            <Star className="h-3.5 w-3.5 mr-1" />
                            Add Feedback
                          </Button>
                        )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Comment and Move to Stage buttons - only show if this is the current stage */}
        {showActions && (
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowCommentModal(true)}
            >
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </Button>

            {/* Move to Next Stage button - only show when substage is EVALUATION_PENDING */}
            {currentSubStage === InterviewSubStage.EVALUATION_PENDING &&
              (() => {
                const nextStage = atsApplication?.stage
                  ? getNextStage(atsApplication.stage)
                  : null;
                if (!nextStage) return null;
                const nextStageDisplayName =
                  ATSStageDisplayNames[nextStage] || nextStage;
                return (
                  <Button
                    variant="outline"
                    className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                    onClick={() => handleMoveToStage(nextStage)}
                  >
                    <ChevronRight className="h-4 w-4" />
                    Move to {nextStageDisplayName}
                  </Button>
                );
              })()}

            {/* Move to Another Stage button - opens modal to choose any available stage */}
            {atsApplication?.stage &&
              hasNextStages(atsApplication.stage as ATSStage) && (
                <Button
                  variant="outline"
                  className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                  onClick={() => setShowMoveToStageModal(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                  Move to Another Stage
                </Button>
              )}
          </div>
        )}

        {/* Show comments */}
        {showActions &&
          comments.filter((c) => c.stage === ATSStage.INTERVIEW).length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium text-gray-900">Comments</h4>
              {comments
                .filter((c) => c.stage === ATSStage.INTERVIEW)
                .map((comment, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      by{" "}
                      {comment.recruiterName ||
                        comment.addedByName ||
                        comment.addedBy ||
                        "Recruiter"}{" "}
                      •{" "}
                      {formatDateTime(
                        comment.createdAt || comment.timestamp || ""
                      )}
                    </p>
                  </div>
                ))}
            </div>
          )}
      </div>
    );
  };

  // Calculate Technical Task Summary
  const technicalTaskSummary = useMemo(() => {
    const currentSubStage =
      atsApplication?.subStage || TechnicalTaskSubStage.NOT_ASSIGNED;
    // Filter out cancelled tasks when calculating summary
    const activeTasks = technicalTasks.filter(
      (t: ExtendedATSTechnicalTask) => t.status !== "completed"
    );
    const assignedTasks = activeTasks.filter(
      (t: ExtendedATSTechnicalTask) => t.status === "assigned"
    );
    const submittedTasks = activeTasks.filter(
      (t: ExtendedATSTechnicalTask) => t.status === "submitted"
    );
    const underReviewTasks = activeTasks.filter(
      (t: ExtendedATSTechnicalTask) => t.status === "under_review"
    );
    const completedTasks = activeTasks.filter(
      (t: ExtendedATSTechnicalTask) => t.status === "completed"
    );

    // Calculate overall substage based on active tasks only (excluding cancelled)
    // Priority: UNDER_REVIEW (any) > COMPLETED (all) > SUBMITTED (all, no completed) > ASSIGNED (any) > NOT_ASSIGNED
    let calculatedSubStage = currentSubStage;
    if (activeTasks.length === 0) {
      calculatedSubStage = TechnicalTaskSubStage.NOT_ASSIGNED;
    } else if (underReviewTasks.length > 0) {
      // If ANY task is under review, substage is UNDER_REVIEW
      calculatedSubStage = TechnicalTaskSubStage.UNDER_REVIEW;
    } else if (
      completedTasks.length === activeTasks.length &&
      activeTasks.length > 0
    ) {
      // Only if ALL tasks are completed, substage is COMPLETED
      calculatedSubStage = TechnicalTaskSubStage.COMPLETED;
    } else if (
      submittedTasks.length === activeTasks.length &&
      submittedTasks.length > 0 &&
      completedTasks.length === 0
    ) {
      // If ALL tasks are submitted (and none are completed), substage is SUBMITTED
      calculatedSubStage = TechnicalTaskSubStage.SUBMITTED;
    } else {
      // Otherwise (mix of assigned/submitted/completed), substage is ASSIGNED
      calculatedSubStage = TechnicalTaskSubStage.ASSIGNED;
    }

    return {
      currentSubStage: calculatedSubStage,
      assignedTasks,
      submittedTasks,
      underReviewTasks,
      completedTasks,
      totalTasks: activeTasks.length,
    };
  }, [technicalTasks, atsApplication?.subStage]);

  // Render Technical Task Stage
  const renderTechnicalTaskStage = () => {
    const showActions = isCurrentStage(selectedStage);
    const { currentSubStage } = technicalTaskSummary;
    const currentSubStageDisplayName =
      SubStageDisplayNames[currentSubStage] || currentSubStage;

    return (
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Technical Task Stage
          </h3>
          {showActions && (
            <Badge className="bg-purple-100 text-purple-700 mb-4">
              Current Sub-stage: {currentSubStageDisplayName}
            </Badge>
          )}
        </div>

        {/* NOT_ASSIGNED: Show "No task assigned" message and Assign Task button */}
        {currentSubStage === TechnicalTaskSubStage.NOT_ASSIGNED && (
          <div className="bg-white rounded-lg p-6 border text-center">
            <p className="text-gray-600 mb-4">No technical task assigned yet</p>
            {showActions && (
              <Button
                onClick={() => setShowAssignTaskModal(true)}
                className="bg-[#4640DE] hover:bg-[#3730A3]"
              >
                Assign Task
              </Button>
            )}
          </div>
        )}

        {/* ASSIGNED, SUBMITTED, UNDER_REVIEW, COMPLETED: Show task list */}
        {currentSubStage !== TechnicalTaskSubStage.NOT_ASSIGNED && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Task List</h4>
              {showActions && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowAssignTaskModal(true)}
                >
                  <Plus className="h-4 w-4" />
                  Assign Another Task
                </Button>
              )}
            </div>

            {technicalTasks.length > 0 && (
              <div className="space-y-4">
                {technicalTasks.map((task: ExtendedATSTechnicalTask) => {
                  const taskStatus = task.status || "assigned";
                  const isAssigned = taskStatus === "assigned";
                  const isSubmitted = taskStatus === "submitted";
                  const isUnderReview = taskStatus === "under_review";
                  const isCompleted = taskStatus === "completed";
                  const isCancelled = false; // Tasks don't have cancelled status in the type

                  return (
                    <div
                      key={task.id}
                      className="bg-white rounded-lg p-4 border"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            {task.title}
                          </h5>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              Due:{" "}
                              {task.deadline
                                ? formatDateTime(task.deadline)
                                : "No deadline"}
                            </span>
                            <Badge
                              className={
                                isCancelled
                                  ? "bg-gray-100 text-gray-600"
                                  : isAssigned
                                    ? "bg-blue-100 text-blue-700"
                                    : isSubmitted
                                      ? "bg-yellow-100 text-yellow-700"
                                      : isUnderReview
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-green-100 text-green-700"
                              }
                            >
                              {isCancelled
                                ? "Cancelled"
                                : isAssigned
                                  ? "Assigned"
                                  : isSubmitted
                                    ? "Submitted"
                                    : isUnderReview
                                      ? "Under Review"
                                      : "Completed"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Task Description */}
                      {task.description && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {task.description}
                          </p>
                        </div>
                      )}

                      {/* Attachments */}
                      {task.documentUrl && task.documentFilename && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileIcon className="h-4 w-4" />
                            <a
                              href={task.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4640DE] hover:underline flex items-center gap-1"
                            >
                              {task.documentFilename}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Submission Files (when submitted or reviewed) */}
                      {(isSubmitted || isUnderReview || isCompleted) &&
                        task.submissionUrl && (
                          <div className="mb-3 p-3 bg-gray-50 rounded border">
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              Submitted Files
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileIcon className="h-4 w-4" />
                              <a
                                href={task.submissionUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4640DE] hover:underline flex items-center gap-1"
                              >
                                {task.submissionFilename || "Submission"}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                            {task.submittedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                Submitted: {formatDateTime(task.submittedAt)}
                              </p>
                            )}
                          </div>
                        )}

                      {/* Feedback (when completed) */}
                      {isCompleted && (task.feedback || task.rating) && (
                        <div className="mb-3 p-3 bg-green-50 rounded border">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-900">
                              Rating: {task.rating || "N/A"}/5
                            </span>
                          </div>
                          {task.feedback && (
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {task.feedback}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      {showActions && !isCancelled && (
                        <div className="flex gap-2 mt-4 pt-4 border-t justify-between items-center">
                          <div className="flex gap-2">
                            {isSubmitted && (
                              <Button
                                size="sm"
                                className="bg-[#4640DE] hover:bg-[#3730A3]"
                                onClick={() => handleReviewTask(task.id)}
                              >
                                Review Submission
                              </Button>
                            )}
                            {isUnderReview && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedTaskForReview(task);
                                  setShowFeedbackModal(true);
                                }}
                              >
                                Add Feedback
                              </Button>
                            )}
                          </div>

                          {/* Edit and Revoke buttons - only show for assigned tasks */}
                          {isAssigned && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTask(task)}
                                className="gap-1"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRevokeTaskClick(task.id)}
                                className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Revoke
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      {/* Show cancelled status for revoked tasks */}
                      {isCancelled && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-500 italic">
                            Task has been revoked
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowCommentModal(true)}
            >
              <MessageSquare className="h-4 w-4" />
              Add Comment
            </Button>

            {/* Move to Next Stage button - always show but disabled until COMPLETED */}
            {(() => {
              const nextStage = atsApplication?.stage
                ? getNextStage(atsApplication.stage)
                : null;
              if (!nextStage) return null;
              const nextStageDisplayName =
                ATSStageDisplayNames[nextStage] || nextStage;
              const isCompleted =
                currentSubStage === TechnicalTaskSubStage.COMPLETED ||
                currentSubStage === "COMPLETED";
              return (
                <Button
                  variant="outline"
                  className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                  onClick={() => handleMoveToStage(nextStage)}
                  disabled={!isCompleted}
                >
                  <ChevronRight className="h-4 w-4" />
                  Move to {nextStageDisplayName}
                </Button>
              );
            })()}

            {/* Move to Another Stage button - always show if there are next stages available */}
            {atsApplication?.stage &&
              hasNextStages(atsApplication.stage as ATSStage) && (
                <Button
                  variant="outline"
                  className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                  onClick={() => setShowMoveToStageModal(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                  Move to Another Stage
                </Button>
              )}
          </div>
        )}

        {/* Show comments */}
        {showActions &&
          comments.filter((c) => c.stage === ATSStage.TECHNICAL_TASK).length >
          0 && (
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-medium text-gray-900">Comments</h4>
              {comments
                .filter((c) => c.stage === ATSStage.TECHNICAL_TASK)
                .map((comment, idx) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border">
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      by{" "}
                      {comment.recruiterName ||
                        comment.addedByName ||
                        comment.addedBy ||
                        "Recruiter"}{" "}
                      •{" "}
                      {formatDateTime(
                        comment.createdAt || comment.timestamp || ""
                      )}
                    </p>
                  </div>
                ))}
            </div>
          )}
      </div>
    );
  };

  // Render Compensation Stage
  const renderCompensationStage = () => {
    const showActions = isCurrentStage(selectedStage);
    const currentSubStage =
      atsApplication?.subStage || CompensationSubStage.NOT_INITIATED;
    const currentSubStageDisplayName =
      SubStageDisplayNames[currentSubStage] || currentSubStage;

    // Get job salary range for reference (always from Job Posting model)
    const jobSalaryMin = atsJob?.salary?.min || 0;
    const jobSalaryMax = atsJob?.salary?.max || 0;
    const jobSalaryRange =
      jobSalaryMin > 0 && jobSalaryMax > 0
        ? `₹${(jobSalaryMin / 100000).toFixed(1)}L - ₹${(
          jobSalaryMax / 100000
        ).toFixed(1)}L`
        : "Not specified";

    // Get compensation data
    const candidateExpected = compensationData?.candidateExpected || "";
    const companyProposed = compensationData?.companyProposed || "";
    const finalAgreed = compensationData?.finalAgreed || "";
    const benefits = compensationData?.benefits || [];
    const expectedJoining = compensationData?.expectedJoining || "";
    const approvedAt = compensationData?.approvedAt || "";
    const approvedBy = compensationData?.approvedBy || "";

    // Get candidate contact info
    const candidateEmail =
      candidateData?.user?.email || atsApplication?.email || "";
    const candidatePhone =
      candidateData?.profile?.phone || atsApplication?.phone || "";
    // Check if expected salary exists and at least one note/update exists for Approve button
    const hasExpectedSalary = !!candidateExpected;
    const hasNotesOrUpdates =
      compensationNotes.length > 0 ||
      !!companyProposed ||
      (compensationData?.updatedAt &&
        compensationData?.createdAt &&
        new Date(compensationData.updatedAt) >
        new Date(compensationData.createdAt));
    const canApprove = hasExpectedSalary && hasNotesOrUpdates;

    return (
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* Header with Action Bar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Compensation Stage
            </h3>
            {showActions && (
              <Badge className="bg-amber-100 text-amber-700">
                Current Sub-stage: {currentSubStageDisplayName}
              </Badge>
            )}
          </div>

          {/* Compact Action Bar - Email, Phone, Chat */}
          {showActions && (
            <div className="flex items-center gap-2 mb-4">
              {candidateEmail && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `mailto:${candidateEmail}`)
                  }
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </Button>
              )}
              {candidatePhone && candidatePhone !== "-" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    (window.location.href = `tel:${candidatePhone}`)
                  }
                  className="gap-2"
                >
                  <Phone className="h-4 w-4" />
                  <p> {candidatePhone} </p>
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  if (!currentId || !candidateData?.user?._id) return;
                  try {
                    // Create conversation
                    const conversation = await chatApi.createConversation({
                      participantId: candidateData.user._id,
                    });
                    const conversationId =
                      (conversation as { _id?: string; id?: string })._id ||
                      (conversation as { _id?: string; id?: string }).id ||
                      "";
                    if (conversationId) {
                      navigate(`/company/chat/${conversationId}`);
                    } else {
                      toast({
                        title: "Error",
                        description: "Failed to get conversation ID.",
                        variant: "destructive",
                      });
                    }
                  } catch (error) {
                    console.error("Failed to open chat:", error);
                    toast({
                      title: "Error",
                      description: "Failed to open chat.",
                      variant: "destructive",
                    });
                  }
                }}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </Button>
            </div>
          )}
        </div>

        {/* 1. Compensation Summary Section */}
        <div className="bg-white rounded-lg p-6 border">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-amber-600" />
            Compensation Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Stage</p>
              <p className="text-sm font-medium text-gray-900">Compensation</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-sm font-medium text-gray-900">
                {currentSubStage === CompensationSubStage.NOT_INITIATED
                  ? "Not Initiated"
                  : currentSubStage === CompensationSubStage.INITIATED
                    ? "Initiated"
                    : currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING
                      ? "Negotiation Ongoing"
                      : "Approved"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Company Budget Range</p>
              <p className="text-sm font-medium text-gray-900">
                {jobSalaryRange}
              </p>
            </div>
            {currentSubStage !== CompensationSubStage.NOT_INITIATED && (
              <>
                {finalAgreed ? (
                  <div>
                    <p className="text-sm text-gray-600">Final Agreed Range</p>
                    <p className="text-sm font-medium text-green-700">
                      {finalAgreed}
                    </p>
                  </div>
                ) : companyProposed ? (
                  <div>
                    <p className="text-sm text-gray-600">Proposed Range</p>
                    <p className="text-sm font-medium text-amber-700">
                      {companyProposed}
                    </p>
                  </div>
                ) : null}
                {expectedJoining && (
                  <div>
                    <p className="text-sm text-gray-600">Expected Joining</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(expectedJoining).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </>
            )}
            {currentSubStage === CompensationSubStage.APPROVED &&
              approvedAt && (
                <div>
                  <p className="text-sm text-gray-600">Approved On</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(approvedAt)}
                  </p>
                </div>
              )}
          </div>
          {benefits.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600 mb-2">Benefits</p>
              <div className="flex flex-wrap gap-2">
                {benefits.map((benefit: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                  >
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Expected Salary Summary Row */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600">
                Candidate Expected Salary:
              </p>
              <p className="text-sm font-medium text-gray-900">
                {candidateExpected || "—"}
              </p>
              {currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-700 border-amber-200"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Negotiation in Progress
                </Badge>
              )}
            </div>
            {showActions &&
              currentSubStage === CompensationSubStage.NOT_INITIATED && (
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => setShowCompensationInitModal(true)}
                  className="bg-[#4640DE] hover:bg-[#3730A3]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Compensation
                </Button>
              )}
          </div>
        </div>

        {currentSubStage === CompensationSubStage.INITIATED && (
          <div className="bg-white rounded-lg p-6 border space-y-4">
            <h4 className="font-semibold text-gray-900">
              Compensation Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Candidate Expected Salary
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {candidateExpected || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Company Budget Range
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {jobSalaryRange}
                </p>
              </div>
            </div>
            {showActions && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCompensationUpdateModal(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Update Compensation
                </Button>
              </div>
            )}
          </div>
        )}

        {currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING && (
          <div className="bg-white rounded-lg p-6 border space-y-4">
            <h4 className="font-semibold text-gray-900">Negotiation Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Proposal</p>
                <p className="text-sm font-medium text-gray-900">
                  {companyProposed || "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Candidate Expected</p>
                <p className="text-sm font-medium text-gray-900">
                  {candidateExpected || "Not specified"}
                </p>
              </div>
            </div>
            {showActions && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowCompensationUpdateModal(true)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Update Compensation
                </Button>
                {/* Show Approve Compensation only when expected salary exists AND at least one note/update exists */}
                {canApprove && (
                  <Button
                    onClick={async () => {
                      if (!currentId) return;
                      try {
                        // Update compensation to set approvedAt
                        await atsService.updateCompensation(currentId, {
                          finalAgreed:
                            compensationData?.companyProposed ||
                            compensationData?.candidateExpected,
                          approvedAt: new Date().toISOString(),
                        });

                        // Update substage to APPROVED
                        await companyApi.moveApplicationStage(currentId, {
                          nextStage: ATSStage.COMPENSATION,
                          subStage: CompensationSubStage.APPROVED,
                          comment: "Compensation approved",
                        });

                        // Update local state
                        if (atsApplication) {
                          setAtsApplication({
                            ...atsApplication,
                            subStage: CompensationSubStage.APPROVED,
                          });
                        }

                        // Refresh compensation data
                        const compensationRes =
                          await atsService.getCompensation(currentId);
                        setCompensationData(compensationRes.data);

                        toast({
                          title: "Success",
                          description: "Compensation approved successfully.",
                        });
                      } catch (error) {
                        console.error("Failed to approve compensation:", error);
                        toast({
                          title: "Error",
                          description: "Failed to approve compensation.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve Compensation
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectConfirmDialog(true);
                  }}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                  Reject Candidate
                </Button>
              </div>
            )}
          </div>
        )}

        {currentSubStage === CompensationSubStage.APPROVED && (
          <div className="bg-white rounded-lg p-6 border space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Compensation Approved
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Final Agreed Salary
                </p>
                <p className="text-sm font-medium text-green-700">
                  {finalAgreed || companyProposed || "Not set"}
                </p>
              </div>
              {expectedJoining && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Expected Joining Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(expectedJoining).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
            {benefits.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Benefits Summary</p>
                <ul className="list-disc list-inside space-y-1">
                  {benefits.map((benefit: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {approvedAt && (
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Approved on {formatDateTime(approvedAt)} by{" "}
                  {approvedBy || "Recruiter"}
                </p>
              </div>
            )}
            {showActions && (
              <div className="pt-4 border-t">
                <Button
                  onClick={() => {
                    const nextStage = getNextStage(ATSStage.COMPENSATION);
                    if (nextStage) {
                      handleMoveToStage(nextStage);
                    }
                  }}
                  className="bg-[#4640DE] hover:bg-[#3730A3] gap-2"
                >
                  <ChevronRight className="h-4 w-4" />
                  Proceed to Offer
                </Button>
              </div>
            )}
          </div>
        )}

        {showActions &&
          currentSubStage !== CompensationSubStage.NOT_INITIATED && (
            <div className="flex flex-col gap-3">
              {(() => {
                const nextStage = getNextStage(ATSStage.COMPENSATION);
                if (!nextStage) return null;
                const nextStageDisplayName =
                  ATSStageDisplayNames[nextStage] || nextStage;
                return (
                  <Button
                    variant="outline"
                    className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                    onClick={() => handleMoveToStage(nextStage)}
                  >
                    <ChevronRight className="h-4 w-4" />
                    Move to {nextStageDisplayName}
                  </Button>
                );
              })()}
            </div>
          )}

        {/* 3. Discussion / Meeting History Section */}
        {currentSubStage !== CompensationSubStage.NOT_INITIATED && (
          <div className="bg-white rounded-lg p-6 border">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-600" />
                Discussion / Meeting History
              </h4>
              {showActions &&
                currentSubStage !== CompensationSubStage.APPROVED && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCompensationMeetingModal(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Meeting
                  </Button>
                )}
            </div>

            {compensationMeetings.length > 0 ? (
              <div className="space-y-3">
                {compensationMeetings
                  .filter((meeting) => meeting != null)
                  .map((meeting: CompensationMeeting, idx: number) => {
                    const meetingType = meeting?.type || "call";
                    const isCall = meetingType === "call";
                    const isCompleted = meeting.status === "completed";
                    const isCancelled = meeting.status === "cancelled";
                    return (
                      <div
                        key={idx}
                        className={`border rounded-lg p-4 ${isCompleted
                          ? "bg-green-50 border-green-200"
                          : isCancelled
                            ? "bg-gray-50 border-gray-200"
                            : ""
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {meetingType}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {meetingType}
                              </Badge>
                              {isCompleted && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-100 text-green-700 border-green-300"
                                >
                                  Completed
                                </Badge>
                              )}
                              {isCancelled && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-gray-100 text-gray-700 border-gray-300"
                                >
                                  Cancelled
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(
                                meeting.scheduledDate || meeting.createdAt || ""
                              )}
                            </p>
                            {isCompleted && meeting.completedAt && (
                              <p className="text-xs text-green-600 mt-1">
                                Completed on{" "}
                                {formatDateTime(meeting.completedAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        {meeting.location && (
                          <p className="text-xs text-gray-500 mt-1">
                            Location: {meeting.location}
                          </p>
                        )}
                        {meeting.meetingLink && (
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#4640DE] hover:underline mt-1 block"
                          >
                            Meeting Link: {meeting.meetingLink}
                          </a>
                        )}
                        {meeting.notes && (
                          <div className="mt-3 pt-3 border-t">
                            <p className="text-xs font-medium text-gray-600 mb-1">
                              Notes / Outcome:
                            </p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {meeting.notes}
                            </p>
                          </div>
                        )}
                        {showActions &&
                          currentSubStage !== CompensationSubStage.APPROVED &&
                          !isCompleted &&
                          !isCancelled && (
                            <div className="flex gap-2 mt-3 pt-3 border-t">
                              {isCall &&
                                candidatePhone &&
                                candidatePhone !== "-" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      (window.location.href = `tel:${candidatePhone}`)
                                    }
                                    className="gap-2"
                                  >
                                    <Phone className="h-3 w-3" />
                                    Call {candidatePhone}
                                  </Button>
                                )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedMeetingForEdit(meeting);
                                  setShowCompensationMeetingModal(true);
                                }}
                                className="gap-2"
                              >
                                <Edit className="h-3 w-3" />
                                Update
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  if (!currentId || !meeting.id) return;
                                  try {
                                    await atsService.updateCompensationMeetingStatus(
                                      currentId,
                                      meeting.id,
                                      "completed"
                                    );
                                    // Refresh meetings
                                    const meetingsRes =
                                      await atsService.getCompensationMeetings(
                                        currentId
                                      );
                                    const meetingsData = Array.isArray(
                                      meetingsRes.data
                                    )
                                      ? meetingsRes.data.filter(
                                        (m: CompensationMeeting | null) =>
                                          m != null
                                      )
                                      : Array.isArray(meetingsRes)
                                        ? meetingsRes.filter(
                                          (m: CompensationMeeting | null) =>
                                            m != null
                                        )
                                        : [];
                                    setCompensationMeetings(meetingsData);
                                    toast({
                                      title: "Success",
                                      description:
                                        "Meeting marked as completed.",
                                    });
                                  } catch (error) {
                                    console.error(
                                      "Failed to mark meeting as completed:",
                                      error
                                    );
                                    toast({
                                      title: "Error",
                                      description:
                                        "Failed to mark meeting as completed.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                className="gap-2 text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="h-3 w-3" />
                                Mark as Completed
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  if (!currentId || !meeting.id) return;
                                  try {
                                    await atsService.updateCompensationMeetingStatus(
                                      currentId,
                                      meeting.id,
                                      "cancelled"
                                    );
                                    // Refresh meetings
                                    const meetingsRes =
                                      await atsService.getCompensationMeetings(
                                        currentId
                                      );
                                    const meetingsData = Array.isArray(
                                      meetingsRes.data
                                    )
                                      ? meetingsRes.data.filter(
                                        (m: CompensationMeeting | null) =>
                                          m != null
                                      )
                                      : Array.isArray(meetingsRes)
                                        ? meetingsRes.filter(
                                          (m: CompensationMeeting | null) =>
                                            m != null
                                        )
                                        : [];
                                    setCompensationMeetings(meetingsData);
                                    toast({
                                      title: "Success",
                                      description: "Meeting cancelled.",
                                    });
                                  } catch (error) {
                                    console.error(
                                      "Failed to cancel meeting:",
                                      error
                                    );
                                    toast({
                                      title: "Error",
                                      description: "Failed to cancel meeting.",
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                className="gap-2 text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                                Cancel
                              </Button>
                            </div>
                          )}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No meetings scheduled yet
              </p>
            )}
          </div>
        )}

        {/* 4. Notes & Comments Section */}
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-600" />
              Notes & Comments
            </h4>
            {showActions && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCommentModal(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            )}
          </div>
          {compensationNotes.length > 0 ||
            comments.filter((c) => c.stage === ATSStage.COMPENSATION).length >
            0 ? (
            <div className="space-y-3">
              {compensationNotes.map(
                (
                  note: {
                    comment?: string;
                    note?: string;
                    recruiterName?: string;
                    createdAt: string;
                  },
                  idx: number
                ) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <p className="text-sm text-gray-700">
                      {note.comment || note.note || ""}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      by {note.recruiterName || "Recruiter"} •{" "}
                      {formatDateTime(note.createdAt || "")}
                    </p>
                  </div>
                )
              )}
              {comments
                .filter((c) => c.stage === ATSStage.COMPENSATION)
                .map((comment, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      by{" "}
                      {comment.recruiterName ||
                        comment.addedByName ||
                        comment.addedBy ||
                        "Recruiter"}{" "}
                      •{" "}
                      {formatDateTime(
                        comment.createdAt || comment.timestamp || ""
                      )}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No notes or comments yet
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render Offer Stage
  const renderOfferStage = () => {
    const showActions = isCurrentStage(selectedStage);
    const currentSubStage = atsApplication?.subStage || OfferSubStage.NOT_SENT;
    const currentSubStageDisplayName =
      SubStageDisplayNames[currentSubStage] || currentSubStage;

    // Get offer data
    const offer = currentOffer || offerDocuments[0] || null;
    const offerAmount = (offer as ExtendedATSOfferDocument)?.offerAmount || "";
    const sentAt =
      (offer as ExtendedATSOfferDocument)?.sentAt ||
      (offer as ExtendedATSOfferDocument)?.createdAt;
    const acceptedAt = (offer as ExtendedATSOfferDocument)?.signedAt;
    const declinedAt = (offer as ExtendedATSOfferDocument)?.declinedAt;
    const declineReason =
      (offer as ExtendedATSOfferDocument)?.declineReason || "";

    // Get job details for display
    const jobTitle = atsJob?.title || "N/A";
    const employmentType =
      (offer as ExtendedATSOfferDocument)?.employmentType || "full-time";

    return (
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Offer Stage
          </h3>
          {showActions && (
            <Badge className="bg-green-100 text-green-700 mb-4">
              Current Sub-stage: {currentSubStageDisplayName}
            </Badge>
          )}
        </div>

        {/* 1. Offer Summary Section */}
        <div className="bg-white rounded-lg p-6 border">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Offer Summary
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Stage</p>
              <p className="text-sm font-medium text-gray-900">Offer</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-sm font-medium text-gray-900">
                {currentSubStage === OfferSubStage.NOT_SENT
                  ? "Not Sent"
                  : currentSubStage === OfferSubStage.OFFER_SENT
                    ? "Offer Sent"
                    : currentSubStage === OfferSubStage.OFFER_ACCEPTED
                      ? "Offer Accepted"
                      : "Offer Declined"}
              </p>
            </div>
            {currentSubStage !== OfferSubStage.NOT_SENT && offerAmount && (
              <div>
                <p className="text-sm text-gray-600">Offer Value</p>
                <p className="text-sm font-medium text-green-700">
                  {offerAmount}
                </p>
              </div>
            )}
            {currentSubStage === OfferSubStage.OFFER_ACCEPTED && acceptedAt && (
              <div>
                <p className="text-sm text-gray-600">Accepted On</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDateTime(acceptedAt)}
                </p>
              </div>
            )}
            {currentSubStage === OfferSubStage.OFFER_DECLINED && declinedAt && (
              <div>
                <p className="text-sm text-gray-600">Declined On</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDateTime(declinedAt)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. Sub-Stage Specific UI */}
        {currentSubStage === OfferSubStage.NOT_SENT && (
          <div className="bg-white rounded-lg p-6 border text-center">
            <p className="text-gray-600 mb-4">Offer not released yet</p>
            {showActions && (
              <Button
                onClick={() => setShowCreateOfferModal(true)}
                className="bg-[#4640DE] hover:bg-[#3730A3]"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Offer
              </Button>
            )}
          </div>
        )}

        {currentSubStage === OfferSubStage.OFFER_SENT && offer && (
          <div className="bg-white rounded-lg p-6 border space-y-4">
            <h4 className="font-semibold text-gray-900">Offer Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Job Title</p>
                <p className="text-sm font-medium text-gray-900">{jobTitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Offer Amount</p>
                <p className="text-sm font-medium text-green-700">
                  {offerAmount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Employment Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {employmentType}
                </p>
              </div>
              {sentAt && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Sent On</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(sentAt)}
                  </p>
                </div>
              )}
            </div>
            {showActions && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleSendReminder}
                  className="gap-2"
                >
                  <Bell className="h-4 w-4" />
                  Send Reminder
                </Button>
              </div>
            )}
          </div>
        )}

        {currentSubStage === OfferSubStage.OFFER_ACCEPTED && offer && (
          <div className="bg-white rounded-lg p-6 border space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Offer Accepted
            </h4>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Offer Accepted by Candidate
                </span>
              </div>
              {acceptedAt && (
                <p className="text-xs text-green-700">
                  Accepted on {formatDateTime(acceptedAt)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Accepted Offer</p>
                <p className="text-sm font-medium text-green-700">
                  {offerAmount}
                </p>
              </div>
              {acceptedAt && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Accepted Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(acceptedAt)}
                  </p>
                </div>
              )}
            </div>
            {showActions && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleMarkAsHired}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  Mark as Hired
                </Button>
              </div>
            )}
          </div>
        )}

        {currentSubStage === OfferSubStage.OFFER_DECLINED && offer && (
          <div className="bg-white rounded-lg p-6 border space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <X className="h-5 w-5 text-red-600" />
              Offer Declined
            </h4>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <X className="h-5 w-5 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  Offer Declined by Candidate
                </span>
              </div>
              {declinedAt && (
                <p className="text-xs text-red-700">
                  Declined on {formatDateTime(declinedAt)}
                </p>
              )}
              {declineReason && (
                <p className="text-sm text-red-800 mt-2">{declineReason}</p>
              )}
            </div>
          </div>
        )}

        {/* 3. Offer Details Section */}
        {currentSubStage !== OfferSubStage.NOT_SENT && offer && (
          <div className="bg-white rounded-lg p-6 border">
            <h4 className="font-semibold text-gray-900 mb-4">Offer Details</h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Job Title</p>
                  <p className="text-sm font-medium text-gray-900">
                    {jobTitle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employment Type</p>
                  <p className="text-sm font-medium text-gray-900">
                    {employmentType}
                  </p>
                </div>
              </div>
              {offerAmount && (
                <div>
                  <p className="text-sm text-gray-600">Offer Amount</p>
                  <p className="text-sm font-medium text-green-700">
                    {offerAmount}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Offer Documents Section */}
        {currentSubStage !== OfferSubStage.NOT_SENT && offer && (
          <div className="bg-white rounded-lg p-6 border">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileIcon className="h-5 w-5 text-green-600" />
              Offer Documents
            </h4>
            <div className="space-y-4">
              {/* Original Offer Document */}
              {(offer as ExtendedATSOfferDocument).documentUrl &&
                (offer as ExtendedATSOfferDocument).documentFilename ? (
                <div className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-5 w-5 text-[#4640DE]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {(offer as ExtendedATSOfferDocument).documentFilename}
                      </p>
                      <p className="text-xs text-gray-500">
                        Original Offer Letter
                      </p>
                      {sentAt && (
                        <p className="text-xs text-gray-500">
                          Sent on {formatDateTime(sentAt)}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        (offer as ExtendedATSOfferDocument).documentUrl,
                        "_blank"
                      )
                    }
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No offer document uploaded
                </p>
              )}

              {/* Signed Document - Show when offer is accepted */}
              {currentSubStage === OfferSubStage.OFFER_ACCEPTED &&
                (offer as ExtendedATSOfferDocument).signedDocumentUrl &&
                (offer as ExtendedATSOfferDocument).signedDocumentFilename && (
                  <div className="border-2 border-green-200 rounded-lg p-4 flex items-center justify-between bg-green-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {
                            (offer as ExtendedATSOfferDocument)
                              .signedDocumentFilename
                          }
                        </p>
                        <p className="text-xs text-green-700 font-medium">
                          Signed Offer Document
                        </p>
                        {acceptedAt && (
                          <p className="text-xs text-gray-500">
                            Signed on {formatDateTime(acceptedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(
                          (offer as ExtendedATSOfferDocument).signedDocumentUrl,
                          "_blank"
                        )
                      }
                      className="gap-2 border-green-300 text-green-700 hover:bg-green-100"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* 5. Candidate Response Section */}
        {currentSubStage === OfferSubStage.OFFER_SENT && (
          <div className="bg-white rounded-lg p-6 border">
            <h4 className="font-semibold text-gray-900 mb-4">
              Candidate Response
            </h4>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">
                  Waiting for candidate response
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 6. Activity & Notes Section */}
        <div className="bg-white rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              Activity & Notes
            </h4>
            {showActions && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowCommentModal(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            )}
          </div>
          {comments.filter((c) => c.stage === ATSStage.OFFER).length > 0 ? (
            <div className="space-y-3">
              {comments
                .filter((c) => c.stage === ATSStage.OFFER)
                .map((comment, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <p className="text-sm text-gray-700">{comment.comment}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      by{" "}
                      {comment.recruiterName ||
                        comment.addedByName ||
                        comment.addedBy ||
                        "Recruiter"}{" "}
                      •{" "}
                      {formatDateTime(
                        comment.createdAt || comment.timestamp || ""
                      )}
                    </p>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No notes or comments yet
            </p>
          )}
        </div>

        {/* 7. Actions Section */}
        {showActions && (
          <div className="flex flex-col gap-3">
            {currentSubStage !== OfferSubStage.OFFER_ACCEPTED &&
              currentSubStage !== OfferSubStage.OFFER_DECLINED && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setShowCommentModal(true)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Add Comment
                </Button>
              )}
          </div>
        )}

        {/* 8. Danger Zone - Show when offer is sent or accepted */}
        {(currentSubStage === OfferSubStage.OFFER_SENT ||
          currentSubStage === OfferSubStage.OFFER_ACCEPTED) && (
            <div className="bg-white rounded-lg p-6 border-2 border-red-200">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-1">Danger Zone</h4>
                  <p className="text-sm text-red-700 mb-4">
                    This action should only be used in exceptional cases.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={() => setShowWithdrawOfferModal(true)}
                    className="gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Withdraw Offer
                  </Button>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  };

  // Render selected stage content
  const renderStageContent = () => {
    if (!selectedStage) return null;

    if (selectedStage === "Applied" || selectedStage === "APPLIED") {
      return renderAppliedStage();
    } else if (selectedStage === ATSStage.IN_REVIEW) {
      return renderInReviewStage();
    } else if (selectedStage === ATSStage.SHORTLISTED) {
      return renderShortlistedStage();
    } else if (selectedStage === ATSStage.INTERVIEW) {
      return renderInterviewStage();
    } else if (selectedStage === ATSStage.TECHNICAL_TASK) {
      return renderTechnicalTaskStage();
    } else if (selectedStage === ATSStage.COMPENSATION) {
      return renderCompensationStage();
    } else if (selectedStage === ATSStage.OFFER) {
      return renderOfferStage();
    }

    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-gray-600">Stage details for {selectedStage}</p>
      </div>
    );
  };

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CompanyLayout>
    );
  }

  if (isATSMode && !atsApplication) {
    return (
      <CompanyLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <h2 className="text-xl font-semibold">Candidate not found</h2>
          <Button onClick={() => navigate("/company/ats")}>Back to ATS</Button>
        </div>
      </CompanyLayout>
    );
  }

  if (!isATSMode && !candidateData) {
    return (
      <CompanyLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <h2 className="text-xl font-semibold">Candidate not found</h2>
          <Button onClick={() => navigate("/company/candidates")}>
            Back to Search
          </Button>
        </div>
      </CompanyLayout>
    );
  }

  const candidateName = isATSMode
    ? atsApplication?.seeker_name ||
    atsApplication?.name ||
    atsApplication?.full_name ||
    atsApplication?.seeker?.name ||
    "Candidate"
    : candidateData?.user.name || "Candidate";
  const candidateRole = isATSMode
    ? atsApplication?.job?.title ||
    atsApplication?.job?.job_title ||
    atsJob?.title ||
    "Applicant"
    : candidateData?.profile.headline;
  const candidateEmail = isATSMode
    ? atsApplication?.email || atsApplication?.seeker?.email
    : candidateData?.user.email;
  const candidatePhone = isATSMode
    ? atsApplication?.phone || candidateData?.profile?.phone || "-"
    : candidateData?.profile.phone;
  const candidateAvatar = isATSMode
    ? atsApplication?.seeker_avatar || atsApplication?.seeker?.avatar
    : candidateData?.profile.avatarFileName || candidateData?.profile.avatarUrl;
  const candidateScore = isATSMode ? atsApplication?.score || 0 : 0;

  return (
    <CompanyLayout>
      <div className="px-6 py-6 space-y-6">
        <div>
          <Button
            variant="ghost"
            className="gap-2 text-gray-600 hover:text-gray-900 pl-0 hover:pl-2 transition-all h-8 text-sm"
            onClick={() =>
              navigate(isATSMode ? "/company/ats" : "/company/candidates")
            }
          >
            <ArrowLeft className="h-4 w-4" />
            Applicant Details
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-4">
            <Card className="border border-[#D6DDEB] rounded-lg shadow-sm">
              <CardContent className="p-5">
                {/* Profile Header */}
                <div className="flex items-start gap-4 mb-5">
                  <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                    {candidateAvatar ? (
                      <AvatarImage
                        src={candidateAvatar}
                        alt={candidateName}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-lg font-semibold">
                      {getInitials(candidateName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-lg font-semibold text-[#25324B] mb-1 truncate"
                      title={candidateName}
                    >
                      {candidateName}
                    </h2>
                    <p
                      className="text-sm text-[#7C8493] mb-3 truncate"
                      title={candidateRole || undefined}
                    >
                      {candidateRole}
                    </p>

                    {isATSMode && (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">
                            ATS Match Score
                          </span>
                          <ScoreBadge score={candidateScore} />
                        </div>
                        <div className="flex items-center gap-3">
                          {candidateScore === -1 ||
                            candidateScore === undefined ? (
                            <>
                              <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-blue-400 animate-pulse"
                                  style={{ width: "50%" }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-500 min-w-[4rem] text-right">
                                Calculating...
                              </span>
                            </>
                          ) : (
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${candidateScore >= 70
                                  ? "bg-green-500"
                                  : candidateScore >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                  }`}
                                style={{ width: `${candidateScore}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {isATSMode && (
                  <>
                    <div className="bg-[#F8F8FD] rounded-lg p-4 mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[#25324B]">
                          Applied Jobs
                        </span>
                        <span className="text-sm text-[#7C8493]">
                          {getTimeAgo(atsApplication?.applied_date || "")}
                        </span>
                      </div>
                      <div className="h-px bg-[#D6DDEB] mb-3"></div>
                      <div>
                        <p
                          className="text-sm font-semibold text-[#25324B] mb-1 line-clamp-1"
                          title={atsJob?.title || atsApplication?.job?.title}
                        >
                          {atsJob?.title ||
                            atsApplication?.job?.title ||
                            "Job Title"}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-[#7C8493]">
                          <span>{atsJob?.company_name || "ZeekNet"}</span>
                          <span>•</span>
                          <span>
                            {atsJob?.employmentTypes?.join(", ") || "Full-time"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F8F8FD] rounded-lg p-4 mb-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-[#25324B]">
                          Stage
                        </span>
                      </div>
                      <div className="h-px bg-[#D6DDEB] mb-3"></div>
                      <Badge className="bg-[#4640DE] hover:bg-[#3730A3] text-white border-none py-1">
                        {atsApplication?.stage || "Applied"}
                      </Badge>
                      {atsApplication?.stage !== "APPLIED" && (
                        <p className="text-xs text-gray-500 mt-2">
                          Sub-stage:{" "}
                          {atsApplication?.subStage?.replace(/_/g, " ") || "-"}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 mb-5">
                      {atsApplication?.stage === ATSStage.SHORTLISTED && (
                        <Button
                          variant="outline"
                          className="w-full border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white transition-colors"
                          onClick={() => setShowScheduleModal(true)}
                        >
                          Schedule Interview
                        </Button>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1 border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white transition-colors"
                          onClick={async () => {
                            const seekerId =
                              atsApplication?.seekerId ||
                              atsApplication?.seeker_id;
                            if (!seekerId) return;
                            try {
                              const conversation =
                                await chatApi.createConversation({
                                  participantId: seekerId,
                                });
                              navigate(
                                `/company/messages?chat=${conversation.id}`
                              );
                            } catch (error: unknown) {
                              console.error("Failed", error);
                            }
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        {/* Hide reject button when stage is OFFER and substage is OFFER_SENT */}
                        {!(
                          (atsApplication?.stage === ATSStage.OFFER &&
                            atsApplication?.subStage ===
                            OfferSubStage.OFFER_SENT) ||
                          atsApplication?.subStage ===
                          OfferSubStage.OFFER_DECLINED ||
                          atsApplication?.subStage ===
                          OfferSubStage.OFFER_ACCEPTED
                        ) && (
                            <Button
                              variant="outline"
                              className="flex-1 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                              onClick={() => setShowRejectConfirmDialog(true)}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          )}
                      </div>
                    </div>
                  </>
                )}

                <div className="h-px bg-[#D6DDEB] mb-5"></div>

                <div>
                  <h3 className="text-lg font-semibold text-[#25324B] mb-4">
                    Contact
                  </h3>
                  <div className="space-y-4">
                    {candidateEmail && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm text-[#7C8493] mb-0.5">Email</p>
                          <a
                            href={`mailto:${candidateEmail}`}
                            className="text-sm font-medium text-[#25324B] truncate block hover:text-[#4640DE]"
                          >
                            {candidateEmail}
                          </a>
                        </div>
                      </div>
                    )}
                    {candidatePhone && candidatePhone !== "-" && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-[#7C8493] mb-0.5">Phone</p>
                          <p className="text-sm font-medium text-[#25324B]">
                            {candidatePhone}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Socials from array */}
                    {candidateData?.profile?.socialLinks?.map((social, idx) => {
                      let Icon = Globe;
                      if (social.name.toLowerCase().includes("instagram"))
                        Icon = Instagram;
                      else if (social.name.toLowerCase().includes("twitter"))
                        Icon = Twitter;

                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <Icon className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-[#7C8493] mb-0.5 capitalize">
                              {social.name}
                            </p>
                            <a
                              href={
                                social.link.startsWith("http")
                                  ? social.link
                                  : `https://${social.link}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-[#4640DE] hover:underline break-all"
                            >
                              {social.link.replace(/^https?:\/\//, "")}
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border shadow-sm">
              {/* Tabs */}
              <div className="border-b px-6">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "profile"
                      ? "border-[#4640DE] text-[#4640DE]"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    Applicant Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("resume")}
                    className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "resume"
                      ? "border-[#4640DE] text-[#4640DE]"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    Resume
                  </button>
                  {isATSMode && (
                    <>
                      <button
                        onClick={() => {
                          setActiveTab("hiring");
                          // Set current stage immediately when clicking the tab
                          if (atsApplication?.stage) {
                            setSelectedStage(atsApplication.stage);
                          }
                        }}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "hiring"
                          ? "border-[#4640DE] text-[#4640DE]"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        Hiring Progress
                      </button>
                      <button
                        onClick={() => setActiveTab("activity")}
                        className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "activity"
                          ? "border-[#4640DE] text-[#4640DE]"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                          }`}
                      >
                        Activity Log
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Hiring Progress Tab */}
                {activeTab === "hiring" && isATSMode && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Hiring Progress
                    </h2>

                    {/* Stage Tabs - Clickable stages */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {hiringStages.map((stage) => {
                        const isSelected = selectedStage === stage.key;
                        const isDisabled = stage.disabled;

                        return (
                          <div
                            key={stage.key}
                            className="flex items-center flex-shrink-0"
                          >
                            <button
                              onClick={() => {
                                if (!isDisabled) {
                                  setSelectedStage(stage.key);
                                }
                              }}
                              disabled={isDisabled}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isSelected
                                ? "bg-[#4640DE] text-white shadow-md"
                                : isDisabled
                                  ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-50"
                                  : stage.completed
                                    ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                                    : stage.current
                                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                                }`}
                            >
                              {stage.completed && (
                                <CheckCircle2 className="h-4 w-4 inline mr-1" />
                              )}
                              {stage.current && !stage.completed && (
                                <Circle className="h-4 w-4 inline mr-1 fill-current" />
                              )}
                              {stage.label}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Selected Stage Content */}
                    {renderStageContent()}
                  </div>
                )}

                {activeTab === "profile" && (candidateData || isATSMode) && (
                  <div className="space-y-7">
                    {candidateData ? (
                      <>
                        {/* Personal Info Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-[#25324B] mb-5">
                            Personal Info
                          </h3>
                          <div className="grid grid-cols-2 gap-6 mb-5">
                            <div>
                              <p className="text-sm text-[#7C8493] mb-1">
                                Full Name
                              </p>
                              <p className="text-sm font-medium text-[#25324B]">
                                {candidateData.user.name ||
                                  candidateData.profile.name ||
                                  "N/A"}
                              </p>
                            </div>
                            {candidateData.profile.dateOfBirth && (
                              <div>
                                <p className="text-sm text-[#7C8493] mb-1">
                                  Date of Birth
                                </p>
                                <p className="text-sm font-medium text-[#25324B]">
                                  {new Date(
                                    candidateData.profile.dateOfBirth
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            )}
                            {candidateData.profile.gender && (
                              <div>
                                <p className="text-sm text-[#7C8493] mb-1">
                                  Gender
                                </p>
                                <p className="text-sm font-medium text-[#25324B] capitalize">
                                  {candidateData.profile.gender
                                    .charAt(0)
                                    .toUpperCase() +
                                    candidateData.profile.gender.slice(1)}
                                </p>
                              </div>
                            )}
                            {candidateData.profile.languages &&
                              candidateData.profile.languages.length > 0 && (
                                <div>
                                  <p className="text-sm text-[#7C8493] mb-1">
                                    Language
                                  </p>
                                  <p className="text-sm font-medium text-[#25324B]">
                                    {candidateData.profile.languages.join(", ")}
                                  </p>
                                </div>
                              )}
                          </div>
                          {candidateData.profile.location && (
                            <div>
                              <p className="text-sm text-[#7C8493] mb-1">
                                Address
                              </p>
                              <p className="text-sm font-medium text-[#25324B]">
                                {candidateData.profile.location}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="h-px bg-[#D6DDEB]"></div>

                        {/* Professional Info Section */}
                        <div>
                          <h3 className="text-lg font-semibold text-[#25324B] mb-5">
                            Professional Info
                          </h3>
                          {candidateData.profile.summary && (
                            <div className="mb-5">
                              <p className="text-sm text-[#7C8493] mb-2">
                                About Me
                              </p>
                              <p className="text-sm text-[#25324B] leading-relaxed">
                                {candidateData.profile.summary}
                              </p>
                            </div>
                          )}
                          {candidateData.profile.skills &&
                            candidateData.profile.skills.length > 0 && (
                              <div>
                                <p className="text-sm text-[#7C8493] mb-2">
                                  Skill set
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {candidateData.profile.skills.map(
                                    (skill: string, i: number) => (
                                      <Badge
                                        key={i}
                                        variant="secondary"
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                                      >
                                        {skill}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Profile information not available</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "resume" && (
                  <div className="space-y-6">
                    {/* Header Section with Profile, Contact Info, and View Resume Button */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-start gap-4">
                        {/* Profile Picture */}
                        <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                          {candidateAvatar ? (
                            <img
                              src={candidateAvatar}
                              alt={candidateName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                              {candidateName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Name, Role, and Contact Info */}
                        <div className="flex-1">
                          <h2 className="text-xl font-semibold text-[#25324B] mb-1">
                            {candidateName}
                          </h2>
                          <p className="text-sm text-[#7C8493] mb-3">
                            {candidateRole}
                          </p>

                          {/* Contact Information */}
                          <div className="space-y-1">
                            {candidateEmail && (
                              <div className="flex items-center gap-2 text-sm text-[#25324B]">
                                <Mail className="h-4 w-4 text-[#7C8493]" />
                                <span>{candidateEmail}</span>
                              </div>
                            )}
                            {candidatePhone && candidatePhone !== "-" && (
                              <div className="flex items-center gap-2 text-sm text-[#25324B]">
                                <Phone className="h-4 w-4 text-[#7C8493]" />
                                <span>{candidatePhone}</span>
                              </div>
                            )}
                            {candidateData?.profile?.location && (
                              <div className="flex items-center gap-2 text-sm text-[#25324B]">
                                <MapPin className="h-4 w-4 text-[#7C8493]" />
                                <span>{candidateData.profile.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* View Resume Button */}
                      {(atsApplication?.resumeUrl ||
                        atsApplication?.resume_url ||
                        candidateData?.profile?.resume?.url) && (
                          <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                              window.open(
                                atsApplication?.resumeUrl ||
                                atsApplication?.resume_url ||
                                candidateData?.profile?.resume?.url,
                                "_blank"
                              )
                            }
                          >
                            <Download className="h-4 w-4" />
                            View Resume
                          </Button>
                        )}
                    </div>

                    {/* Cover Letter */}
                    {(atsApplication?.coverLetter ||
                      atsApplication?.cover_letter) && (
                        <div>
                          <h3 className="text-lg font-semibold text-[#25324B] mb-3">
                            Cover Letter
                          </h3>
                          <p className="text-sm text-[#25324B] whitespace-pre-wrap leading-relaxed">
                            {atsApplication.coverLetter ||
                              atsApplication.cover_letter}
                          </p>
                        </div>
                      )}

                    {/* Languages */}
                    {candidateData?.profile?.languages &&
                      candidateData.profile.languages.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-[#25324B] mb-3">
                            Languages
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {candidateData.profile.languages.map(
                              (lang: string, i: number) => (
                                <span
                                  key={i}
                                  className="text-sm text-[#25324B]"
                                >
                                  {lang}
                                  {i <
                                    (candidateData.profile.languages?.length ||
                                      0) -
                                    1
                                    ? ", "
                                    : ""}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* Experience */}
                    {candidateData?.experiences &&
                      candidateData.experiences.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-[#25324B] mb-3 uppercase">
                            Experience
                          </h3>
                          <div className="space-y-4">
                            {candidateData.experiences.map((exp, i: number) => (
                              <div key={i} className="flex gap-4">
                                <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <Briefcase className="h-6 w-6 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-[#25324B]">
                                    {exp.title}
                                  </h4>
                                  <p className="text-sm text-[#7C8493]">
                                    {exp.company} •{" "}
                                    {exp.employmentType || "Full-time"}
                                  </p>
                                  <p className="text-sm text-[#7C8493] mt-1">
                                    {new Date(exp.startDate).toLocaleDateString(
                                      "en-US",
                                      { month: "short", year: "numeric" }
                                    )}{" "}
                                    -{" "}
                                    {exp.endDate
                                      ? new Date(
                                        exp.endDate
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                      })
                                      : "Present"}
                                  </p>
                                  {exp.location && (
                                    <p className="text-sm text-[#7C8493] mt-1">
                                      {exp.location}
                                    </p>
                                  )}
                                  {exp.description && (
                                    <p className="text-sm text-[#25324B] mt-2 leading-relaxed">
                                      {exp.description}
                                    </p>
                                  )}
                                  {exp.technologies &&
                                    exp.technologies.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {exp.technologies.map(
                                          (tech: string, idx: number) => (
                                            <Badge
                                              key={idx}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {tech}
                                            </Badge>
                                          )
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                {/* Activity Log Tab */}
                {activeTab === "activity" && isATSMode && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">
                        Activity Log
                      </h2>
                    </div>

                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <StageBasedActivityView
                        activities={activities}
                        currentStage={atsApplication?.stage}
                        enabledStages={atsJob?.enabled_stages as string[]}
                        onLoadMore={async () => {
                          if (!id && !candidateId) return;
                          const currentId = id || candidateId;
                          if (
                            !currentId ||
                            !activitiesNextCursor ||
                            loadingMoreActivities
                          )
                            return;

                          setLoadingMoreActivities(true);
                          try {
                            const response =
                              await atsService.getActivitiesByApplicationPaginated(
                                currentId,
                                20,
                                activitiesNextCursor
                              );
                            const newActivities = response.activities || [];
                            // Backend returns newest first, but we need oldest first for chronological timeline
                            // Reverse new activities, then append to existing (which are already oldest first)
                            const reversedNewActivities = [
                              ...newActivities,
                            ].reverse();
                            setActivities((prev) => {
                              // Merge and sort to ensure correct chronological order
                              const merged = [
                                ...prev,
                                ...reversedNewActivities,
                              ];
                              merged.sort((a, b) => {
                                const dateA = new Date(a.createdAt).getTime();
                                const dateB = new Date(b.createdAt).getTime();
                                return dateA - dateB; // Oldest first (chronological)
                              });
                              return merged;
                            });
                            setActivitiesNextCursor(
                              response.nextCursor || null
                            );
                            setActivitiesHasMore(response.hasMore || false);
                          } catch (error) {
                            console.error(
                              "Failed to load more activities:",
                              error
                            );
                          } finally {
                            setLoadingMoreActivities(false);
                          }
                        }}
                        applicationId={id || candidateId}
                        isLoadingMore={loadingMoreActivities}
                        hasMore={activitiesHasMore}
                        formatDateTime={formatDateTime}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setSelectedInterviewForReschedule(null);
        }}
        candidateName={candidateName}
        onSchedule={handleScheduleInterview}
        interviewToReschedule={selectedInterviewForReschedule || undefined}
      />

      {/* Interview Feedback Modal */}
      {selectedInterviewForFeedback && (
        <InterviewFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedInterviewForFeedback(null);
          }}
          interviewTitle={selectedInterviewForFeedback.title}
          onSubmit={(rating, feedback) =>
            handleSubmitFeedback(
              selectedInterviewForFeedback.id,
              rating,
              feedback
            )
          }
        />
      )}

      {/* Task Feedback Modal */}
      {selectedTaskForReview && (
        <InterviewFeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedTaskForReview(null);
          }}
          interviewTitle={selectedTaskForReview.title}
          onSubmit={(rating, feedback) =>
            handleSubmitTaskFeedback(selectedTaskForReview.id, rating, feedback)
          }
        />
      )}

      {/* Assign Task Modal */}
      {atsApplication && (
        <AssignTaskModal
          isOpen={showAssignTaskModal}
          onClose={() => {
            setShowAssignTaskModal(false);
            setSelectedTaskForEdit(null);
          }}
          candidateName={candidateName}
          onAssign={handleAssignTask}
          taskToEdit={
            selectedTaskForEdit
              ? {
                id: selectedTaskForEdit.id,
                title: selectedTaskForEdit.title,
                description: selectedTaskForEdit.description,
                deadline: selectedTaskForEdit.deadline
                  ? new Date(selectedTaskForEdit.deadline)
                    .toISOString()
                    .split("T")[0]
                  : "",
                documentUrl: selectedTaskForEdit.documentUrl || undefined,
                documentFilename:
                  selectedTaskForEdit.documentFilename || undefined,
              }
              : undefined
          }
        />
      )}

      <AddCommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        candidateName={candidateName}
        currentStage={(() => {
          // If selectedStage is 'APPLIED' or 'Applied', use the actual application stage
          const stage = atsApplication?.stage || selectedStage;
          if (stage === "APPLIED" || stage === "Applied") {
            return ATSStage.IN_REVIEW;
          }
          return (stage || ATSStage.IN_REVIEW) as ATSStage;
        })()}
        onAdd={handleAddComment}
      />

      {((atsJob?.enabled_stages && atsJob.enabled_stages.length > 0) ||
        (atsJob?.enabledStages && atsJob.enabledStages.length > 0)) && (
          <MoveToStageModal
            isOpen={showMoveToStageModal}
            onClose={() => setShowMoveToStageModal(false)}
            candidateName={candidateName}
            currentStage={
              selectedStage === "APPLIED" || selectedStage === "Applied"
                ? ATSStage.IN_REVIEW // APPLIED is UI-only, actual stage is IN_REVIEW
                : (atsApplication?.stage as ATSStage) || ATSStage.IN_REVIEW
            }
            availableStages={
              (atsJob.enabled_stages || atsJob.enabledStages || []) as ATSStage[]
            }
            onConfirm={handleMoveToStage}
          />
        )}

      <ConfirmationDialog
        isOpen={showRevokeConfirmDialog}
        onClose={() => {
          setShowRevokeConfirmDialog(false);
          setTaskToRevoke(null);
        }}
        onConfirm={handleRevokeTask}
        title="Revoke Task"
        description="Are you sure you want to revoke this task? This action will mark the task as cancelled."
        confirmText="Revoke"
        cancelText="Cancel"
        variant="danger"
      />

      <ConfirmationDialog
        isOpen={showRejectConfirmDialog}
        onClose={() => setShowRejectConfirmDialog(false)}
        onConfirm={async () => {
          await handleUpdateStage("REJECTED", "");
          setShowRejectConfirmDialog(false);
        }}
        title="Reject Candidate"
        description={`Are you sure you want to reject ${candidateName}? This will move them to the Rejected stage.`}
        confirmText="Reject"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Compensation Modals */}
      <CompensationInitModal
        isOpen={showCompensationInitModal}
        onClose={() => setShowCompensationInitModal(false)}
        candidateName={candidateName}
        onInitiate={handleInitiateCompensation}
        existingData={
          compensationData
            ? {
              candidateExpected: compensationData.candidateExpected,
              companyProposed: compensationData.companyProposed,
              benefits: compensationData.benefits,
              expectedJoining: compensationData.expectedJoining,
              notes:
                compensationNotes.length > 0
                  ? compensationNotes[0]?.comment ||
                  (
                    compensationNotes[0] as {
                      comment?: string;
                      note?: string;
                    }
                  ).note ||
                  ""
                  : undefined,
            }
            : undefined
        }
      />

      <CompensationUpdateModal
        isOpen={showCompensationUpdateModal}
        onClose={() => setShowCompensationUpdateModal(false)}
        candidateName={candidateName}
        currentProposal={compensationData?.companyProposed}
        candidateExpected={compensationData?.candidateExpected}
        existingBenefits={compensationData?.benefits}
        existingExpectedJoining={compensationData?.expectedJoining}
        existingNotes={
          compensationNotes.length > 0
            ? compensationNotes[0]?.comment ||
            (compensationNotes[0] as { comment?: string; note?: string })
              .note ||
            "" ||
            undefined
            : undefined
        }
        onUpdate={handleUpdateCompensation}
      />

      <CompensationMeetingModal
        isOpen={showCompensationMeetingModal}
        onClose={() => {
          setShowCompensationMeetingModal(false);
          setSelectedMeetingForEdit(null);
        }}
        candidateName={candidateName}
        onSchedule={handleScheduleCompensationMeeting}
        meetingToEdit={selectedMeetingForEdit || undefined}
      />

      {/* Offer Modal */}
      {atsApplication && (
        <CreateOfferModal
          isOpen={showCreateOfferModal}
          onClose={() => setShowCreateOfferModal(false)}
          candidateName={candidateName}
          jobTitle={atsJob?.title || "N/A"}
          onCreate={handleCreateOffer}
          offerToEdit={
            showEditOfferModal && currentOffer
              ? {
                documentUrl:
                  (currentOffer as ExtendedATSOfferDocument).documentUrl ||
                  "",
                documentFilename:
                  (currentOffer as ExtendedATSOfferDocument)
                    .documentFilename || "",
                offerAmount:
                  (currentOffer as ExtendedATSOfferDocument).offerAmount ||
                  "",
                employmentType:
                  (currentOffer as ExtendedATSOfferDocument).employmentType ||
                  "full-time",
                joiningDate: "",
                validityDate: "",
                id: currentOffer.id,
              }
              : undefined
          }
        />
      )}

      {/* Withdraw Offer Modal */}
      <Dialog
        open={showWithdrawOfferModal}
        onOpenChange={setShowWithdrawOfferModal}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Withdraw Offer
            </DialogTitle>
            <DialogDescription className="pt-2">
              This action should only be used in exceptional cases. Once
              withdrawn, the offer cannot be reinstated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-reason">
                Reason <span className="text-red-500">*</span>
              </Label>
              <Select value={withdrawReason} onValueChange={setWithdrawReason}>
                <SelectTrigger id="withdraw-reason" className="w-full">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="background_verification_failed">
                    Background verification failed
                  </SelectItem>
                  <SelectItem value="candidate_violated_conditions">
                    Candidate violated conditions
                  </SelectItem>
                  <SelectItem value="role_cancelled_budget">
                    Role cancelled / budget issue
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {withdrawReason === "other" && (
              <div className="space-y-2">
                <Label htmlFor="withdraw-note">
                  Note <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="withdraw-note"
                  placeholder="Please provide details..."
                  value={withdrawOtherNote}
                  onChange={(e) => setWithdrawOtherNote(e.target.value)}
                  rows={4}
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  Please provide a detailed explanation for withdrawing this
                  offer.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowWithdrawOfferModal(false);
                setWithdrawReason("");
                setWithdrawOtherNote("");
              }}
              disabled={withdrawing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!withdrawReason) {
                  toast({
                    title: "Error",
                    description:
                      "Please select a reason for withdrawing the offer.",
                    variant: "destructive",
                  });
                  return;
                }
                if (withdrawReason === "other" && !withdrawOtherNote.trim()) {
                  toast({
                    title: "Error",
                    description:
                      "Please provide a note when selecting 'Other' as the reason.",
                    variant: "destructive",
                  });
                  return;
                }

                if (!currentId || !currentOffer?.id) return;

                try {
                  setWithdrawing(true);

                  // Prepare withdrawal reason text
                  const reasonText =
                    withdrawReason === "other"
                      ? withdrawOtherNote
                      : withdrawReason
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase());

                  // Update offer status to declined with withdrawal reason
                  await atsService.updateOfferStatus(currentOffer.id, {
                    status: "declined",
                    withdrawalReason: reasonText,
                  });

                  // Add a comment with the withdrawal reason
                  await atsService.addComment({
                    applicationId: currentId,
                    comment: `Offer withdrawn. Reason: ${reasonText}`,
                    stage: ATSStage.OFFER,
                  });

                  toast({
                    title: "Success",
                    description: "Offer has been withdrawn successfully.",
                  });

                  setShowWithdrawOfferModal(false);
                  setWithdrawReason("");
                  setWithdrawOtherNote("");
                  await reloadData();
                } catch (error: unknown) {
                  console.error("Error withdrawing offer:", error);
                  toast({
                    title: "Error",
                    description:
                      (error as { response?: { data?: { message?: string } } })
                        ?.response?.data?.message ||
                      "Failed to withdraw offer.",
                    variant: "destructive",
                  });
                } finally {
                  setWithdrawing(false);
                }
              }}
              disabled={
                withdrawing ||
                !withdrawReason ||
                (withdrawReason === "other" && !withdrawOtherNote.trim())
              }
            >
              {withdrawing ? "Withdrawing..." : "Confirm Withdraw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Limit Exceeded Dialog */}
      <Dialog open={showLimitExceededDialog} onOpenChange={setShowLimitExceededDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Candidate View Limit Exceeded
            </DialogTitle>
            <DialogDescription>
              You have reached your candidate view limit for your current subscription plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Current Usage:</strong> {limitExceededData?.used || 0} / {limitExceededData?.currentLimit || 0} views
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Upgrade your plan to view more candidate profiles and unlock additional features.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLimitExceededDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowLimitExceededDialog(false);
                navigate('/company/billing');
              }}
              className="bg-[#4640DE] hover:bg-[#3730b8]"
            >
              Upgrade Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CompanyLayout>
  );
};

export default CandidateProfileView;