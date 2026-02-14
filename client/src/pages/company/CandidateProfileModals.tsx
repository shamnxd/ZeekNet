import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AddCommentModal } from "@/components/company/ats/AddCommentModal";
import { AssignTaskModal } from "@/components/company/ats/AssignTaskModal";
import { CompensationInitModal } from "@/components/company/ats/CompensationInitModal";
import { CompensationMeetingModal } from "@/components/company/ats/CompensationMeetingModal";
import { CompensationUpdateModal } from "@/components/company/ats/CompensationUpdateModal";
import { CreateOfferModal } from "@/components/company/ats/CreateOfferModal";
import { InterviewFeedbackModal } from "@/components/company/ats/InterviewFeedbackModal";
import { MoveToStageModal } from "@/components/company/ats/MoveToStageModal";
import { ScheduleInterviewModal } from "@/components/company/ats/ScheduleInterviewModal";
import type {
  ExtendedATSTechnicalTask,
  ExtendedATSOfferDocument,
  CompensationMeeting,
  CompensationData,
  InterviewFormData,
  TaskFormData,
  CompensationFormData,
  CompensationMeetingFormData,
  OfferFormData
} from "./CandidateProfileTypes";
import type { ATSInterview } from "@/types/ats";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { ATSStage } from "@/constants/ats-stages";
import { atsService } from "@/services/ats.service";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface CandidateProfileModalsProps {
  candidateName: string;
  currentId?: string;

  // ATS / job context
  atsApplication: CompanySideApplication | null;
  atsJob: JobPostingResponse | null;

  // Interviews / tasks
  showScheduleModal: boolean;
  setShowScheduleModal: (open: boolean) => void;
  selectedInterviewForReschedule: ATSInterview | null;
  selectedInterviewForFeedback: ATSInterview | null;
  setSelectedInterviewForFeedback: (value: ATSInterview | null) => void;
  showFeedbackModal: boolean;
  setShowFeedbackModal: (open: boolean) => void;
  showAssignTaskModal: boolean;
  setShowAssignTaskModal: (open: boolean) => void;
  selectedTaskForReview: ExtendedATSTechnicalTask | null;
  setSelectedTaskForReview: (value: ExtendedATSTechnicalTask | null) => void;
  selectedTaskForEdit: ExtendedATSTechnicalTask | null;
  setSelectedTaskForEdit: (value: ExtendedATSTechnicalTask | null) => void;

  // Stage / comments
  selectedStage: string;
  showCommentModal: boolean;
  setShowCommentModal: (open: boolean) => void;
  showMoveToStageModal: boolean;
  setShowMoveToStageModal: (open: boolean) => void;
  showRevokeConfirmDialog: boolean;
  setShowRevokeConfirmDialog: (open: boolean) => void;
  showRejectConfirmDialog: boolean;
  setShowRejectConfirmDialog: (open: boolean) => void;

  // Compensation
  showCompensationInitModal: boolean;
  setShowCompensationInitModal: (open: boolean) => void;
  showCompensationUpdateModal: boolean;
  setShowCompensationUpdateModal: (open: boolean) => void;
  showCompensationMeetingModal: boolean;
  setShowCompensationMeetingModal: (open: boolean) => void;
  selectedMeetingForEdit: CompensationMeeting | null;
  setSelectedMeetingForEdit: (value: CompensationMeeting | null) => void;
  compensationData: CompensationData | null;
  compensationNotes: Array<{ comment: string; note?: string; recruiterName?: string; createdAt: string; }>;
  compensationMeetings: CompensationMeeting[];

  // Offer
  showCreateOfferModal: boolean;
  setShowCreateOfferModal: (open: boolean) => void;
  showEditOfferModal: boolean;
  currentOffer: ExtendedATSOfferDocument | null;
  showWithdrawOfferModal: boolean;
  setShowWithdrawOfferModal: (open: boolean) => void;
  withdrawReason: string;
  setWithdrawReason: (value: string) => void;
  withdrawOtherNote: string;
  setWithdrawOtherNote: (value: string) => void;
  withdrawing: boolean;
  setWithdrawing: (value: boolean) => void;

  // Limit exceeded
  showLimitExceededDialog: boolean;
  setShowLimitExceededDialog: (open: boolean) => void;
  limitExceededData: { currentLimit: number; used: number } | null;

  // Handlers
  handleScheduleInterview: (data: InterviewFormData) => Promise<void>;
  handleSubmitFeedback: (id: string, rating: number, feedback: string) => Promise<void>;
  handleSubmitTaskFeedback: (id: string, rating: number, feedback: string) => Promise<void>;
  handleAssignTask: (data: TaskFormData) => Promise<void>;
  handleAddComment: (comment: string) => Promise<void>;
  handleMoveToStage: (stage: ATSStage, reason?: string) => Promise<void>;
  handleRevokeTask: () => Promise<void>;
  handleUpdateStage: (stage: string, subStage?: string) => Promise<void>;
  handleInitiateCompensation: (data: CompensationFormData) => Promise<void>;
  handleUpdateCompensation: (data: CompensationFormData) => Promise<void>;
  handleScheduleCompensationMeeting: (data: CompensationMeetingFormData) => Promise<void>;
  handleCreateOffer: (data: OfferFormData) => Promise<void>;
  reloadData: () => Promise<void>;
  isUpdating?: boolean;
}

export function CandidateProfileModals(props: CandidateProfileModalsProps) {
  const {
    candidateName,
    currentId,
    atsApplication,
    atsJob,
    showScheduleModal,
    setShowScheduleModal,
    selectedInterviewForReschedule,
    selectedInterviewForFeedback,
    setSelectedInterviewForFeedback,
    showFeedbackModal,
    setShowFeedbackModal,
    showAssignTaskModal,
    setShowAssignTaskModal,
    selectedTaskForReview,
    setSelectedTaskForReview,
    selectedTaskForEdit,
    setSelectedTaskForEdit,
    selectedStage,
    showCommentModal,
    setShowCommentModal,
    showMoveToStageModal,
    setShowMoveToStageModal,
    showRevokeConfirmDialog,
    setShowRevokeConfirmDialog,
    showRejectConfirmDialog,
    setShowRejectConfirmDialog,
    showCompensationInitModal,
    setShowCompensationInitModal,
    showCompensationUpdateModal,
    setShowCompensationUpdateModal,
    showCompensationMeetingModal,
    setShowCompensationMeetingModal,
    selectedMeetingForEdit,
    setSelectedMeetingForEdit,
    compensationData,
    compensationNotes,
    showCreateOfferModal,
    setShowCreateOfferModal,
    showEditOfferModal,
    currentOffer,
    showWithdrawOfferModal,
    setShowWithdrawOfferModal,
    withdrawReason,
    setWithdrawReason,
    withdrawOtherNote,
    setWithdrawOtherNote,
    withdrawing,
    setWithdrawing,
    showLimitExceededDialog,
    setShowLimitExceededDialog,
    limitExceededData,
    handleScheduleInterview,
    handleSubmitFeedback,
    handleSubmitTaskFeedback,
    handleAssignTask,
    handleAddComment,
    handleMoveToStage,
    handleRevokeTask,
    handleUpdateStage,
    handleInitiateCompensation,
    handleUpdateCompensation,
    handleScheduleCompensationMeeting,
    handleCreateOffer,
    reloadData,
    isUpdating = false,
  } = props;

  const navigate = useNavigate();

  return (
    <>
      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
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
            handleSubmitFeedback(selectedInterviewForFeedback.id, rating, feedback)
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
          isLoading={isUpdating}
          taskToEdit={
            selectedTaskForEdit
              ? {
                id: selectedTaskForEdit.id,
                title: selectedTaskForEdit.title,
                description: selectedTaskForEdit.description,
                deadline: selectedTaskForEdit.deadline
                  ? new Date(selectedTaskForEdit.deadline).toISOString().split("T")[0]
                  : "",
                documentUrl: selectedTaskForEdit.documentUrl || undefined,
                documentFilename: selectedTaskForEdit.documentFilename || undefined,
              }
              : undefined
          }
        />
      )}

      {/* Comment Modal */}
      <AddCommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        candidateName={candidateName}
        currentStage={(() => {
          const stage = atsApplication?.stage || selectedStage;
          if (stage === "APPLIED" || stage === "Applied") {
            return ATSStage.IN_REVIEW;
          }
          return (stage || ATSStage.IN_REVIEW) as ATSStage;
        })()}
        onAdd={handleAddComment}
        isLoading={isUpdating}
      />

      {/* Move To Stage Modal */}
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

      {/* Revoke Task Confirmation */}
      <ConfirmationDialog
        isOpen={showRevokeConfirmDialog}
        onClose={() => {
          setShowRevokeConfirmDialog(false);
        }}
        onConfirm={handleRevokeTask}
        title="Revoke Task"
        description="Are you sure you want to revoke this task? This action will mark the task as cancelled."
        confirmText="Revoke"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Reject Candidate Confirmation */}
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
                  ? compensationNotes[0].comment ||
                  compensationNotes[0].note ||
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
            ? compensationNotes[0].comment ||
            compensationNotes[0].note ||
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
                documentUrl: (currentOffer as ExtendedATSOfferDocument).documentUrl || "",
                documentFilename:
                  (currentOffer as ExtendedATSOfferDocument).documentFilename || "",
                offerAmount:
                  (currentOffer as ExtendedATSOfferDocument).offerAmount || "",
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
      <Dialog open={showWithdrawOfferModal} onOpenChange={setShowWithdrawOfferModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Withdraw Offer
            </DialogTitle>
            <DialogDescription className="pt-2">
              This action should only be used in exceptional cases. Once withdrawn, the
              offer cannot be reinstated.
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
                  Please provide a detailed explanation for withdrawing this offer.
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
                    description: "Please select a reason for withdrawing the offer.",
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
                    description:
                      (error as { response?: { data?: { message?: string } } })
                        ?.response?.data?.message || "Failed to withdraw offer.",
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
              You have reached your candidate view limit for your current subscription
              plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>Current Usage:</strong> {limitExceededData?.used || 0} /{" "}
                {limitExceededData?.currentLimit || 0} views
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Upgrade your plan to view more candidate profiles and unlock additional
                features.
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
                navigate("/company/billing");
              }}
              className="bg-[#4640DE] hover:bg-[#3730b8]"
            >
              Upgrade Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

