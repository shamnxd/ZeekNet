import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { companyApi } from "@/api/company.api";
import { atsService } from "@/services/ats.service";
import { toast } from "@/hooks/use-toast";
import type { CandidateDetailsResponse } from "@/api/company.api";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import type { ATSInterview, ATSComment } from "@/types/ats";
import type {
  ExtendedATSTechnicalTask,
  ExtendedATSOfferDocument,

  CompensationMeeting,
} from "@/types/ats-profile";
import {
  ATSStage,
  ATSStageDisplayNames,
  InterviewSubStage,
  TechnicalTaskSubStage,
  CompensationSubStage,
  OfferSubStage,
  ShortlistedSubStage,
} from "@/constants/ats-stages";
import {
  getString,
  getNumber,
  getStringArray,
} from "@/utils/formatters";

export const useCandidateProfile = () => {
  const { id, candidateId } = useParams<{
    id?: string;
    candidateId?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();


  const [candidateData, setCandidateData] =
    useState<CandidateDetailsResponse | null>(null);


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
    "profile" | "resume" | "hiring"
  >("profile");
  const [selectedStage, setSelectedStage] = useState<string>("");



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
  const [selectedTaskForEdit, setSelectedTaskForEdit] =
    useState<ExtendedATSTechnicalTask | null>(null);
  const [showRevokeConfirmDialog, setShowRevokeConfirmDialog] = useState(false);
  const [taskToRevoke, setTaskToRevoke] = useState<string | null>(null);


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


  const [currentOffer, setCurrentOffer] =
    useState<ExtendedATSOfferDocument | null>(null);
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [showEditOfferModal, setShowEditOfferModal] = useState(false);
  const [showWithdrawOfferModal, setShowWithdrawOfferModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState<string>("");
  const [withdrawOtherNote, setWithdrawOtherNote] = useState<string>("");
  const [withdrawing, setWithdrawing] = useState(false);

  const isATSMode =
    location.pathname.includes("/ats/candidate/") ||
    location.pathname.includes("/company/applicants/");
  const currentId = candidateId || id;

  const reloadData = useCallback(async () => {
    if (!currentId) return;

    try {
      if (isATSMode) {
        const appRes = await companyApi.getApplicationDetails(currentId);
        if (appRes.data) {
          const applicationData = appRes.data as Record<string, unknown>;
          const mappedApplication: CompanySideApplication = {
            id: getString(applicationData.id || applicationData._id),
            _id: getString(applicationData.id || applicationData._id),
            jobId: getString(applicationData.job_id),
            job_id: getString(applicationData.job_id),
            seekerId: getString(applicationData.seeker_id),
            seeker_id: getString(applicationData.seeker_id),
            companyId: getString(applicationData.company_id),
            company_id: getString(applicationData.company_id),
            stage: getString(applicationData.stage),
            subStage: getString(applicationData.sub_stage),
            sub_stage: getString(applicationData.sub_stage),
            resumeUrl: getString(applicationData.resume_url),
            resume_url: getString(applicationData.resume_url),
            resume_filename: getString(applicationData.resume_filename),
            coverLetter: getString(applicationData.cover_letter),
            cover_letter: getString(applicationData.cover_letter),
            createdAt: getString(applicationData.created_at),
            created_at: getString(applicationData.created_at),
            updatedAt: getString(applicationData.updated_at),
            updated_at: getString(applicationData.updated_at),
            applied_date: getString(applicationData.applied_date),
            appliedAt: getString(applicationData.applied_date),
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

          const jobId =
            getString(applicationData.job_id) ||
            mappedApplication.jobId ||
            mappedApplication.job?.id;
          const seekerId =
            getString(applicationData.seeker_id) ||
            mappedApplication.seekerId ||
            mappedApplication.seeker?.id;
          const currentStage = mappedApplication.stage;

          const fetchPromises = [
            jobId
              ? companyApi.getJobPosting(jobId).catch((e) => {
                console.error("Failed to fetch job", e);
                return { data: null };
              })
              : Promise.resolve({ data: null }),
            seekerId
              ? companyApi.getCandidateDetails(seekerId).catch((e) => {
                console.error("Failed to fetch candidate details", e);
                return { data: null };
              })
              : Promise.resolve({ data: null }),
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
            const resumeData = applicationData.resume_data as Record<string, unknown>;
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
              experiences: (resumeData?.experience as Record<string, unknown>[] | undefined)?.map((exp) => {
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
                  technologies: [],
                  isCurrent: period.includes("Present") || false,
                };
              }) || [],
              educations: (resumeData?.education as Record<string, unknown>[] | undefined)?.map((edu) => {
                const period = typeof edu.period === "string" ? edu.period : "";
                return {
                  id: "",
                  school: typeof edu.school === "string" ? edu.school : "",
                  degree: typeof edu.degree === "string" ? edu.degree : undefined,
                  startDate: period.split(" - ")[0] || "",
                  endDate: period.includes("Present") ? undefined : period.split(" - ")[1],
                  fieldOfStudy: "",
                  grade: undefined,
                };
              }) || [],
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
            compensationResults.length >= 3
          ) {
            const [compensationRes, meetingsRes, notesRes] = compensationResults;
            setCompensationData(compensationRes || null);


            const meetingsData: CompensationMeeting[] = Array.isArray(meetingsRes)
              ? meetingsRes.filter((m): m is Record<string, unknown> => m != null).map((m: Record<string, unknown>) => ({
                id: String(m.id),
                type: (typeof m.type === "string" && ["call", "online", "in-person"].includes(m.type)) ? (m.type as 'call' | 'online' | 'in-person') : "call",
                scheduledDate: String(m.scheduledDate),
                location: typeof m.location === "string" ? m.location : undefined,
                meetingLink: typeof m.meetingLink === "string" ? m.meetingLink : undefined,
                notes: typeof m.notes === "string" ? m.notes : undefined,
                status: (typeof m.status === "string" && ["scheduled", "completed", "cancelled"].includes(m.status)) ? (m.status as 'scheduled' | 'completed' | 'cancelled') : undefined,
                completedAt: typeof m.completedAt === "string" ? m.completedAt : undefined,
                createdAt: typeof m.createdAt === "string" ? m.createdAt : new Date().toISOString(),
                updatedAt: typeof m.updatedAt === "string" ? m.updatedAt : undefined,
              }))
              : [];
            setCompensationMeetings(meetingsData);
            setCompensationNotes(Array.isArray(notesRes) ? notesRes : []);
          } else {
            setCompensationData(null);
            setCompensationMeetings([]);
            setCompensationNotes([]);
          }
        }
      } else {
        try {
          const candRes = await companyApi.getCandidateDetails(currentId);
          if (candRes.data) {
            setCandidateData(candRes.data);
          }
        } catch (e) {
          console.error("Failed to fetch candidate details", e);
          toast({
            title: "Error",
            description: "Failed to load candidate data.",
            variant: "destructive",
          });
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

  const hiringStages = useMemo(() => {
    const allStages =
      (atsJob?.enabled_stages as string[]) || Object.values(ATSStage);
    const stagesWithApplied = ["APPLIED", ...allStages];
    const currentStage = atsApplication?.stage || ATSStage.IN_REVIEW;
    const currentStageIndex = stagesWithApplied.indexOf(currentStage);
    const finalCurrentStageIndex =
      currentStageIndex >= 0 ? currentStageIndex : 1;
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

  useEffect(() => {
    if (activeTab === "hiring") {
      if (atsApplication?.stage) {
        setSelectedStage(atsApplication.stage);
      }
    }
  }, [activeTab, atsApplication?.stage]);

  const handleUpdateStage = async (stage: string, subStage?: string) => {
    if (!currentId) return;
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
    if (!currentId) return;
    try {
      let subStage = undefined;

      if (targetStage === ATSStage.SHORTLISTED) {
        subStage = ShortlistedSubStage.READY_FOR_INTERVIEW;
      } else if (targetStage === ATSStage.INTERVIEW) {
        subStage = InterviewSubStage.SCHEDULED;
      } else if (targetStage === ATSStage.TECHNICAL_TASK) {
        subStage = TechnicalTaskSubStage.NOT_ASSIGNED;
      } else if (targetStage === ATSStage.COMPENSATION) {
        subStage = CompensationSubStage.NOT_INITIATED;
      } else if (targetStage === ATSStage.OFFER) {
        subStage = OfferSubStage.NOT_SENT;
      }

      await companyApi.moveApplicationStage(currentId, {
        nextStage: targetStage,
        subStage: subStage,
        comment: reason || `Moved to ${ATSStageDisplayNames[targetStage] || targetStage}`,
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

  const updateInterviewSubStageBasedOnStatus = async () => {
    if (
      !currentId ||
      !atsApplication ||
      atsApplication.stage !== ATSStage.INTERVIEW
    )
      return;

    try {
      const interviewsRes = await atsService.getInterviewsByApplication(currentId);
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
      if (allCompleted && activeInterviews.length > 0 && !hasScheduledInterviews) {
        targetSubStage = InterviewSubStage.EVALUATION_PENDING;
      } else if (hasScheduledInterviews) {
        targetSubStage = InterviewSubStage.SCHEDULED;
      }

      if (targetSubStage && atsApplication.subStage !== targetSubStage) {
        await companyApi.updateApplicationSubStage(currentId, {
          subStage: targetSubStage,
          comment: allCompleted ? "All interviews completed" : "Interview status updated",
        });
        await reloadData();
      }
    } catch (error) {
      console.error("Failed to update interview substage:", error);
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
      if (interviewId) {
        await atsService.updateInterview(interviewId, { status: "cancelled" });
        await atsService.scheduleInterview({
          applicationId: currentId,
          title: data.title,
          scheduledDate: scheduledDate.toISOString(),
          type: data.type,
          videoType: data.videoType,
          meetingLink: data.videoType === "external" ? data.meetingLink : undefined,
          location: data.location,
        });
      } else {
        await atsService.scheduleInterview({
          applicationId: currentId,
          title: data.title,
          scheduledDate: scheduledDate.toISOString(),
          type: data.type,
          videoType: data.videoType,
          meetingLink: data.videoType === "external" ? data.meetingLink : undefined,
          location: data.location,
        });

        if (atsApplication?.stage !== ATSStage.INTERVIEW) {
          await companyApi.moveApplicationStage(currentId, {
            nextStage: ATSStage.INTERVIEW,
            subStage: InterviewSubStage.SCHEDULED,
            comment: "Interview scheduled",
          });
        } else {
          if (atsApplication.subStage !== InterviewSubStage.SCHEDULED && atsApplication.subStage !== InterviewSubStage.EVALUATION_PENDING) {
            await companyApi.updateApplicationSubStage(currentId, {
              subStage: InterviewSubStage.SCHEDULED,
              comment: "Interview scheduled",
            });
          }
        }
      }
      await reloadData();
      await updateInterviewSubStageBasedOnStatus();
      toast({
        title: "Success",
        description: interviewId ? "Interview rescheduled successfully." : "Interview scheduled successfully.",
      });
      setShowScheduleModal(false);
      setSelectedInterviewForReschedule(null);
    } catch (error) {
      console.error("Failed to schedule interview:", error);
      toast({
        title: "Error",
        description: interviewId ? "Failed to reschedule interview." : "Failed to schedule interview.",
        variant: "destructive",
      });
    }
  };

  const handleMarkInterviewComplete = async (interviewId: string) => {
    if (!currentId) return;
    try {
      await atsService.updateInterview(interviewId, { status: "completed" });
      await reloadData();
      await updateInterviewSubStageBasedOnStatus();
      toast({ title: "Success", description: "Interview marked as completed." });
    } catch (error) {
      console.error("Failed to mark interview as completed:", error);
      toast({ title: "Error", description: "Failed to mark interview as completed.", variant: "destructive" });
    }
  };

  const handleCancelInterview = async (interviewId: string) => {
    if (!currentId) return;
    try {
      await atsService.updateInterview(interviewId, { status: "cancelled" });
      await reloadData();
      await updateInterviewSubStageBasedOnStatus();
      toast({ title: "Success", description: "Interview cancelled." });
    } catch (error) {
      console.error("Failed to cancel interview:", error);
      toast({ title: "Error", description: "Failed to cancel interview.", variant: "destructive" });
    }
  };

  const handleSubmitFeedback = async (interviewId: string, rating: number, feedback: string) => {
    if (!currentId) return;
    try {
      await atsService.updateInterview(interviewId, { rating, feedback });
      await reloadData();
      toast({ title: "Success", description: "Feedback submitted successfully." });
      setShowFeedbackModal(false);
      setSelectedInterviewForFeedback(null);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({ title: "Error", description: "Failed to submit feedback.", variant: "destructive" });
      throw error;
    }
  };

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
        await atsService.updateTechnicalTask(selectedTaskForEdit.id, {
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline,
          document: taskData.document,
          documentUrl: taskData.documentUrl,
          documentFilename: taskData.documentFilename,
        });
        toast({ title: "Success", description: "Technical task updated successfully." });
      } else {
        await atsService.assignTechnicalTask({
          applicationId: currentId,
          title: taskData.title,
          description: taskData.description,
          deadline: taskData.deadline,
          document: taskData.document,
          documentUrl: taskData.documentUrl,
          documentFilename: taskData.documentFilename,
        });
        if (atsApplication?.stage === ATSStage.TECHNICAL_TASK) {
          await companyApi.moveApplicationStage(currentId, {
            nextStage: ATSStage.TECHNICAL_TASK,
            subStage: TechnicalTaskSubStage.ASSIGNED,
            comment: `Technical task assigned – Due ${new Date(taskData.deadline).toLocaleDateString()}`,
          });
        }
        toast({ title: "Success", description: "Technical task assigned successfully." });
      }
      await reloadData();
      setShowAssignTaskModal(false);
      setSelectedTaskForEdit(null);
    } catch (error) {
      console.error("Failed to assign/update task:", error);
      toast({ title: "Error", description: "Failed to task operation.", variant: "destructive" });
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
      await atsService.updateTechnicalTask(taskToRevoke, { status: "cancelled" });
      toast({ title: "Success", description: "Task revoked successfully." });
      await reloadData();

      const tasksRes = await atsService.getTechnicalTasksByApplication(currentId);
      const allTasks = tasksRes.data || [];
      const activeTasks = allTasks.filter((t: ExtendedATSTechnicalTask) => t.status !== "completed");

      if (activeTasks.length === 0 && atsApplication?.stage === ATSStage.TECHNICAL_TASK) {
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
      toast({ title: "Error", description: "Failed to revoke task.", variant: "destructive" });
    }
  };

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
        compensationRes = await atsService.updateCompensation(currentId, {
          candidateExpected: data.candidateExpected,
          companyProposed: data.companyProposed,
          benefits: data.benefits,
          expectedJoining: data.expectedJoining,
        });
      } else {
        compensationRes = await atsService.initiateCompensation(currentId, {
          candidateExpected: data.candidateExpected,
          notes: data.notes,
        });
        if (data.companyProposed || data.benefits || data.expectedJoining) {
          compensationRes = await atsService.updateCompensation(currentId, {
            companyProposed: data.companyProposed,
            benefits: data.benefits,
            expectedJoining: data.expectedJoining,
          });
        }
      }

      if (atsApplication?.subStage === CompensationSubStage.NOT_INITIATED) {
        await companyApi.moveApplicationStage(currentId, {
          nextStage: ATSStage.COMPENSATION,
          subStage: CompensationSubStage.INITIATED,
          comment: `Compensation discussion initiated - Expects ${data.candidateExpected}`,
        });
      }

      setCompensationData(compensationRes.data || compensationRes);
      if (data.notes) {
        await atsService.addComment({
          applicationId: currentId,
          comment: data.notes,
          stage: ATSStage.COMPENSATION,
        });
        const commentsRes = await atsService.getCommentsByApplication(currentId);
        setComments(commentsRes.data || []);
      }
      if (atsApplication) {
        setAtsApplication({ ...atsApplication, subStage: CompensationSubStage.INITIATED });
      }
      toast({ title: "Success", description: "Compensation saved." });
    } catch (error) {
      console.error("Failed to initiate/update compensation:", error);
      toast({ title: "Error", description: "Failed to save compensation.", variant: "destructive" });
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
      const isSubsequentUpdate = compensationData?.companyProposed;
      const updatedRes = await atsService.updateCompensation(currentId, data);
      setCompensationData(updatedRes.data);
      if (isSubsequentUpdate && atsApplication?.subStage === CompensationSubStage.INITIATED) {
        await companyApi.moveApplicationStage(currentId, {
          nextStage: ATSStage.COMPENSATION,
          subStage: CompensationSubStage.NEGOTIATION_ONGOING,
          comment: "Negotiation started",
        });
        if (atsApplication) setAtsApplication({ ...atsApplication, subStage: CompensationSubStage.NEGOTIATION_ONGOING });
      }
      if (data.notes) {
        await atsService.addComment({
          applicationId: currentId,
          comment: data.notes,
          stage: ATSStage.COMPENSATION,
        });
        const commentsRes = await atsService.getCommentsByApplication(currentId);
        setComments(commentsRes.data || []);
      }
      toast({ title: "Success", description: "Compensation updated." });
    } catch (error) {
      console.error("Failed to update compensation:", error);
      toast({ title: "Error", description: "Failed to update.", variant: "destructive" });
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
      const meetingRes = await atsService.scheduleCompensationMeeting(currentId, {
        ...data,
        meetingLink: data.videoType === "external" ? data.meetingLink : undefined
      });
      setCompensationMeetings((prev) => [...(prev || []), meetingRes.data]);
      toast({ title: "Success", description: "Meeting scheduled." });
    } catch (error) {
      console.error("Failed to schedule meeting:", error);
      toast({ title: "Error", description: "Failed to schedule meeting.", variant: "destructive" });
    }
  };

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
      if (!data.document) {
        toast({ title: "Error", description: "Please upload an offer document.", variant: "destructive" });
        return;
      }
      await atsService.uploadOffer({
        applicationId: currentId,
        offerAmount: data.offerAmount,
        document: data.document,
      });
      await companyApi.moveApplicationStage(currentId, {
        nextStage: ATSStage.OFFER,
        subStage: OfferSubStage.OFFER_SENT,
        comment: `Offer created - ${data.offerAmount}`,
      });
      if (data.notes) {
        await atsService.addComment({
          applicationId: currentId,
          comment: data.notes,
          stage: ATSStage.OFFER,
        });
      }
      toast({ title: "Success", description: "Offer sent." });
      await reloadData();
    } catch (error) {
      console.error("Failed to create offer:", error);
      toast({ title: "Error", description: "Failed to create offer.", variant: "destructive" });
    }
  };

  const handleSendReminder = async () => {
    if (!currentId) return;
    try {
      toast({ title: "Success", description: "Reminder sent." });
      await atsService.addComment({
        applicationId: currentId,
        comment: "Reminder sent about pending offer",
        stage: ATSStage.OFFER,
      });
      await reloadData();
    } catch (error) {
      console.error("Failed to send reminder:", error);
      toast({ title: "Error", description: "Failed to send reminder.", variant: "destructive" });
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
      toast({ title: "Error", description: "Failed to mark as hired.", variant: "destructive" });
    }
  };

  const handleReviewTask = async (taskId: string) => {
    if (!currentId) return;
    try {
      await atsService.updateTechnicalTask(taskId, { status: "under_review" });
      if (atsApplication?.stage === ATSStage.TECHNICAL_TASK && atsApplication?.subStage !== TechnicalTaskSubStage.UNDER_REVIEW) {
        await companyApi.moveApplicationStage(currentId, {
          nextStage: ATSStage.TECHNICAL_TASK,
          subStage: TechnicalTaskSubStage.UNDER_REVIEW,
          comment: "Task review started",
        });
      }
      await reloadData();
      const tasksRes = await atsService.getTechnicalTasksByApplication(currentId);
      const updatedTasks = tasksRes.data || [];
      const task = updatedTasks.find((t: ExtendedATSTechnicalTask) => t.id === taskId);
      if (task) {
        setSelectedTaskForReview(task);
        setShowFeedbackModal(true);
      }
    } catch (error) {
      console.error("Failed to start review:", error);
      toast({ title: "Error", description: "Failed to start review.", variant: "destructive" });
    }
  };

  const handleSubmitTaskFeedback = async (taskId: string, rating: number, feedback: string) => {
    if (!currentId) return;
    try {
      await atsService.updateTechnicalTask(taskId, { status: "completed", rating, feedback });
      toast({ title: "Success", description: "Feedback submitted." });
      await reloadData();

      const updatedTasksRes = await atsService.getTechnicalTasksByApplication(currentId);
      const updatedTasks = updatedTasksRes.data || [];
      const allTasksCompleted = updatedTasks.length > 0 && updatedTasks.every((t: ExtendedATSTechnicalTask) => t.status === "completed");

      if (allTasksCompleted && atsApplication?.stage === ATSStage.TECHNICAL_TASK) {
        await companyApi.moveApplicationStage(currentId, {
          nextStage: ATSStage.TECHNICAL_TASK,
          subStage: TechnicalTaskSubStage.COMPLETED,
          comment: "Task feedback added",
        });
        await reloadData();
      }
      setShowFeedbackModal(false);
      setSelectedTaskForReview(null);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast({ title: "Error", description: "Failed to submit feedback.", variant: "destructive" });
      throw error;
    }
  };

  const interviewSummary = useMemo(() => {
    const scheduledInterviews = interviews.filter((i) => i.status === "scheduled");
    const completedInterviews = interviews.filter((i) => i.status === "completed");
    const allCompletedHaveFeedback = completedInterviews.length > 0 && completedInterviews.every((i) => i.feedback && i.rating);
    const upcomingInterview = scheduledInterviews.length > 0 ? scheduledInterviews[0] : null;
    const hasIncompleteInterviews = scheduledInterviews.length > 0;

    let overallStatus = "Scheduled";
    if (completedInterviews.length > 0 && !allCompletedHaveFeedback) {
      overallStatus = "Evaluation Pending";
    } else if (completedInterviews.length > 0 && allCompletedHaveFeedback && !hasIncompleteInterviews) {
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

  const isCurrentStage = (selectedStage: string): boolean => {
    const actualStage = atsApplication?.stage || ATSStage.IN_REVIEW;
    if (selectedStage === "APPLIED" || selectedStage === "Applied") {
      return actualStage === ATSStage.IN_REVIEW;
    }
    return selectedStage === actualStage;
  };

  const hasNextStages = (currentStage: ATSStage | string): boolean => {
    const enabledStagesRaw = atsJob?.enabled_stages || atsJob?.enabledStages || [];
    if (!Array.isArray(enabledStagesRaw) || enabledStagesRaw.length === 0) return false;

    const displayNameToEnum = Object.entries(ATSStageDisplayNames).reduce((acc, [enumValue, displayName]) => {
      acc[displayName] = enumValue;
      return acc;
    }, {} as Record<string, string>);

    const allStages = enabledStagesRaw.map((stage: string) => {
      if (Object.values(ATSStage).includes(stage as ATSStage)) return stage;
      return displayNameToEnum[stage] || stage;
    }) as ATSStage[];

    if (currentStage === "APPLIED" || currentStage === "Applied") return allStages.length > 0;
    if (!currentStage) return false;
    const currentIndex = allStages.indexOf(currentStage as ATSStage);
    return currentIndex >= 0 && currentIndex < allStages.length - 1;
  };

  const getNextStage = (currentStage: ATSStage | string): ATSStage | null => {
    const enabledStagesRaw = atsJob?.enabled_stages || atsJob?.enabledStages || [];
    if (!Array.isArray(enabledStagesRaw) || enabledStagesRaw.length === 0) return null;

    const displayNameToEnum = Object.entries(ATSStageDisplayNames).reduce((acc, [enumValue, displayName]) => {
      acc[displayName] = enumValue;
      return acc;
    }, {} as Record<string, string>);

    const allStages = enabledStagesRaw.map((stage: string) => {
      if (Object.values(ATSStage).includes(stage as ATSStage)) return stage;
      return displayNameToEnum[stage] || stage;
    }) as ATSStage[];

    if (!currentStage || currentStage === "APPLIED" || currentStage === "Applied") {
      return allStages.length > 0 ? allStages[0] : null;
    }

    const currentIndex = allStages.indexOf(currentStage as ATSStage);
    if (currentIndex >= 0 && currentIndex < allStages.length - 1) {
      return allStages[currentIndex + 1];
    }
    return null;
  };

  return {

    id, candidateId, navigate, location, currentId, isATSMode,
    candidateData, setCandidateData,
    atsApplication, setAtsApplication,
    atsJob, setAtsJob,
    interviews, setInterviews,
    technicalTasks, setTechnicalTasks,
    offerDocuments, setOfferDocuments,
    comments, setComments,
    loading, setLoading,
    activeTab, setActiveTab,
    selectedStage, setSelectedStage,



    hiringStages, interviewSummary,
    isCurrentStage, hasNextStages, getNextStage,


    showScheduleModal, setShowScheduleModal,
    showCommentModal, setShowCommentModal,
    showMoveToStageModal, setShowMoveToStageModal,
    showFeedbackModal, setShowFeedbackModal,
    selectedInterviewForFeedback, setSelectedInterviewForFeedback,
    selectedInterviewForReschedule, setSelectedInterviewForReschedule,
    showAssignTaskModal, setShowAssignTaskModal,
    selectedTaskForReview, setSelectedTaskForReview,
    selectedTaskForEdit, setSelectedTaskForEdit,
    showRevokeConfirmDialog, setShowRevokeConfirmDialog,
    taskToRevoke, setTaskToRevoke,


    compensationData, setCompensationData,
    compensationNotes, setCompensationNotes,
    compensationMeetings, setCompensationMeetings,
    showCompensationInitModal, setShowCompensationInitModal,
    showCompensationUpdateModal, setShowCompensationUpdateModal,
    showCompensationMeetingModal, setShowCompensationMeetingModal,
    selectedMeetingForEdit, setSelectedMeetingForEdit,


    currentOffer, setCurrentOffer,
    showCreateOfferModal, setShowCreateOfferModal,
    showEditOfferModal, setShowEditOfferModal,
    showWithdrawOfferModal, setShowWithdrawOfferModal,
    withdrawReason, setWithdrawReason,
    withdrawOtherNote, setWithdrawOtherNote,
    withdrawing, setWithdrawing,


    reloadData,
    handleUpdateStage, handleAddComment, handleMoveToStage,
    handleScheduleInterview, handleMarkInterviewComplete, handleCancelInterview, handleSubmitFeedback,
    handleAssignTask, handleEditTask, handleRevokeTaskClick, handleRevokeTask,
    handleInitiateCompensation, handleUpdateCompensation, handleScheduleCompensationMeeting,
    handleCreateOffer, handleSendReminder, handleMarkAsHired,
    handleReviewTask, handleSubmitTaskFeedback
  };
};
