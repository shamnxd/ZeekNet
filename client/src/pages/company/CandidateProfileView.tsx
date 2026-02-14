import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CompanyLayout from "@/components/layouts/CompanyLayout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ChevronRight, CheckCircle2, X } from "lucide-react";
import { companyApi } from "@/api/company.api";
import { chatApi } from "@/api/chat.api";
import { atsService } from "@/services/ats.service";

import CandidateProfileSidebar from "./CandidateProfileSidebar";
import CandidateProfileTabs from "./CandidateProfileTabs";
import { LimitExceededDialog } from "@/components/company/dialogs/LimitExceededDialog";
import { CandidateProfileModals } from "./CandidateProfileModals";
import { CandidateInReviewStage } from "./CandidateInReviewStage";

import { CandidateShortlistedStage } from "./CandidateShortlistedStage";
import { CandidateInterviewStage } from "./CandidateInterviewStage";
import { CandidateTechnicalTaskStage } from "./CandidateTechnicalTaskStage";
import { CandidateCompensationStage } from "./CandidateCompensationStage";
import { CandidateOfferStage } from "./CandidateOfferStage";

import { ATSStage, CompensationSubStage } from "@/constants/ats-stages";

import { useCandidateData } from "./hooks/useCandidateData";
import { useCandidateModals } from "./hooks/useCandidateModals";
import { useHiringStages } from "./hooks/useHiringStages";
import { useCandidateActions } from "./hooks/useCandidateActions";

const CandidateProfileView = () => {
  const { id, candidateId } = useParams<{
    id?: string;
    candidateId?: string;
  }>();
  const navigate = useNavigate();
  const location = useLocation();

  const isATSMode =
    location.pathname.includes("/ats/candidate/") ||
    location.pathname.includes("/company/applicants/");
  const currentId = candidateId || id;

  const [activeTab, setActiveTab] = useState<"profile" | "resume" | "hiring">("profile");
  const [selectedStage, setSelectedStage] = useState<string>("");

  const dataState = useCandidateData(currentId, isATSMode);
  const {
    candidateData, atsApplication, atsJob, interviews, technicalTasks,
    offerDocuments, comments, loading, compensationData,
    compensationMeetings, currentOffer, showLimitExceededDialog, limitExceededData,
    reloadData, setAtsApplication, setCompensationData, setComments, setCompensationMeetings,
    setShowLimitExceededDialog
  } = dataState;

  const modalsState = useCandidateModals();
  const {
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
    showCompensationInitModal, setShowCompensationInitModal,
    showCompensationUpdateModal, setShowCompensationUpdateModal,
    showCompensationMeetingModal, setShowCompensationMeetingModal,
    selectedMeetingForEdit, setSelectedMeetingForEdit,
    showCreateOfferModal, setShowCreateOfferModal,
    showEditOfferModal,
    showWithdrawOfferModal, setShowWithdrawOfferModal,
    withdrawReason, setWithdrawReason,
    withdrawOtherNote, setWithdrawOtherNote,
    withdrawing, setWithdrawing
  } = modalsState;

  const stagesState = useHiringStages(atsApplication, atsJob);
  const { hiringStages, isCurrentStage, hasNextStages, getNextStage } = stagesState;

  const actions = useCandidateActions({
    currentId,
    atsApplication,
    compensationData,
    reloadData,
    selectedStage,
    modals: modalsState,
    setters: {
      setAtsApplication,
      setCompensationData,
      setComments,
      setCompensationMeetings
    }
  });

  useEffect(() => {
    if (activeTab === "hiring") {
      if (atsApplication?.stage) {
        setSelectedStage(atsApplication.stage);
      }
    }
  }, [activeTab, atsApplication?.stage]);

  const handleOpenChat = async (candidateIdVal?: string) => {
    const targetId = candidateIdVal ||
      (isATSMode ? atsApplication?.seeker_id : candidateData?.user._id);

    if (!targetId) return;

    try {
      const res = await chatApi.createConversation({ participantId: targetId });
      if (res?.id) {
        navigate(`/company/messages?conversation=${res.id}`);
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

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

  const renderStageContent = () => {
    if (!selectedStage) return null;

    if (selectedStage === "Applied" || selectedStage === "APPLIED") {
      const actualStage = atsApplication?.stage;
      const isViewingApplied = selectedStage === "APPLIED" || selectedStage === "Applied";
      const isInAppliedStage = actualStage === "applied" || !actualStage;
      const showActions = isViewingApplied && isInAppliedStage;

      return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Received</h3>
            <p className="text-sm text-gray-600">
              Applied on {atsApplication?.applied_date ? formatDateTime(atsApplication.applied_date) : "Recently"}
            </p>
          </div>
          {showActions && (
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                className="gap-2 bg-[#4640DE] hover:bg-[#3730A3]"
                onClick={() => actions.handleUpdateStage(ATSStage.IN_REVIEW)}
              >
                <ChevronRight className="h-4 w-4" />
                Move to In Review
              </Button>
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
    } else if (selectedStage === ATSStage.IN_REVIEW) {
      return (
        <CandidateInReviewStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          comments={comments}
          onMoveToStage={actions.handleMoveToStage}
          onUpdateStage={actions.handleUpdateStage}
          onSetShowCommentModal={setShowCommentModal}
          onSetShowMoveToStageModal={setShowMoveToStageModal}
          onSetShowRejectConfirmDialog={setShowRejectConfirmDialog}
          getNextStage={getNextStage}
          isUpdating={actions.isUpdating}
        />
      );
    } else if (selectedStage === ATSStage.SHORTLISTED) {
      return (
        <CandidateShortlistedStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          comments={comments}
          onSetShowCommentModal={setShowCommentModal}
          onSetShowMoveToStageModal={setShowMoveToStageModal}
          onSetShowScheduleModal={setShowScheduleModal}
          onSetShowRejectConfirmDialog={setShowRejectConfirmDialog}
          onMoveToStage={actions.handleMoveToStage}
          onUpdateStage={actions.handleUpdateStage}
          getNextStage={getNextStage}
          isUpdating={actions.isUpdating}
        />
      );
    } else if (selectedStage === ATSStage.INTERVIEW) {
      return (
        <CandidateInterviewStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          interviews={interviews}
          comments={comments}
          onSetShowScheduleModal={setShowScheduleModal}
          onSetShowCommentModal={setShowCommentModal}
          onSetSelectedInterviewForReschedule={setSelectedInterviewForReschedule}
          onSetSelectedInterviewForFeedback={setSelectedInterviewForFeedback}
          onSetShowFeedbackModal={setShowFeedbackModal}
          onSetShowMoveToStageModal={setShowMoveToStageModal}
          onMarkInterviewComplete={actions.handleMarkInterviewComplete}
          onCancelInterview={actions.handleCancelInterview}
          onMoveToStage={actions.handleMoveToStage}
          formatDateTime={formatDateTime}
          isCurrentStage={isCurrentStage}
          getNextStage={getNextStage}
          isUpdating={actions.isUpdating}
        />
      );
    } else if (selectedStage === ATSStage.TECHNICAL_TASK) {
      return (
        <CandidateTechnicalTaskStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          technicalTasks={technicalTasks}
          comments={comments}
          onSetShowAssignTaskModal={setShowAssignTaskModal}
          onSetShowCommentModal={setShowCommentModal}
          onSetSelectedTaskForEdit={actions.handleEditTask}
          onSetSelectedTaskForReview={setSelectedTaskForReview}
          onSetShowFeedbackModal={setShowFeedbackModal}
          onSetShowMoveToStageModal={setShowMoveToStageModal}
          onRevokeTask={actions.handleRevokeTaskClick}
          onReviewTask={actions.handleReviewTask}
          onMoveToStage={actions.handleMoveToStage}
          formatDateTime={formatDateTime}
          isCurrentStage={isCurrentStage}
          getNextStage={getNextStage}
          isUpdating={actions.isUpdating}
        />
      );
    } else if (selectedStage === ATSStage.COMPENSATION) {
      return (
        <CandidateCompensationStage
          atsApplication={atsApplication}
          candidateData={candidateData}
          selectedStage={selectedStage}
          compensationData={compensationData}
          compensationMeetings={compensationMeetings}
          comments={comments}
          onSetShowCommentModal={setShowCommentModal}
          onSetShowCompensationInitModal={setShowCompensationInitModal}
          onSetShowCompensationUpdateModal={setShowCompensationUpdateModal}
          onSetShowCompensationMeetingModal={setShowCompensationMeetingModal}
          onSetSelectedMeetingForEdit={setSelectedMeetingForEdit}
          onSetShowRejectConfirmDialog={setShowRejectConfirmDialog}
          onApproveCompensation={async () => {
            if (!currentId) return;
            await companyApi.moveApplicationStage(currentId, {
              nextStage: ATSStage.COMPENSATION,
              subStage: CompensationSubStage.APPROVED,
            });
            reloadData();
          }}
          onMarkMeetingCompleted={async (id) => {
            if (!currentId) return;
            await atsService.updateCompensationMeetingStatus(currentId, id, "completed");
            reloadData();
          }}
          onCancelMeeting={async (id) => {
            if (!currentId) return;
            await atsService.updateCompensationMeetingStatus(currentId, id, "cancelled");
            reloadData();
          }}
          onMoveToStage={actions.handleMoveToStage}
          onSetShowMoveToStageModal={setShowMoveToStageModal}
          onOpenChat={() => handleOpenChat()}
          formatDateTime={formatDateTime}
          isCurrentStage={isCurrentStage}
          getNextStage={getNextStage}
          isUpdating={actions.isUpdating}
        />
      );
    } else if (selectedStage === ATSStage.OFFER) {
      return (
        <CandidateOfferStage
          atsJob={atsJob}
          selectedStage={selectedStage}
          currentOffer={currentOffer}
          offerDocuments={offerDocuments}
          comments={comments}
          onSetShowCreateOfferModal={setShowCreateOfferModal}
          onSetShowCommentModal={setShowCommentModal}
          onSetShowWithdrawOfferModal={setShowWithdrawOfferModal}
          onSetShowRejectConfirmDialog={setShowRejectConfirmDialog}
          onMarkAsHired={actions.handleMarkAsHired}
          formatDateTime={formatDateTime}
          isCurrentStage={isCurrentStage}

          isUpdating={actions.isUpdating}
        />
      );
    } else if (selectedStage === ATSStage.HIRED) {
      return (
        <div className="bg-emerald-50 rounded-lg p-8 text-center border border-emerald-100">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-full mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-emerald-900 mb-1">Candidate Hired</h3>
          <p className="text-emerald-700 max-w-sm mx-auto text-sm">
            This candidate has successfully completed the hiring process and has been marked as hired.
          </p>
        </div>
      );
    } else if (selectedStage === ATSStage.REJECTED) {
      return (
        <div className="bg-red-50 rounded-lg p-8 text-center border border-red-100">
          <div className="inline-flex items-center justify-center p-3 bg-red-100 rounded-full mb-4">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-red-900 mb-1">Candidate Rejected</h3>
          <p className="text-red-700 max-w-sm mx-auto text-sm mb-4">
            This candidate has been rejected for this position.
          </p>
          {(atsApplication?.withdrawalReason || atsApplication?.rejection_reason) && (
            <div className="mt-2 p-3 bg-white rounded-lg border border-red-200 inline-block text-left shadow-sm">
              <p className="text-[10px] font-bold text-red-800 uppercase tracking-wider mb-1">Rejection Reason:</p>
              <p className="text-xs text-red-700">{atsApplication?.withdrawalReason || atsApplication?.rejection_reason}</p>
            </div>
          )}
        </div>
      );
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

  if (isATSMode && (!atsApplication || atsApplication.is_blocked)) {
    if (showLimitExceededDialog) {
      return (
        <CompanyLayout>
          <div className="flex justify-center items-center h-[60vh]">
            <LimitExceededDialog
              open={true}
              onOpenChange={(open) => {
                setShowLimitExceededDialog(open);
                if (!open) navigate("/company/ats");
              }}
              limitExceededData={limitExceededData}
              title="Candidate View Limit Exceeded"
              description="You have reached your candidate view limit for your current subscription plan. Upgrade to view more candidates."
            />
          </div>
        </CompanyLayout>
      );
    }
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
    if (showLimitExceededDialog) {
      return (
        <CompanyLayout>
          <div className="flex justify-center items-center h-[60vh]">
            <LimitExceededDialog
              open={true}
              onOpenChange={(open) => {
                setShowLimitExceededDialog(open);
                if (!open) navigate("/company/candidates");
              }}
              limitExceededData={limitExceededData}
              title="Candidate View Limit Exceeded"
              description="You have reached your candidate view limit for your current subscription plan. Upgrade to view more candidates."
            />
          </div>
        </CompanyLayout>
      );
    }
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
    ? atsApplication?.seeker_name || atsApplication?.name || atsApplication?.full_name || "Candidate"
    : candidateData?.user.name || "Candidate";
  const candidateRole = isATSMode
    ? atsApplication?.job_title || atsJob?.title || "Applicant"
    : candidateData?.profile.headline;
  const candidateEmail = isATSMode
    ? atsApplication?.email
    : candidateData?.user.email;
  const candidatePhone = isATSMode
    ? atsApplication?.phone || candidateData?.profile?.phone || "-"
    : candidateData?.profile.phone;
  const candidateAvatar = isATSMode
    ? atsApplication?.seeker_avatar
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
          <div className="lg:col-span-4">
            <CandidateProfileSidebar
              isATSMode={isATSMode}
              candidateName={candidateName}
              candidateRole={candidateRole}
              candidateAvatar={candidateAvatar}
              candidateEmail={candidateEmail}
              candidatePhone={candidatePhone}
              candidateData={candidateData}
              atsApplication={atsApplication}
              atsJob={atsJob}
              candidateScore={candidateScore}
              onScheduleInterview={() => setShowScheduleModal(true)}
              onOpenChat={() => handleOpenChat()}
              onReject={() => setShowRejectConfirmDialog(true)}
            />
          </div>

          <div className="lg:col-span-8">
            <CandidateProfileTabs
              isATSMode={isATSMode}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              hiringStages={hiringStages}
              selectedStage={selectedStage}
              onSelectStage={setSelectedStage}
              renderStageContent={renderStageContent}
              candidateData={candidateData}
              candidateName={candidateName}
              candidateRole={candidateRole}
              candidateAvatar={candidateAvatar}
              candidateEmail={candidateEmail}
              candidatePhone={candidatePhone}
              atsApplication={atsApplication}
            />
          </div>
        </div>
      </div>

      <CandidateProfileModals
        candidateName={candidateName}
        currentId={currentId}
        atsApplication={atsApplication}
        atsJob={atsJob}
        showScheduleModal={showScheduleModal}
        setShowScheduleModal={setShowScheduleModal}
        selectedInterviewForReschedule={selectedInterviewForReschedule}
        selectedInterviewForFeedback={selectedInterviewForFeedback}
        setSelectedInterviewForFeedback={setSelectedInterviewForFeedback}
        showFeedbackModal={showFeedbackModal}
        setShowFeedbackModal={setShowFeedbackModal}
        showAssignTaskModal={showAssignTaskModal}
        setShowAssignTaskModal={setShowAssignTaskModal}
        selectedTaskForReview={selectedTaskForReview}
        setSelectedTaskForReview={setSelectedTaskForReview}
        selectedTaskForEdit={selectedTaskForEdit}
        setSelectedTaskForEdit={setSelectedTaskForEdit}
        selectedStage={selectedStage}
        showCommentModal={showCommentModal}
        setShowCommentModal={setShowCommentModal}
        showMoveToStageModal={showMoveToStageModal}
        setShowMoveToStageModal={setShowMoveToStageModal}
        showRevokeConfirmDialog={showRevokeConfirmDialog}
        setShowRevokeConfirmDialog={setShowRevokeConfirmDialog}
        showRejectConfirmDialog={showRejectConfirmDialog}
        setShowRejectConfirmDialog={setShowRejectConfirmDialog}
        showCompensationInitModal={showCompensationInitModal}
        setShowCompensationInitModal={setShowCompensationInitModal}
        showCompensationUpdateModal={showCompensationUpdateModal}
        setShowCompensationUpdateModal={setShowCompensationUpdateModal}
        showCompensationMeetingModal={showCompensationMeetingModal}
        setShowCompensationMeetingModal={setShowCompensationMeetingModal}
        selectedMeetingForEdit={selectedMeetingForEdit}
        setSelectedMeetingForEdit={setSelectedMeetingForEdit}

        compensationData={compensationData}
        compensationMeetings={compensationMeetings}

        showCreateOfferModal={showCreateOfferModal}
        setShowCreateOfferModal={setShowCreateOfferModal}
        showEditOfferModal={showEditOfferModal}
        showWithdrawOfferModal={showWithdrawOfferModal}
        setShowWithdrawOfferModal={setShowWithdrawOfferModal}
        withdrawReason={withdrawReason}
        setWithdrawReason={setWithdrawReason}
        withdrawOtherNote={withdrawOtherNote}
        setWithdrawOtherNote={setWithdrawOtherNote}
        withdrawing={withdrawing}
        setWithdrawing={setWithdrawing}
        currentOffer={currentOffer}

        showLimitExceededDialog={showLimitExceededDialog}
        setShowLimitExceededDialog={setShowLimitExceededDialog}
        limitExceededData={limitExceededData}

        handleScheduleInterview={actions.handleScheduleInterview}
        handleSubmitFeedback={actions.handleSubmitFeedback}
        handleSubmitTaskFeedback={actions.handleSubmitTaskFeedback}
        handleAssignTask={actions.handleAssignTask}
        handleAddComment={actions.handleAddComment}
        handleMoveToStage={actions.handleMoveToStage}
        handleRevokeTask={actions.handleRevokeTask}
        handleUpdateStage={actions.handleUpdateStage}
        handleInitiateCompensation={actions.handleInitiateCompensation}
        handleUpdateCompensation={actions.handleUpdateCompensation}
        handleScheduleCompensationMeeting={actions.handleScheduleCompensationMeeting}
        handleCreateOffer={actions.handleCreateOffer}
        reloadData={reloadData}
        isUpdating={actions.isUpdating}
      />
    </CompanyLayout>
  );
};

export default CandidateProfileView;
