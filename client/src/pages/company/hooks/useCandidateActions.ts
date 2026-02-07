import { useCallback } from "react";
import { companyApi } from "@/api/company.api";
import { atsService } from "@/services/ats.service";
import { toast } from "@/hooks/use-toast";
import {
    ATSStage,
    ATSStageDisplayNames,
    ShortlistedSubStage,
    InterviewSubStage,
    TechnicalTaskSubStage,
    CompensationSubStage,
    OfferSubStage,
} from "@/constants/ats-stages";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { ATSInterview, ATSComment } from "@/types/ats";
import type {
    ExtendedATSTechnicalTask,
    CompensationData,
    CompensationMeeting,
    InterviewFormData,
    TaskFormData,
    CompensationFormData,
    CompensationMeetingFormData,
    OfferFormData
} from "../CandidateProfileTypes";

interface CandidateActionsContext {
    currentId?: string;
    atsApplication: CompanySideApplication | null;
    compensationData: CompensationData | null;
    reloadData: () => Promise<void>;
    selectedStage: string;

    // Modal State & Setters (from useCandidateModals)
    modals: {
        setShowScheduleModal: (show: boolean) => void;
        setShowCommentModal: (show: boolean) => void;
        setShowMoveToStageModal: (show: boolean) => void;
        setShowFeedbackModal: (show: boolean) => void;
        setSelectedInterviewForFeedback: (val: ATSInterview | null) => void;
        setSelectedInterviewForReschedule: (val: ATSInterview | null) => void;
        setShowAssignTaskModal: (show: boolean) => void;
        setSelectedTaskForReview: (val: ExtendedATSTechnicalTask | null) => void;
        selectedTaskForEdit: ExtendedATSTechnicalTask | null;
        setSelectedTaskForEdit: (val: ExtendedATSTechnicalTask | null) => void;
        setShowRevokeConfirmDialog: (show: boolean) => void;
        taskToRevoke: string | null;
        setTaskToRevoke: (val: string | null) => void;
        setShowCompensationInitModal: (show: boolean) => void;
        setShowCompensationUpdateModal: (show: boolean) => void;
        setShowCompensationMeetingModal: (show: boolean) => void;
        setSelectedMeetingForEdit: (val: CompensationMeeting | null) => void;
        setShowRejectConfirmDialog: (show: boolean) => void;
    };

    // Data Setters (from useCandidateData)
    setters: {
        setAtsApplication: (val: CompanySideApplication | null) => void;
        setCompensationData: (val: CompensationData | null) => void;
        setComments: (val: ATSComment[]) => void;
        setCompensationMeetings: (val: CompensationMeeting[] | ((prev: CompensationMeeting[]) => CompensationMeeting[])) => void;
    };
}

export const useCandidateActions = (context: CandidateActionsContext) => {
    const {
        currentId,
        atsApplication,
        compensationData,
        reloadData,
        selectedStage,
        modals,
        setters
    } = context;

    const handleUpdateStage = useCallback(async (stage: string, subStage?: string) => {
        if (!currentId) return;
        try {
            await atsService.updateApplicationStage(currentId, {
                stage,
                ...(subStage && subStage !== "" ? { subStage } : {}),
            });
            toast({ title: "Success", description: "Stage updated successfully." });
            await reloadData();
        } catch (error) {
            console.error("Failed to update stage:", error);
            toast({ title: "Error", description: "Failed to update stage.", variant: "destructive" });
        }
    }, [currentId, reloadData]);

    const handleAddComment = useCallback(async (comment: string) => {
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
            modals.setShowCommentModal(false);
        } catch (error) {
            console.error("Failed to add comment:", error);
            toast({ title: "Error", description: "Failed to add comment.", variant: "destructive" });
        }
    }, [currentId, atsApplication, selectedStage, reloadData, modals]);

    const handleMoveToStage = useCallback(async (targetStage: ATSStage, reason?: string) => {
        if (!currentId || !atsApplication) return;
        try {
            let subStage: string | undefined;
            if (targetStage === ATSStage.SHORTLISTED) subStage = ShortlistedSubStage.READY_FOR_INTERVIEW;
            else if (targetStage === ATSStage.INTERVIEW) subStage = InterviewSubStage.NOT_SCHEDULED;
            else if (targetStage === ATSStage.TECHNICAL_TASK) subStage = TechnicalTaskSubStage.NOT_ASSIGNED;
            else if (targetStage === ATSStage.COMPENSATION) subStage = CompensationSubStage.NOT_INITIATED;
            else if (targetStage === ATSStage.OFFER) subStage = OfferSubStage.NOT_SENT;

            await companyApi.moveApplicationStage(currentId, {
                nextStage: targetStage,
                subStage: subStage,
                comment: reason || `Moved to ${ATSStageDisplayNames[targetStage] || targetStage}`,
            });
            toast({ title: "Success", description: "Candidate moved to new stage successfully." });
            await reloadData();
            modals.setShowMoveToStageModal(false);
        } catch (error) {
            console.error("Failed to move stage:", error);
            toast({ title: "Error", description: "Failed to move stage.", variant: "destructive" });
        }
    }, [currentId, atsApplication, reloadData, modals]);

    // Helper for interview status updates
    const updateInterviewSubStageBasedOnStatus = useCallback(async () => {
        if (!currentId || !atsApplication || atsApplication.stage !== ATSStage.INTERVIEW) return;
        try {
            const interviewsRes = await atsService.getInterviewsByApplication(currentId);
            const activeInterviews = (interviewsRes.data || []).filter((i: ATSInterview) => i.status !== "cancelled");
            const hasScheduledInterviews = activeInterviews.some((i: ATSInterview) => i.status === "scheduled");
            const allCompleted = activeInterviews.length > 0 && activeInterviews.every((i: ATSInterview) => i.status === "completed");

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
    }, [currentId, atsApplication, reloadData]);

    const handleScheduleInterview = useCallback(async (data: InterviewFormData, interviewId?: string) => {
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
                } else if (atsApplication.subStage !== InterviewSubStage.SCHEDULED && atsApplication.subStage !== InterviewSubStage.EVALUATION_PENDING) {
                    await companyApi.updateApplicationSubStage(currentId, {
                        subStage: InterviewSubStage.SCHEDULED,
                        comment: "Interview scheduled",
                    });
                }
            }
            await reloadData();
            await updateInterviewSubStageBasedOnStatus();
            toast({ title: "Success", description: interviewId ? "Interview rescheduled successfully." : "Interview scheduled successfully." });
            modals.setShowScheduleModal(false);
            modals.setSelectedInterviewForReschedule(null);
        } catch (error) {
            console.error("Failed to schedule interview:", error);
            toast({ title: "Error", description: "Failed to schedule interview.", variant: "destructive" });
        }
    }, [currentId, atsApplication, reloadData, updateInterviewSubStageBasedOnStatus, modals]);

    const handleMarkInterviewComplete = useCallback(async (interviewId: string) => {
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
    }, [currentId, reloadData, updateInterviewSubStageBasedOnStatus]);

    const handleCancelInterview = useCallback(async (interviewId: string) => {
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
    }, [currentId, reloadData, updateInterviewSubStageBasedOnStatus]);

    const handleSubmitFeedback = useCallback(async (interviewId: string, rating: number, feedback: string) => {
        if (!currentId) return;
        try {
            await atsService.updateInterview(interviewId, { rating, feedback });
            await reloadData();
            toast({ title: "Success", description: "Feedback submitted successfully." });
            modals.setShowFeedbackModal(false);
            modals.setSelectedInterviewForFeedback(null);
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            toast({ title: "Error", description: "Failed to submit feedback.", variant: "destructive" });
            throw error;
        }
    }, [currentId, reloadData, modals]);

    const handleAssignTask = useCallback(async (taskData: TaskFormData) => {
        if (!currentId) return;
        try {
            if (modals.selectedTaskForEdit?.id) {
                await atsService.updateTechnicalTask(modals.selectedTaskForEdit.id, taskData);
                toast({ title: "Success", description: "Technical task updated successfully." });
            } else {
                await atsService.assignTechnicalTask({ applicationId: currentId, ...taskData });
                if (atsApplication?.stage === ATSStage.TECHNICAL_TASK) {
                    await companyApi.moveApplicationStage(currentId, {
                        nextStage: ATSStage.TECHNICAL_TASK,
                        subStage: TechnicalTaskSubStage.ASSIGNED,
                        comment: `Technical task assigned`,
                    });
                }
                toast({ title: "Success", description: "Technical task assigned successfully." });
            }
            await reloadData();
            modals.setShowAssignTaskModal(false);
            modals.setSelectedTaskForEdit(null);
        } catch (error) {
            console.error("Failed to assign/update task:", error);
            toast({ title: "Error", description: "Failed to assign task.", variant: "destructive" });
        }
    }, [currentId, atsApplication, modals, reloadData]);

    const handleRevokeTaskClick = useCallback((taskId: string) => {
        modals.setTaskToRevoke(taskId);
        modals.setShowRevokeConfirmDialog(true);
    }, [modals]);

    const handleRevokeTask = useCallback(async () => {
        if (!currentId || !modals.taskToRevoke) return;
        try {
            await atsService.updateTechnicalTask(modals.taskToRevoke, { status: "cancelled" });
            toast({ title: "Success", description: "Task revoked successfully." });
            await reloadData();

            const tasksRes = await atsService.getTechnicalTasksByApplication(currentId);
            const activeTasks = (tasksRes.data || []).filter((t: ExtendedATSTechnicalTask) => t.status !== "completed");
            if (activeTasks.length === 0 && atsApplication?.stage === ATSStage.TECHNICAL_TASK) {
                await companyApi.moveApplicationStage(currentId, {
                    nextStage: ATSStage.TECHNICAL_TASK,
                    subStage: TechnicalTaskSubStage.NOT_ASSIGNED,
                    comment: "All active tasks revoked",
                });
                await reloadData();
            }
            modals.setShowRevokeConfirmDialog(false);
            modals.setTaskToRevoke(null);
        } catch (error) {
            console.error("Failed to revoke task:", error);
            toast({ title: "Error", description: "Failed to revoke task.", variant: "destructive" });
        }
    }, [currentId, modals, reloadData, atsApplication]);

    const handleInitiateCompensation = useCallback(async (data: CompensationFormData) => {
        if (!currentId) return;
        try {
            let compensationRes;
            if (compensationData) {
                compensationRes = await atsService.updateCompensation(currentId, {
                    candidateExpected: data.candidateExpected,
                    companyProposed: data.companyProposed,
                    benefits: data.benefits,
                    expectedJoining: data.expectedJoining,
                });
            } else {
                compensationRes = await atsService.initiateCompensation(currentId, {
                    candidateExpected: data.candidateExpected || "",
                    notes: data.notes,
                });
                if (data.companyProposed || (data.benefits && data.benefits.length > 0) || data.expectedJoining) {
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
                    comment: `Compensation discussion initiated`,
                });
            }

            setters.setCompensationData(compensationRes.data || compensationRes);

            if (data.notes) {
                await atsService.addComment({
                    applicationId: currentId,
                    comment: data.notes,
                    stage: ATSStage.COMPENSATION,
                });
                const commentsRes = await atsService.getCommentsByApplication(currentId);
                setters.setComments(commentsRes.data || []);
            }

            if (atsApplication) {
                setters.setAtsApplication({ ...atsApplication, subStage: CompensationSubStage.INITIATED });
            }

            toast({ title: "Success", description: "Compensation saved successfully." });
        } catch (error) {
            console.error("Failed to initiate/update compensation:", error);
            toast({ title: "Error", description: "Failed to save compensation.", variant: "destructive" });
        }
    }, [currentId, compensationData, atsApplication, setters]);

    const handleUpdateCompensation = useCallback(async (data: CompensationFormData) => {
        if (!currentId) return;
        try {
            const isSubsequentUpdate = compensationData?.companyProposed ||
                (compensationData?.updatedAt && compensationData?.createdAt && new Date(compensationData.updatedAt) > new Date(compensationData.createdAt));

            const updatedRes = await atsService.updateCompensation(currentId, data);
            setters.setCompensationData(updatedRes.data);

            if (isSubsequentUpdate && atsApplication?.subStage === CompensationSubStage.INITIATED) {
                await companyApi.moveApplicationStage(currentId, {
                    nextStage: ATSStage.COMPENSATION,
                    subStage: CompensationSubStage.NEGOTIATION_ONGOING,
                    comment: "Negotiation started",
                });
                if (atsApplication) setters.setAtsApplication({ ...atsApplication, subStage: CompensationSubStage.NEGOTIATION_ONGOING });
            }

            if (data.notes) {
                await atsService.addComment({ applicationId: currentId, comment: data.notes, stage: ATSStage.COMPENSATION });
                const commentsRes = await atsService.getCommentsByApplication(currentId);
                setters.setComments(commentsRes.data || []);
            }
            toast({ title: "Success", description: "Compensation updated successfully." });
        } catch (error) {
            console.error("Failed to update compensation:", error);
            toast({ title: "Error", description: "Failed to update compensation.", variant: "destructive" });
        }
    }, [currentId, compensationData, atsApplication, setters]);

    const handleScheduleCompensationMeeting = useCallback(async (data: CompensationMeetingFormData) => {
        if (!currentId) return;
        try {
            const meetingRes = await atsService.scheduleCompensationMeeting(currentId, {
                ...data,
                meetingLink: data.videoType === "external" ? data.meetingLink : undefined,
            });
            setters.setCompensationMeetings((prev) => [...(prev || []), meetingRes.data]);
            toast({ title: "Success", description: "Compensation meeting scheduled." });
        } catch (error) {
            console.error("Failed to schedule meeting:", error);
            toast({ title: "Error", description: "Failed to schedule meeting.", variant: "destructive" });
        }
    }, [currentId, setters]);

    const handleCreateOffer = useCallback(async (data: OfferFormData) => {
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
                comment: `Offer created and sent - ${data.offerAmount}`,
            });
            if (data.notes && data.notes.trim()) {
                await atsService.addComment({
                    applicationId: currentId,
                    comment: data.notes.trim(),
                    stage: ATSStage.OFFER,
                });
            }
            toast({ title: "Success", description: "Offer created and sent." });
            await reloadData();
        } catch (error) {
            console.error("Failed to create offer:", error);
            toast({ title: "Error", description: "Failed to create offer.", variant: "destructive" });
        }
    }, [currentId, reloadData]);

    const handleSendReminder = useCallback(async () => {
        if (!currentId) return;
        try {
            toast({ title: "Success", description: "Reminder sent to candidate." });
            await atsService.addComment({ applicationId: currentId, comment: "Reminder sent to candidate about pending offer", stage: ATSStage.OFFER });
            await reloadData();
        } catch (error) {
            console.error("Failed to send reminder:", error);
            toast({ title: "Error", description: "Failed to send reminder.", variant: "destructive" });
        }
    }, [currentId, reloadData]);

    const handleMarkAsHired = useCallback(async () => {
        if (!currentId) return;
        try {
            await companyApi.markApplicationAsHired(currentId);
            toast({ title: "Success", description: "Candidate marked as hired." });
            await reloadData();
        } catch (error) {
            console.error("Failed to mark as hired:", error);
            toast({ title: "Error", description: "Failed to mark as hired.", variant: "destructive" });
        }
    }, [currentId, reloadData]);

    const handleReviewTask = useCallback(async (taskId: string) => {
        if (!currentId) return;
        try {
            await atsService.updateTechnicalTask(taskId, { status: "under_review" });
            if (atsApplication?.stage === ATSStage.TECHNICAL_TASK && atsApplication.subStage !== TechnicalTaskSubStage.UNDER_REVIEW) {
                await companyApi.moveApplicationStage(currentId, {
                    nextStage: ATSStage.TECHNICAL_TASK,
                    subStage: TechnicalTaskSubStage.UNDER_REVIEW,
                    comment: "Task review started",
                });
            }
            await reloadData();
            const tasksRes = await atsService.getTechnicalTasksByApplication(currentId);
            const task = (tasksRes.data || []).find((t: ExtendedATSTechnicalTask) => t.id === taskId);
            if (task) {
                modals.setSelectedTaskForReview(task);
                modals.setShowFeedbackModal(true);
            }
        } catch (error) {
            console.error("Failed to start review:", error);
            toast({ title: "Error", description: "Failed to start review.", variant: "destructive" });
        }
    }, [currentId, atsApplication, reloadData, modals]);

    const handleSubmitTaskFeedback = useCallback(async (taskId: string, rating: number, feedback: string) => {
        if (!currentId) return;
        try {
            await atsService.updateTechnicalTask(taskId, { status: "completed", rating, feedback });
            toast({ title: "Success", description: "Feedback submitted successfully." });
            await reloadData();

            const updatedTasksRes = await atsService.getTechnicalTasksByApplication(currentId);
            const allTasksCompleted = (updatedTasksRes.data || []).length > 0 &&
                (updatedTasksRes.data || []).every((t: ExtendedATSTechnicalTask) => t.status === "completed");

            if (allTasksCompleted && atsApplication?.stage === ATSStage.TECHNICAL_TASK) {
                await companyApi.moveApplicationStage(currentId, {
                    nextStage: ATSStage.TECHNICAL_TASK,
                    subStage: TechnicalTaskSubStage.COMPLETED,
                    comment: "Task feedback added",
                });
                await reloadData();
            }

            modals.setShowFeedbackModal(false);
            modals.setSelectedTaskForReview(null);
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            toast({ title: "Error", description: "Failed to submit feedback.", variant: "destructive" });
            throw error;
        }
    }, [currentId, atsApplication, reloadData, modals]);

    const handleEditTask = useCallback((task: ExtendedATSTechnicalTask) => {
        modals.setSelectedTaskForEdit(task);
        modals.setShowAssignTaskModal(true);
    }, [modals]);

    return {
        handleUpdateStage,
        handleAddComment,
        handleMoveToStage,
        handleScheduleInterview,
        handleMarkInterviewComplete,
        handleCancelInterview,
        handleSubmitFeedback,
        handleAssignTask,
        handleEditTask,
        handleRevokeTaskClick,
        handleRevokeTask,
        handleInitiateCompensation,
        handleUpdateCompensation,
        handleScheduleCompensationMeeting,
        handleCreateOffer,
        handleSendReminder,
        handleMarkAsHired,
        handleReviewTask,
        handleSubmitTaskFeedback,
    };
};
