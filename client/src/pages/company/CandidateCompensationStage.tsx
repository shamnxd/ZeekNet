import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ChevronRight,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Calendar,
  Video,
  Edit,
  X,
  Zap,
  Loader2,
  FileX,
} from "lucide-react";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { SeekerProfile } from "@/interfaces/seeker/seeker.interface";
import {
  ATSStage,
  CompensationSubStage,
  STAGE_SUB_STAGES,
} from "@/constants/ats-stages";
import type {
  CompensationData,
  CompensationMeeting,
} from "./CandidateProfileTypes";
import type { ATSComment } from "@/types/ats";
import { formatATSStage, formatATSSubStage } from "@/utils/formatters";

interface CandidateCompensationStageProps {
  atsApplication: CompanySideApplication | null;
  candidateData: {
    profile: Partial<SeekerProfile>;
  } | null;
  selectedStage: string;
  compensationData: CompensationData | null;
  compensationMeetings: CompensationMeeting[];
  comments: ATSComment[];
  onSetShowCommentModal: (show: boolean) => void;
  onSetShowCompensationInitModal: (show: boolean) => void;
  onSetShowCompensationUpdateModal: (show: boolean) => void;
  onSetShowCompensationMeetingModal: (show: boolean) => void;
  onSetSelectedMeetingForEdit: (meeting: CompensationMeeting) => void;
  onSetShowRejectConfirmDialog: (show: boolean) => void;
  onApproveCompensation: () => Promise<void>;
  onMarkMeetingCompleted: (id: string) => Promise<void>;
  onCancelMeeting: (id: string) => Promise<void>;
  onMoveToStage: (targetStage: ATSStage, reason?: string) => Promise<void>;
  onSetShowMoveToStageModal: (show: boolean) => void;
  onOpenChat: () => void;
  formatDateTime: (dateString: string) => string;
  isCurrentStage: (stage: string) => boolean;
  getNextStage: (currentStage: string) => ATSStage | null;
  isUpdating?: boolean;
}

export const CandidateCompensationStage = ({
  atsApplication,
  candidateData,
  selectedStage,
  compensationData,
  compensationMeetings,
  comments,
  onSetShowCommentModal,
  onSetShowCompensationInitModal,
  onSetShowCompensationUpdateModal,
  onSetShowCompensationMeetingModal,
  onSetSelectedMeetingForEdit,
  onApproveCompensation,
  onMarkMeetingCompleted,
  onCancelMeeting,
  onMoveToStage,
  onSetShowMoveToStageModal,
  formatDateTime,
  isCurrentStage,
  getNextStage,
  isUpdating = false,
}: CandidateCompensationStageProps) => {
  const showActions = isCurrentStage(selectedStage);

  // Derive sub-stage from compensation data and application state
  // Derive sub-stage from compensation data and application state
  let currentSubStage: CompensationSubStage = CompensationSubStage.NOT_INITIATED;

  // Normalize strings for comparison (handle both snake_case and camelCase, and potential undefined)
  const appSubStageRaw = atsApplication?.sub_stage || atsApplication?.subStage;
  const isApproved = String(appSubStageRaw || '').toLowerCase() === 'approved' || !!compensationData?.approvedAt;

  if (isApproved) {
    currentSubStage = CompensationSubStage.APPROVED;
  } else if (compensationMeetings.length > 0) {
    currentSubStage = CompensationSubStage.NEGOTIATION_ONGOING;
  } else if (compensationData) {
    currentSubStage = CompensationSubStage.INITIATED;
  }

  const subStages = STAGE_SUB_STAGES[ATSStage.COMPENSATION] || [];

  const formatLPA = (value: string | number | undefined) => {
    if (!value) return "N/A";
    const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
    if (isNaN(num)) return value;
    if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} LPA`;
    }
    return `₹${num}`;
  };

  const expectedSalary = formatLPA(compensationData?.candidateExpected || candidateData?.profile.expectedSalary);

  // Filter comments (case-insensitive)
  const stageComments = comments.filter((c) => {
    const s = String(c.stage).toUpperCase();
    return s === ATSStage.COMPENSATION;
  });

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Compensation Stage
          </h3>
          <div className="flex gap-1 mt-2">
            <Badge
              className={
                currentSubStage === CompensationSubStage.APPROVED
                  ? "!bg-green-100 !text-green-700"
                  : currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING
                    ? "!bg-blue-100 !text-blue-700"
                    : currentSubStage === CompensationSubStage.INITIATED
                      ? "!bg-purple-100 !text-purple-700"
                      : "!bg-gray-100 !text-gray-700"
              }
            >
              {currentSubStage === CompensationSubStage.APPROVED
                ? 'Offer Approved'
                : currentSubStage === CompensationSubStage.NEGOTIATION_ONGOING && compensationMeetings.every(m => m.status === 'completed' || m.status === 'cancelled')
                  ? 'Negotiation Completed'
                  : subStages.find((s) => s.key === currentSubStage)?.label || (currentSubStage as string)}
            </Badge>
          </div>
        </div>

        {showActions && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 !border-[#4640DE] !text-[#4640DE] hover:bg-[#4640DE] hover:text-white transition-all shadow-sm"
            onClick={() => onSetShowMoveToStageModal(true)}
          >
            <Zap className="h-4 w-4 fill-current" />
            Quick Action
          </Button>
        )}
      </div>

      {/* Candidate Expectations */}
      <div className="bg-white rounded-lg p-6 border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <Briefcase className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Expected salary</p>
            <p className="text-lg font-bold text-gray-900 leading-tight">
              {expectedSalary}
            </p>
          </div>
        </div>
      </div>

      {/* NOT_INITIATED: Show "No compensation data" message and Initiate button */}
      {currentSubStage === CompensationSubStage.NOT_INITIATED && (
        <div className="bg-white rounded-lg p-6 border text-center">
          <p className="text-gray-600 mb-4">
            No compensation data recorded yet
          </p>
          {showActions && (
            <Button
              onClick={() => onSetShowCompensationInitModal(true)}
              className="bg-[#4640DE] hover:bg-[#3730A3]"
            >
              Initiate Compensation
            </Button>
          )}
        </div>
      )}

      {/* Current Offer Section */}
      {compensationData && (
        <div className="bg-white rounded-lg p-6 border space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Current Offer Details
            </h4>
            {showActions &&
              currentSubStage !== CompensationSubStage.APPROVED && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="!text-[#4640DE]"
                  onClick={() => onSetShowCompensationUpdateModal(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Offer
                </Button>
              )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Proposed Salary</p>
              <p className="text-md font-bold text-gray-900">
                {formatLPA(compensationData.companyProposed || compensationData.finalAgreed)}
              </p>
            </div>
            {compensationData.benefits && compensationData.benefits.length > 0 && (
              <div>
                <p className="text-sm text-gray-600">Benefits</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {compensationData.benefits.map((benefit, idx) => (
                    <Badge key={idx} variant="outline" className="text-[10px] bg-gray-50">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {currentSubStage === CompensationSubStage.APPROVED || String(atsApplication?.sub_stage || '').toLowerCase() === 'approved' ? (
            <div className="p-4 !bg-green-50 rounded-lg border !border-green-200 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 !text-green-600" />
              <span className="text-sm font-medium !text-green-900">
                This offer has been approved internally.
              </span>
            </div>
          ) : (
            showActions && (
              <div className="pt-4 border-t">
                <Button
                  onClick={onApproveCompensation}
                  className="bg-green-600 hover:bg-green-700 text-white gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve Internally
                </Button>
              </div>
            )
          )}
        </div>
      )}

      {/* Final Actions */}
      {showActions && (
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onSetShowCommentModal(true)}
          >
            <MessageSquare className="h-4 w-4" />
            Add Comment
          </Button>

          {/* Move to Next Stage button */}
          {(() => {
            const nextStage = atsApplication?.stage
              ? getNextStage(atsApplication.stage)
              : null;
            if (!nextStage) return null;
            return (
              <Button
                variant="outline"
                className="gap-2 border-[#4640DE] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                onClick={() => onMoveToStage(nextStage)}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Move to Offer Stage
              </Button>
            );
          })()}
        </div>
      )}

      {/* Internal Notes / Comments */}
      {stageComments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Comments / Notes</h4>
          {stageComments.filter(Boolean).map((comment, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border">
              <p className="text-sm text-gray-700">{comment?.comment}</p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                {formatATSStage(comment?.stage)} {comment?.subStage ? `• ${formatATSSubStage(comment.subStage)}` : ''}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDateTime(
                  comment?.createdAt || comment?.timestamp || ""
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Negotiation Meetings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Negotiation Meetings</h4>
          {showActions && currentSubStage !== CompensationSubStage.APPROVED && (
            <Button
              size="sm"
              variant="outline"
              className="gap-2"
              onClick={() => onSetShowCompensationMeetingModal(true)}
            >
              <Calendar className="h-4 w-4" />
              Schedule Meeting
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {compensationMeetings.length === 0 ? (
            <p className="text-sm text-gray-500 italic py-4 text-center bg-white rounded-lg border">
              No meetings scheduled
            </p>
          ) : (
            compensationMeetings.filter(Boolean).map((meeting) => (
              <div
                key={meeting?.id}
                className="bg-white rounded-lg p-4 border flex items-start justify-between"
              >
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-900 truncate">
                    {meeting?.title}
                  </h5>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDateTime(meeting?.scheduledDate || "")}
                    </div>
                    <Badge
                      className={
                        meeting?.status === "completed"
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : meeting?.status === "cancelled"
                            ? "bg-red-100 text-red-700 hover:bg-red-100"
                            : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      }
                    >
                      {meeting?.status}
                    </Badge>
                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    <div className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="font-medium capitalize">{meeting?.type}</span>
                      {meeting?.type === 'call' && (
                        <span className="text-gray-600">
                          • {atsApplication?.phone || candidateData?.profile?.phone || 'No phone number'}
                        </span>
                      )}
                      {meeting?.location && (
                        <span className="text-gray-600">
                          • {meeting.location}
                        </span>
                      )}
                    </div>

                    {meeting?.meetingLink && (
                      <a
                        href={meeting.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4640DE] hover:underline flex items-center gap-1.5 text-sm w-fit"
                      >
                        <Video className="h-4 w-4" />
                        Meeting Link
                      </a>
                    )}
                  </div>
                  {meeting?.notes && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">
                      Note: {meeting.notes}
                    </p>
                  )}
                </div>
                {showActions && meeting?.status === "scheduled" && (
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      {/* Join Button */}
                      {(meeting.videoType === 'in-app' && meeting.webrtcRoomId || meeting.meetingLink) && (
                        <Button
                          size="sm"
                          className="h-7 px-3 bg-[#4640DE] hover:bg-[#3730A3] text-white text-xs gap-1.5"
                          onClick={() => {
                            if (meeting.videoType === 'in-app' && meeting.webrtcRoomId) {
                              window.open(`/video-call/${meeting.webrtcRoomId}`, '_blank');
                            } else if (meeting.meetingLink) {
                              window.open(meeting.meetingLink, '_blank');
                            }
                          }}
                        >
                          <Video className="h-3 w-3" />
                          {meeting.videoType === 'in-app' ? 'Join Call' : 'Link'}
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2 py-1 h-7"
                        onClick={() => {
                          onSetSelectedMeetingForEdit(meeting);
                          onSetShowCompensationMeetingModal(true);
                        }}
                      >
                        Manage
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs gap-1"
                        onClick={() => onCancelMeeting(meeting?.id || "")}
                      >
                        <X className="h-3 w-3" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 text-xs gap-1"
                        onClick={() => onMarkMeetingCompleted(meeting?.id || "")}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Mark Done
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Fallback for no activity */}
      {!showActions && stageComments.length === 0 && compensationMeetings.length === 0 && !compensationData && (
        <div className="flex flex-col items-center justify-center py-10 bg-white/50 rounded-lg border border-dashed border-gray-200">
          <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
            <FileX className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-900">No activity yet</p>
          <p className="text-xs text-gray-500 mt-1">
            No actions or comments recorded for this stage
          </p>
        </div>
      )}
    </div>
  );
};
