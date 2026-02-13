import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import CompanyLayout from "@/components/layouts/CompanyLayout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { companyApi } from "@/api/company.api";
import { chatApi } from "@/api/chat.api";
import { atsService } from "@/services/ats.service";

// Components
import CandidateProfileSidebar from "./CandidateProfileSidebar";
import CandidateProfileTabs from "./CandidateProfileTabs";
import { CandidateProfileModals } from "./CandidateProfileModals";

// Stage Components
import { CandidateInReviewStage } from "./CandidateInReviewStage";
import { CandidateShortlistedStage } from "./CandidateShortlistedStage";
import { CandidateInterviewStage } from "./CandidateInterviewStage";
import { CandidateTechnicalTaskStage } from "./CandidateTechnicalTaskStage";
import { CandidateCompensationStage } from "./CandidateCompensationStage";
import { CandidateOfferStage } from "./CandidateOfferStage";

// Constants & Types
import { ATSStage, CompensationSubStage } from "@/constants/ats-stages";

// Hooks
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

  // Use Custom Hooks
  const dataState = useCandidateData(currentId, isATSMode);
  const {
    candidateData, atsApplication, atsJob, interviews, technicalTasks,
    offerDocuments, comments, loading, compensationData, compensationNotes,
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
    showEditOfferModal, // Removed unused setShowEditOfferModal
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

  // Effect to sync selectedStage with active application stage when tab is 'hiring'
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

  // Render content
  const renderStageContent = () => {
    if (!selectedStage) return null;

    if (selectedStage === "Applied" || selectedStage === "APPLIED") {
      // Simple Render Logic for Applied Stage
      const actualStage = atsApplication?.stage;
      const isViewingApplied = selectedStage === "APPLIED" || selectedStage === "Applied";
      const isInAppliedStage = actualStage === "APPLIED" || !actualStage;
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
                onClick={() => actions.handleUpdateStage(ATSStage.IN_REVIEW, "PROFILE_REVIEW")}
              >
                <ChevronRight className="h-4 w-4" />
                Move to In Review
              </Button>
              {/* Move to Another Stage button */}
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
          atsJob={atsJob}
          selectedStage={selectedStage}
          comments={comments}
          currentId={currentId}
          onReload={reloadData}
          onSetShowCommentModal={setShowCommentModal}
          onSetShowMoveToStageModal={setShowMoveToStageModal}
          onSetShowRejectConfirmDialog={setShowRejectConfirmDialog}
          onUpdateStage={actions.handleUpdateStage}
        />
      );
    } else if (selectedStage === ATSStage.SHORTLISTED) {
      return (
        <CandidateShortlistedStage
          atsApplication={atsApplication}
          atsJob={atsJob}
          selectedStage={selectedStage}
          comments={comments}
          currentId={currentId}
          onReload={reloadData}
          onSetShowCommentModal={setShowCommentModal}
          onSetShowMoveToStageModal={setShowMoveToStageModal}
          onSetShowScheduleModal={setShowScheduleModal}
        />
      );
    } else if (selectedStage === ATSStage.INTERVIEW) {
      return (
        <CandidateInterviewStage
          atsApplication={atsApplication}
          atsJob={atsJob}
          selectedStage={selectedStage}
          currentId={currentId}
          interviews={interviews}
          comments={comments}
          onReload={reloadData}
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
          hasNextStages={hasNextStages}
        />
      );
    } else if (selectedStage === ATSStage.TECHNICAL_TASK) {
      return (
        <CandidateTechnicalTaskStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          currentId={currentId}
          technicalTasks={technicalTasks}
          comments={comments}
          onSetShowAssignTaskModal={setShowAssignTaskModal}
          onSetShowCommentModal={setShowCommentModal}
          onSetSelectedTaskForEdit={actions.handleEditTask}
          onSetSelectedTaskForReview={setSelectedTaskForReview}
          onSetShowFeedbackModal={setShowFeedbackModal}
          onSetShowMoveToStageModal={setShowMoveToStageModal}
          onSetShowRejectConfirmDialog={setShowRejectConfirmDialog}
          onRevokeTask={actions.handleRevokeTaskClick}
          onReviewTask={actions.handleReviewTask}
          onMoveToStage={actions.handleMoveToStage}
          formatDateTime={formatDateTime}
          isCurrentStage={isCurrentStage}
          getNextStage={getNextStage}
          hasNextStages={hasNextStages}
        />
      );
    } else if (selectedStage === ATSStage.COMPENSATION) {
      return (
        <CandidateCompensationStage
          atsApplication={atsApplication}
          atsJob={atsJob}
          candidateData={candidateData}
          selectedStage={selectedStage}
          currentId={currentId}
          compensationData={compensationData}
          compensationMeetings={compensationMeetings}
          onSetShowCompensationInitModal={setShowCompensationInitModal}
          onSetShowCompensationUpdateModal={setShowCompensationUpdateModal}
          onSetShowCompensationMeetingModal={setShowCompensationMeetingModal}
          onSetSelectedMeetingForEdit={setSelectedMeetingForEdit}
          onSetShowRejectConfirmDialog={setShowRejectConfirmDialog}
          onApproveCompensation={async () => {
            // Basic approval logic if simple enough or move to actions
            // The original code passed `onApproveCompensation`.
            // I missed `handleApproveCompensation` in actions? 
            // Let's stick with basic impl if missing or check actions.
            // Actually, `handleApproveCompensation` was NOT in my actions list above?
            // Checking... I missed it! 
            // Logic: Update stage to APPROVED.
            if (!currentId) return;
            await companyApi.moveApplicationStage(currentId, {
              nextStage: ATSStage.COMPENSATION,
              subStage: CompensationSubStage.APPROVED,
              comment: "Compensation Approved"
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
          onOpenChat={() => handleOpenChat()}
          formatDateTime={formatDateTime}
          isCurrentStage={isCurrentStage}
          getNextStage={getNextStage}
        />
      );
    } else if (selectedStage === ATSStage.OFFER) {
      return (
        <CandidateOfferStage
          atsApplication={atsApplication}
          atsJob={atsJob}
          selectedStage={selectedStage}
          currentOffer={currentOffer}
          offerDocuments={offerDocuments}
          comments={comments}
          onSetShowCreateOfferModal={setShowCreateOfferModal}
          onSetShowCommentModal={setShowCommentModal}
          onSetShowWithdrawOfferModal={setShowWithdrawOfferModal}
          onSendReminder={actions.handleSendReminder}
          onMarkAsHired={actions.handleMarkAsHired}
          formatDateTime={formatDateTime}
          isCurrentStage={isCurrentStage}

        />
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
    ? atsApplication?.seeker_name || atsApplication?.name || atsApplication?.full_name || atsApplication?.seeker?.name || "Candidate"
    : candidateData?.user.name || "Candidate";
  const candidateRole = isATSMode
    ? atsApplication?.job?.title || atsApplication?.job?.job_title || atsJob?.title || "Applicant"
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
        // ... pass all modal props ...
        // Using spread for brevity in logic but explicit props for Component
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
        compensationNotes={compensationNotes}
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
      />
    </CompanyLayout>
  );
};

export default CandidateProfileView;
