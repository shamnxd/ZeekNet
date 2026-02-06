import { useState } from "react";
import type { ATSInterview } from "@/types/ats";
import type { ExtendedATSTechnicalTask, CompensationMeeting } from "../CandidateProfileTypes";

export const useCandidateModals = () => {
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
    const [showRejectConfirmDialog, setShowRejectConfirmDialog] = useState(false);
    const [taskToRevoke, setTaskToRevoke] = useState<string | null>(null);

    // Compensation Modals
    const [showCompensationInitModal, setShowCompensationInitModal] = useState(false);
    const [showCompensationUpdateModal, setShowCompensationUpdateModal] = useState(false);
    const [showCompensationMeetingModal, setShowCompensationMeetingModal] = useState(false);
    const [selectedMeetingForEdit, setSelectedMeetingForEdit] =
        useState<CompensationMeeting | null>(null);

    // Offer Modals
    const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
    const [showEditOfferModal, setShowEditOfferModal] = useState(false);
    const [showWithdrawOfferModal, setShowWithdrawOfferModal] = useState(false);
    const [withdrawReason, setWithdrawReason] = useState<string>("");
    const [withdrawOtherNote, setWithdrawOtherNote] = useState<string>("");
    const [withdrawing, setWithdrawing] = useState(false);

    return {
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
        showRejectConfirmDialog, setShowRejectConfirmDialog,
        taskToRevoke, setTaskToRevoke,

        showCompensationInitModal, setShowCompensationInitModal,
        showCompensationUpdateModal, setShowCompensationUpdateModal,
        showCompensationMeetingModal, setShowCompensationMeetingModal,
        selectedMeetingForEdit, setSelectedMeetingForEdit,

        showCreateOfferModal, setShowCreateOfferModal,
        showEditOfferModal, setShowEditOfferModal,
        showWithdrawOfferModal, setShowWithdrawOfferModal,
        withdrawReason, setWithdrawReason,
        withdrawOtherNote, setWithdrawOtherNote,
        withdrawing, setWithdrawing
    };
};
