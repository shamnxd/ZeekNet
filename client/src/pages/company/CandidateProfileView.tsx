
import CompanyLayout from "@/components/layouts/CompanyLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScoreBadge } from "@/components/ui/score-badge";
import {
  Loader2,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
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
import { useCandidateProfile } from "@/hooks/use-candidate-profile";

import type {
  ExtendedATSOfferDocument,
  ExtendedATSTechnicalTask,
} from "@/types/ats-profile";

import {
  getInitials,
  getTimeAgo,
  formatDateTime,
} from "@/utils/formatters";

import { ATSStage } from "@/constants/ats-stages";
import { chatApi } from "@/api/chat.api";
import { toast } from "@/hooks/use-toast";
import { atsService } from "@/services/ats.service";


import { AppliedStage } from "@/components/company/ats/stages/AppliedStage";
import { InReviewStage } from "@/components/company/ats/stages/InReviewStage";
import { ShortlistedStage } from "@/components/company/ats/stages/ShortlistedStage";
import { InterviewStage } from "@/components/company/ats/stages/InterviewStage";
import { TechnicalTaskStage } from "@/components/company/ats/stages/TechnicalTaskStage";
import { CompensationStage } from "@/components/company/ats/stages/CompensationStage";
import { OfferStage } from "@/components/company/ats/stages/OfferStage";
import { ApplicantProfileDetails } from "@/components/company/ats/ApplicantProfileDetails";

const CandidateProfileView = () => {
  const {
    
    navigate, currentId, isATSMode,
    candidateData,
    atsApplication, setAtsApplication,
    atsJob,
    interviews,
    technicalTasks,
    offerDocuments,
    comments,
    loading,
    activeTab, setActiveTab,
    selectedStage, setSelectedStage,
    activities,
    activitiesHasMore,

    
    hiringStages, interviewSummary,
    isCurrentStage, hasNextStages, getNextStage,

    
    showScheduleModal, setShowScheduleModal,
    showCommentModal, setShowCommentModal,
    showMoveToStageModal, setShowMoveToStageModal,
    showFeedbackModal, setShowFeedbackModal,
    selectedInterviewForFeedback, setSelectedInterviewForFeedback,
    selectedInterviewForReschedule, setSelectedInterviewForReschedule,
    showAssignTaskModal, setShowAssignTaskModal,
    
    setSelectedTaskForReview,
    selectedTaskForEdit, setSelectedTaskForEdit,
    showRevokeConfirmDialog, setShowRevokeConfirmDialog,
    setTaskToRevoke,

    
    compensationData, setCompensationData,
    compensationNotes,
    compensationMeetings, setCompensationMeetings,
    showCompensationInitModal, setShowCompensationInitModal,
    showCompensationUpdateModal, setShowCompensationUpdateModal,
    showCompensationMeetingModal, setShowCompensationMeetingModal,
    selectedMeetingForEdit, setSelectedMeetingForEdit,

    
    currentOffer,
    showCreateOfferModal, setShowCreateOfferModal,
    showEditOfferModal,
    showWithdrawOfferModal, setShowWithdrawOfferModal,
    withdrawReason, setWithdrawReason,
    withdrawOtherNote, setWithdrawOtherNote,
    withdrawing, setWithdrawing,

    
    reloadData,
    handleUpdateStage, handleAddComment, handleMoveToStage,
    handleScheduleInterview, handleMarkInterviewComplete, handleCancelInterview, handleSubmitFeedback,
    handleAssignTask, handleRevokeTask,
    handleInitiateCompensation, handleUpdateCompensation, handleScheduleCompensationMeeting,
    handleCreateOffer, handleSendReminder, handleMarkAsHired,
    handleReviewTask
  } = useCandidateProfile();

  
  const handleEditTaskWrapper = (task: ExtendedATSTechnicalTask) => {
    setSelectedTaskForEdit(task);
    setShowAssignTaskModal(true);
  };

  const handleRevokeTaskClickWrapper = (taskId: string) => {
    
    
    
    setTaskToRevoke(taskId);
    setShowRevokeConfirmDialog(true);
  };

  
  const renderStageContent = () => {
    if (!selectedStage) return null;

    if (selectedStage === "Applied" || selectedStage === "APPLIED") {
      return (
        <AppliedStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          handleUpdateStage={handleUpdateStage}
          hasNextStages={hasNextStages}
          setShowMoveToStageModal={setShowMoveToStageModal}
        />
      );
    } else if (selectedStage === ATSStage.IN_REVIEW) {
      return (
        <InReviewStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          comments={comments}
          currentId={currentId}
          isCurrentStage={isCurrentStage}
          handleUpdateStage={handleUpdateStage}
          reloadData={reloadData}
          setShowCommentModal={setShowCommentModal}
          setShowMoveToStageModal={setShowMoveToStageModal}
          hasNextStages={hasNextStages}
        />
      );
    } else if (selectedStage === ATSStage.SHORTLISTED) {
      return (
        <ShortlistedStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          isCurrentStage={isCurrentStage}
          setShowScheduleModal={setShowScheduleModal}
          currentId={currentId}
          reloadData={reloadData}
          setShowCommentModal={setShowCommentModal}
          setShowMoveToStageModal={setShowMoveToStageModal}
          hasNextStages={hasNextStages}
          comments={comments}
        />
      );
    } else if (selectedStage === ATSStage.INTERVIEW) {
      return (
        <InterviewStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          isCurrentStage={isCurrentStage}
          interviews={interviews}
          interviewSummary={interviewSummary}
          setShowScheduleModal={setShowScheduleModal}
          setSelectedInterviewForReschedule={(interview) => {
            setSelectedInterviewForReschedule(interview);
            setShowScheduleModal(true);
          }}
          setSelectedInterviewForFeedback={setSelectedInterviewForFeedback}
          setShowFeedbackModal={setShowFeedbackModal}
          handleMarkInterviewComplete={handleMarkInterviewComplete}
          handleCancelInterview={handleCancelInterview}
          getNextStage={getNextStage}
          handleMoveToStage={handleMoveToStage}
          setShowCommentModal={setShowCommentModal}
          hasNextStages={hasNextStages}
          setShowMoveToStageModal={setShowMoveToStageModal}
          comments={comments}
        />
      );
    } else if (selectedStage === ATSStage.TECHNICAL_TASK) {
      return (
        <TechnicalTaskStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          isCurrentStage={isCurrentStage}
          technicalTasks={technicalTasks}
          setShowAssignTaskModal={setShowAssignTaskModal}
          setSelectedTaskForReview={setSelectedTaskForReview}
          handleReviewTask={handleReviewTask}
          setShowFeedbackModal={setShowFeedbackModal} 
          handleEditTask={handleEditTaskWrapper} 
          handleRevokeTaskClick={handleRevokeTaskClickWrapper} 
          handleMoveToStage={handleMoveToStage}
          getNextStage={getNextStage}
          hasNextStages={hasNextStages} 
          setShowMoveToStageModal={setShowMoveToStageModal} 
          comments={comments}
          setShowCommentModal={setShowCommentModal}
        />
      );
    } else if (selectedStage === ATSStage.COMPENSATION) {
      return (
        <CompensationStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          isCurrentStage={isCurrentStage}
          atsJob={atsJob}
          compensationData={compensationData}
          candidateData={candidateData}
          compensationNotes={compensationNotes}
          currentId={currentId}
          setShowCompensationInitModal={setShowCompensationInitModal}
          setShowCompensationUpdateModal={setShowCompensationUpdateModal}
          setAtsApplication={(app) => { if (setAtsApplication) setAtsApplication(app); }}
          setCompensationData={setCompensationData}
          setShowRevokeConfirmDialog={setShowRevokeConfirmDialog}
          getNextStage={getNextStage}
          handleMoveToStage={handleMoveToStage}
          compensationMeetings={compensationMeetings}
          setShowCompensationMeetingModal={setShowCompensationMeetingModal}
          setSelectedMeetingForEdit={setSelectedMeetingForEdit}
          setCompensationMeetings={setCompensationMeetings}
          setShowCommentModal={setShowCommentModal}
          comments={comments}
        />
      );
    } else if (selectedStage === ATSStage.OFFER) {
      return (
        <OfferStage
          atsApplication={atsApplication}
          selectedStage={selectedStage}
          isCurrentStage={isCurrentStage}
          currentOffer={currentOffer}
          offerDocuments={offerDocuments}
          atsJob={atsJob}
          setShowCreateOfferModal={setShowCreateOfferModal}
          handleSendReminder={handleSendReminder}
          handleMarkAsHired={handleMarkAsHired}
          setShowCommentModal={setShowCommentModal}
          comments={comments}
          setShowWithdrawOfferModal={setShowWithdrawOfferModal}
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
          {}
          <div className="lg:col-span-4">
            <Card className="border border-[#D6DDEB] rounded-lg shadow-sm">
              <CardContent className="p-5">
                {}
                <div className="flex items-start gap-4 mb-5">
                  <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                    {candidateAvatar ? (
                      <AvatarImage
                        src={candidateAvatar || undefined}
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
                        >
                          Message
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg border border-[#D6DDEB] shadow-sm min-h-[600px]">
              {}
              <div className="flex items-center border-b px-6">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "profile"
                    ? "border-[#4640DE] text-[#4640DE]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Applicant Profile
                </button>
                <button
                  onClick={() => setActiveTab("hiring")}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "hiring"
                    ? "border-[#4640DE] text-[#4640DE]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Hiring Progress
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === "activity"
                    ? "border-[#4640DE] text-[#4640DE]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                >
                  Activity
                </button>
              </div>

              <div className="p-6">
                {activeTab === "profile" && (
                  <ApplicantProfileDetails candidateData={candidateData} />
                )}
                {activeTab === "hiring" && (
                  <div className="space-y-6">
                    {}
                    <div className="relative">
                      <div className="overflow-x-auto pb-4 custom-scrollbar">
                        <div className="flex items-center justify-between min-w-[600px] mb-8 relative px-4">
                          {}
                          <div className="absolute left-0 top-4 w-full h-0.5 bg-gray-200 -z-10" />

                          {hiringStages.map((stageItem, index) => {
                            const isCompleted = index < hiringStages.findIndex((s) => s.key === selectedStage);
                            const isCurrent = stageItem.key === selectedStage;

                            return (
                              <button
                                key={stageItem.key}
                                onClick={() => { if (typeof setSelectedStage === 'function') setSelectedStage(stageItem.key) }}
                                className={`relative flex flex-col items-center group ${selectedStage === stageItem.key
                                  ? "cursor-pointer"
                                  : "cursor-pointer"
                                  }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 bg-white ${isCompleted
                                    ? "border-[#4640DE] bg-[#4640DE] text-white"
                                    : isCurrent
                                      ? "border-[#4640DE] ring-4 ring-[#4640DE]/10"
                                      : "border-gray-300 text-gray-400 group-hover:border-gray-400"
                                    }`}
                                >
                                  <div
                                    className={`w-2.5 h-2.5 rounded-full ${isCompleted
                                      ? "bg-white"
                                      : isCurrent
                                        ? "bg-[#4640DE]"
                                        : "bg-transparent"
                                      }`}
                                  />
                                </div>
                                <span
                                  className={`mt-2 text-xs font-medium whitespace-nowrap ${isCurrent
                                    ? "text-[#4640DE]"
                                    : isCompleted
                                      ? "text-gray-900"
                                      : "text-gray-500"
                                    }`}
                                >
                                  {stageItem.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {}
                    <div className="mt-8">
                      {renderStageContent()}
                    </div>
                  </div>
                )}

                {activeTab === "activity" && (
                  <StageBasedActivityView
                    activities={activities}

                    currentStage={selectedStage}
                    onLoadMore={async () => { }}
                    hasMore={activitiesHasMore}
                    formatDateTime={formatDateTime}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        candidateName={candidateName}
        onSchedule={handleScheduleInterview}
        interviewToReschedule={selectedInterviewForReschedule || undefined}
      />

      <AddCommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        candidateName={candidateName}
        currentStage={selectedStage as ATSStage}
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
                ? ATSStage.IN_REVIEW
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
        description="Are you sure you want to revoke this task?"
        confirmText="Revoke"
        cancelText="Cancel"
        variant="danger"
      />

      <CompensationInitModal
        isOpen={showCompensationInitModal}
        onClose={() => setShowCompensationInitModal(false)}
        candidateName={candidateName}
        onInitiate={handleInitiateCompensation}
        existingData={compensationData ? {
          candidateExpected: compensationData.candidateExpected,
          companyProposed: compensationData.companyProposed,
          benefits: compensationData.benefits,
          expectedJoining: compensationData.expectedJoining,
          notes: compensationNotes.length > 0 ? compensationNotes[0]?.comment : undefined
        } : undefined}
      />

      <CompensationUpdateModal
        isOpen={showCompensationUpdateModal}
        onClose={() => setShowCompensationUpdateModal(false)}
        candidateName={candidateName}
        currentProposal={compensationData?.companyProposed}
        candidateExpected={compensationData?.candidateExpected}
        existingBenefits={compensationData?.benefits}
        existingExpectedJoining={compensationData?.expectedJoining}
        existingNotes={compensationNotes.length > 0 ? compensationNotes[0]?.comment : undefined}
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

      <InterviewFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        interviewTitle={selectedInterviewForFeedback?.title || "Interview"}
        onSubmit={(rating: number, feedback: string) => {
          if (selectedInterviewForFeedback?.id) {
            return handleSubmitFeedback(selectedInterviewForFeedback.id, rating, feedback);
          }
          return Promise.resolve();
        }}
      />

      <AssignTaskModal
        isOpen={showAssignTaskModal}
        onClose={() => setShowAssignTaskModal(false)}
        candidateName={candidateName}
        onAssign={handleAssignTask}
        taskToEdit={selectedTaskForEdit || undefined}
      />

      {}
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
                  
                  return;
                }
                if (withdrawReason === "other" && !withdrawOtherNote.trim()) {
                  
                  return;
                }

                if (!currentId || !currentOffer?.id) return;

                try {
                  setWithdrawing(true);

                  
                  const reasonText =
                    withdrawReason === "other"
                      ? withdrawOtherNote
                      : withdrawReason
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase());

                  
                  await atsService.updateOfferStatus(currentOffer.id, {
                    status: "declined",
                    withdrawalReason: reasonText,
                  });

                  
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
                    description: "Failed to withdraw offer",
                    variant: "destructive"
                  });
                } finally {
                  setWithdrawing(false);
                }
              }}
              disabled={withdrawing}
            >
              {withdrawing ? "Withdrawing..." : "Confirm Withdraw"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CompanyLayout>
  );
};

export default CandidateProfileView;
