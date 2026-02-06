
import type { CompensationStageProps } from "./compensation/compensation-stage.types";
import { useCompensationStage } from "@/hooks/use-compensation-stage";
import { CompensationHeader } from "./compensation/CompensationHeader";
import { CompensationSummary } from "./compensation/CompensationSummary";
import { CompensationDetails } from "./compensation/CompensationDetails";
import { CompensationMeetingList } from "./compensation/CompensationMeetingList";
import { CompensationNotes } from "./compensation/CompensationNotes";


export const CompensationStage = (props: CompensationStageProps) => {
    const {
        atsApplication,
        selectedStage,
        isCurrentStage,
        compensationData,
        candidateData,
        setShowCompensationInitModal,
        setShowCompensationUpdateModal,
        setShowRevokeConfirmDialog,
        comments,
        setShowCommentModal,
        compensationMeetings,
        setShowCompensationMeetingModal,
        setSelectedMeetingForEdit,
        getNextStage,
        handleMoveToStage,
    } = props;

    const {
        currentSubStage,
        currentSubStageDisplayName,
        jobSalaryRange,
        canApprove,
        handleChat,
        handleApproveCompensation,
        handleCompleteMeeting,
        handleCancelMeeting,
        handleEmail,
        handleCall,
    } = useCompensationStage(props);

    const showActions = isCurrentStage(selectedStage);
    const candidateEmail = candidateData?.user?.email || atsApplication?.email || "";
    const candidatePhone = candidateData?.profile?.phone || atsApplication?.phone || "";

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
            <CompensationHeader
                atsApplication={atsApplication}
                selectedStage={selectedStage}
                isCurrentStage={isCurrentStage}
                currentSubStageDisplayName={currentSubStageDisplayName}
                candidateEmail={candidateEmail}
                candidatePhone={candidatePhone}
                handleEmail={handleEmail}
                handleCall={handleCall}
                handleChat={handleChat}
            />

            <CompensationSummary
                currentSubStage={currentSubStage}
                jobSalaryRange={jobSalaryRange}
                compensationData={compensationData}
                showActions={showActions}
                setShowCompensationInitModal={setShowCompensationInitModal}
            />

            <CompensationDetails
                currentSubStage={currentSubStage}
                jobSalaryRange={jobSalaryRange}
                compensationData={compensationData}
                showActions={showActions}
                canApprove={!!canApprove}
                setShowCompensationUpdateModal={setShowCompensationUpdateModal}
                handleApproveCompensation={handleApproveCompensation}
                handleRejectCandidate={() => setShowRevokeConfirmDialog(true)}
                getNextStage={getNextStage}
                handleMoveToStage={handleMoveToStage}
            />

            <CompensationMeetingList
                currentSubStage={currentSubStage}
                showActions={showActions}
                compensationMeetings={compensationMeetings}
                candidatePhone={candidatePhone}
                onAddMeeting={() => setShowCompensationMeetingModal(true)}
                onEditMeeting={(meeting) => {
                    setSelectedMeetingForEdit(meeting);
                    setShowCompensationMeetingModal(true);
                }}
                onCompleteMeeting={handleCompleteMeeting}
                onCancelMeeting={handleCancelMeeting}
            />

            <CompensationNotes
                comments={comments}
                showActions={showActions}
                setShowCommentModal={setShowCommentModal}
            />
        </div>
    );
};
