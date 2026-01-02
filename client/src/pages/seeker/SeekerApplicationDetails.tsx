import { useState, useEffect, type ReactNode } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, FileText, ExternalLink, Upload, Video, CheckCircle, X, DollarSign, File as FileIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SeekerLayout from '@/components/layouts/SeekerLayout'
import { jobApplicationApi } from '@/api'
import { atsService } from '@/services/ats.service'
import { toast } from 'sonner'
import { ATSStage, ATSStageDisplayNames, SubStageDisplayNames } from '@/constants/ats-stages'
import type { ATSStage as ATSStageType } from '@/constants/ats-stages'
import type { ApiError } from '@/types/api-error.type'
import type { ATSInterview, ATSTechnicalTask, ATSOfferDocument } from '@/types/ats'
import { TaskSubmissionModal } from '@/components/seeker/TaskSubmissionModal'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'

// Extended types to match actual API responses
type ExtendedATSTechnicalTask = ATSTechnicalTask & {
  documentUrl?: string;
  documentFilename?: string;
  submissionUrl?: string;
  submissionFilename?: string;
  submissionLink?: string;
  submissionNote?: string;
  submittedAt?: string;
}

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
}

const SeekerApplicationDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<Record<string, unknown> | null>(null)
  const [technicalTasks, setTechnicalTasks] = useState<ExtendedATSTechnicalTask[]>([])
  const [interviews, setInterviews] = useState<ATSInterview[]>([])
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<ExtendedATSTechnicalTask | null>(null)
  const [showRescheduleInterviewModal, setShowRescheduleInterviewModal] = useState(false)
  const [showRescheduleMeetingModal, setShowRescheduleMeetingModal] = useState(false)
  const [offers, setOffers] = useState<ExtendedATSOfferDocument[]>([])
  const [compensationMeetings, setCompensationMeetings] = useState<Array<{ id?: string; type: string; scheduledDate: string; location?: string; meetingLink?: string; status?: string; completedAt?: string; createdAt: string }>>([])
  const [showSignedDocumentModal, setShowSignedDocumentModal] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState<ExtendedATSOfferDocument | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showDeclineConfirmDialog, setShowDeclineConfirmDialog] = useState(false)
  const [offerToDecline, setOfferToDecline] = useState<{ applicationId: string; offerId: string } | null>(null)
  const [declining, setDeclining] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const trimmedId = typeof id === 'string' ? id.trim() : String(id)
      if (!trimmedId || trimmedId === 'undefined' || trimmedId === 'null' || trimmedId === '') {
        toast.error('Application ID not found')
        navigate('/seeker/applications')
        return
      }

      const applicationId = trimmedId

      try {
        setLoading(true)
        const appRes = await jobApplicationApi.getSeekerApplicationById(applicationId)
        const appData = appRes?.data?.data || appRes?.data

        if (!appData) {
          toast.error('Application not found')
          navigate('/seeker/applications')
          return
        }

        setApplication(appData)

        const responseApplicationId = appData?.id || appData?._id || applicationId

        if (responseApplicationId && responseApplicationId !== 'undefined' && responseApplicationId !== 'null') {
          try {
            const [tasksResponse, interviewsResponse, offersResponse, meetingsResponse] = await Promise.all([
              atsService.getTechnicalTasksByApplicationForSeeker(responseApplicationId).catch(() => ({ data: [] })),
              atsService.getInterviewsByApplicationForSeeker(responseApplicationId).catch(() => ({ data: [] })),
              atsService.getOffersByApplicationForSeeker(responseApplicationId).catch(() => ({ data: [] })),
              atsService.getCompensationMeetingsForSeeker(responseApplicationId).catch(() => [])
            ])
            setTechnicalTasks(tasksResponse.data || [])
            setInterviews(interviewsResponse.data || [])

            let offersData = []
            if (Array.isArray(offersResponse)) {
              offersData = offersResponse
            } else if (offersResponse?.data && Array.isArray(offersResponse.data)) {
              offersData = offersResponse.data
            } else if (offersResponse?.data?.data && Array.isArray(offersResponse.data.data)) {
              offersData = offersResponse.data.data
            }
            setOffers(offersData)
            setCompensationMeetings(Array.isArray(meetingsResponse) ? meetingsResponse : [])
          } catch (err) {
            console.error('Failed to fetch tasks/interviews/offers:', err)
          }
        }
      } catch (error: unknown) {
        const apiError = error as ApiError
        toast.error(apiError?.response?.data?.message || 'Failed to load application details')
        navigate('/seeker/applications')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, navigate])

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <SeekerLayout>
        <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4640de] mx-auto mb-4"></div>
            <p className="text-[#6b7280]">Loading application details...</p>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  if (!application) {
    return (
      <SeekerLayout>
        <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-[#1f2937] mb-2">Application not found</h2>
            <p className="text-[#6b7280] mb-4">The application you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/seeker/applications')}>Back to Applications</Button>
          </div>
        </div>
      </SeekerLayout>
    )
  }

  const stageValue = typeof application?.stage === 'string' ? application.stage : 'APPLIED'
  const currentStage = stageValue as ATSStageType
  const currentSubStage = (typeof application?.sub_stage === 'string' ? application.sub_stage : typeof application?.subStage === 'string' ? application.subStage : undefined) as string | undefined

  // Helper function to render interview actions
  const renderInterviewActions = (): ReactNode | null => {
    const stageStr: string = String(currentStage)
    const isInterview: boolean = stageStr === 'INTERVIEW'
    const hasInterviews: boolean = interviews.length > 0

    if (!isInterview || !hasInterviews) {
      return null
    }
    return (
      <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
        <h3 className="text-[16px] font-semibold text-[#1f2937] mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          {interviews.some((i: ATSInterview) =>
            (i.videoType === 'in-app' && i.webrtcRoomId && i.status === 'scheduled') ||
            (i.meetingLink && i.status === 'scheduled')
          ) ? (
            <Button
              onClick={() => {
                const scheduledInterview = interviews.find((i: ATSInterview) =>
                  (i.videoType === 'in-app' && i.webrtcRoomId && i.status === 'scheduled') ||
                  (i.meetingLink && i.status === 'scheduled')
                )
                if (scheduledInterview) {
                  if (scheduledInterview.videoType === 'in-app' && scheduledInterview.webrtcRoomId) {
                    navigate(`/video-call/${scheduledInterview.webrtcRoomId}`)
                  } else if (scheduledInterview.meetingLink) {
                    window.open(scheduledInterview.meetingLink, '_blank')
                  }
                }
              }}
              className="bg-[#4640DE] hover:bg-[#3730A3] gap-2"
            >
              <Video className="h-4 w-4" />
              {interviews.some((i: ATSInterview) => i.videoType === 'in-app' && i.webrtcRoomId && i.status === 'scheduled')
                ? 'Join In-App Video'
                : 'Join Interview'}
            </Button>
          ) : null}
          <Button
            variant="outline"
            onClick={() => setShowRescheduleInterviewModal(true)}
            className="gap-2"
          >
            <Calendar className="h-4 w-4" />
            Request to Reschedule
          </Button>
        </div>
      </div>
    )
  }

  return (
    <SeekerLayout>
      <div className="px-8 xl:px-11 py-9 space-y-6 bg-[#f8f9ff] min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/seeker/applications')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-[26px] font-bold text-[#1f2937]">Application Details</h1>
            <p className="text-[14px] text-[#6b7280] mt-1">{String(application?.job_title || application?.jobTitle || '')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hiring Progress */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
              <h2 className="text-[20px] font-bold text-[#1f2937] mb-6">Hiring Progress</h2>

              {/* Current Stage */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[14px] text-[#6b7280] mb-1">Current Stage</p>
                    <p className="text-[18px] font-semibold text-[#1f2937]">
                      {ATSStageDisplayNames[currentStage] || currentStage}
                    </p>
                  </div>
                  <Badge className="px-4 py-2 text-[14px] font-semibold bg-[#eef2ff] text-[#4640de] border-[#4640de]">
                    {ATSStageDisplayNames[currentStage] || currentStage}
                  </Badge>
                </div>

                {currentSubStage && (
                  <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                    <p className="text-[14px] text-[#6b7280] mb-1">Sub-stage</p>
                    <p className="text-[16px] font-medium text-[#1f2937]">
                      {SubStageDisplayNames[currentSubStage as keyof typeof SubStageDisplayNames] || (typeof currentSubStage === 'string' ? currentSubStage.replace(/_/g, ' ') : '')}
                    </p>
                  </div>
                )}
              </div>

              {/* Stage-based Actions */}
              {renderInterviewActions()}

              {currentStage === ATSStage.COMPENSATION && (
                <div className="mt-6 pt-6 border-t border-[#e5e7eb]">
                  <h3 className="text-[16px] font-semibold text-[#1f2937] mb-4">Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowRescheduleMeetingModal(true)}
                      className="gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Reschedule Meeting
                    </Button>
                  </div>
                </div>
              )}

              {/* Applied Date */}
              {application.applied_date && (
                <div className="pt-4 border-t border-[#e5e7eb]">
                  <div className="flex items-center gap-2 text-[14px] text-[#6b7280]">
                    <Calendar className="h-4 w-4" />
                    <span>Applied on {formatDate(String(application?.applied_date || application?.appliedAt || ''))}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Offers Section */}
            {(offers.length > 0 || currentStage === ATSStage.OFFER) && (
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
                <h2 className="text-[20px] font-bold text-[#1f2937] mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Offer Details
                </h2>
                {offers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[14px] text-[#6b7280]">No offers available yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {offers.map((offer) => {
                      const getStatusDisplay = (status: string, hasWithdrawalReason?: boolean) => {
                        if (status === 'declined' || status === 'OFFER_DECLINED') {
                          return hasWithdrawalReason
                            ? { label: 'Offer Withdrawn', color: 'bg-orange-100 text-orange-700' }
                            : { label: 'Offer Declined', color: 'bg-red-100 text-red-700' }
                        }
                        const statusMap: Record<string, { label: string; color: string }> = {
                          'sent': { label: 'Offer Sent', color: 'bg-blue-100 text-blue-700' },
                          'OFFER_SENT': { label: 'Offer Sent', color: 'bg-blue-100 text-blue-700' },
                          'signed': { label: 'Offer Accepted', color: 'bg-green-100 text-green-700' },
                          'OFFER_ACCEPTED': { label: 'Offer Accepted', color: 'bg-green-100 text-green-700' },
                          'accepted': { label: 'Offer Accepted', color: 'bg-green-100 text-green-700' },
                          'NOT_SENT': { label: 'Not Sent', color: 'bg-gray-100 text-gray-700' },
                        }
                        return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' }
                      }

                      const offerStatus = offer.status || 'draft'
                      const statusInfo = getStatusDisplay(offerStatus, !!offer.withdrawalReason)
                      const canAcceptDecline = offerStatus === 'sent'
                      const isSigned = offerStatus === 'signed'
                      const isDeclined = offerStatus === 'declined'

                      return (
                        <div key={offer.id} className="border border-[#e5e7eb] rounded-lg p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-[16px] font-semibold text-[#1f2937]">Job Offer</h3>
                                <Badge className={statusInfo.color}>
                                  {statusInfo.label}
                                </Badge>
                              </div>

                              {offer.offerAmount && (
                                <div className="mb-3">
                                  <p className="text-[13px] text-[#6b7280] mb-1">Offer Amount</p>
                                  <p className="text-[18px] font-bold text-[#1f2937]">
                                    ₹{offer.offerAmount} LPA
                                  </p>
                                </div>
                              )}

                              {offer.sentAt && (
                                <div className="mb-3">
                                  <p className="text-[13px] text-[#6b7280] mb-1">Sent Date</p>
                                  <p className="text-[14px] font-medium text-[#1f2937]">
                                    {formatDateTime(offer.sentAt)}
                                  </p>
                                </div>
                              )}

                              {offer.documentUrl && (
                                <div className="mb-3">
                                  <p className="text-[13px] text-[#6b7280] mb-2">Offer Document</p>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      if (offer.documentUrl) {
                                        window.open(offer.documentUrl, '_blank')
                                      }
                                    }}
                                    className="gap-2"
                                  >
                                    <FileText className="h-4 w-4" />
                                    {offer.documentFilename || 'View Offer Letter'}
                                  </Button>
                                </div>
                              )}

                              {/* Signed Document Display */}
                              {isSigned && offer.signedDocumentUrl && (
                                <div className="mb-3">
                                  <p className="text-[13px] text-[#6b7280] mb-2">Signed Document</p>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      if (offer.signedDocumentUrl) {
                                        window.open(offer.signedDocumentUrl, '_blank')
                                      }
                                    }}
                                    className="gap-2"
                                  >
                                    <FileText className="h-4 w-4" />
                                    {offer.signedDocumentFilename || 'View Signed Document'}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Accept/Decline Actions */}
                          {canAcceptDecline && (
                            <div className="mt-4 pt-4 border-t border-[#e5e7eb] space-y-3">
                              <div className="flex gap-3">
                                <Button
                                  onClick={() => {
                                    setSelectedOffer(offer)
                                    setShowSignedDocumentModal(true)
                                  }}
                                  className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Accept Offer
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    if (!id || !offer.id) return
                                    setOfferToDecline({ applicationId: id, offerId: offer.id })
                                    setShowDeclineConfirmDialog(true)
                                  }}
                                  className="gap-2 text-red-600 hover:text-red-700 border-red-300 flex-1"
                                >
                                  <X className="h-4 w-4" />
                                  Decline Offer
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Upload Signed Document for Accepted Offers */}
                          {isSigned && !offer.signedDocumentUrl && (
                            <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                              <p className="text-[13px] text-[#6b7280] mb-3">Upload your signed offer document</p>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedOffer(offer)
                                  setShowSignedDocumentModal(true)
                                }}
                                className="gap-2"
                              >
                                <Upload className="h-4 w-4" />
                                Upload Signed Document
                              </Button>
                            </div>
                          )}

                          {/* Status Messages */}
                          {isSigned && (
                            <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                              <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="h-5 w-5" />
                                <p className="text-sm font-semibold">Offer Accepted</p>
                              </div>
                              {offer.signedAt && (
                                <p className="text-xs text-[#6b7280] mt-1">
                                  Accepted on {formatDateTime(offer.signedAt)}
                                </p>
                              )}
                            </div>
                          )}
                          {isDeclined && (
                            <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                              <div className="flex items-center gap-2 text-red-700">
                                <X className="h-5 w-5" />
                                <p className="text-sm font-semibold">
                                  {offer.withdrawalReason ? 'Offer Withdrawn' : 'Offer Declined'}
                                </p>
                              </div>
                              {offer.withdrawalReason && (
                                <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                                  <p className="text-xs font-medium text-red-900 mb-1">Withdrawal Reason:</p>
                                  <p className="text-sm text-red-800">{offer.withdrawalReason}</p>
                                </div>
                              )}
                              {offer.declinedAt && (
                                <p className="text-xs text-[#6b7280] mt-1">
                                  {offer.withdrawalReason ? 'Withdrawn' : 'Declined'} on {formatDateTime(offer.declinedAt)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Technical Tasks */}
            {technicalTasks.length > 0 && (
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
                <h2 className="text-[20px] font-bold text-[#1f2937] mb-6">Technical Tasks</h2>
                <div className="space-y-4">
                  {technicalTasks.map((task) => {
                    const taskStatus = task.status || 'assigned'
                    const isAssigned = taskStatus === 'assigned'
                    const isSubmitted = taskStatus === 'submitted'
                    const isUnderReview = taskStatus === 'under_review'

                    return (
                      <div key={task.id} className="border border-[#e5e7eb] rounded-lg p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-[16px] font-semibold text-[#1f2937] mb-2">{task.title}</h3>
                            <div className="flex items-center gap-4 text-[13px] text-[#6b7280]">
                              <span>Due: {task.deadline ? formatDate(task.deadline) : 'No deadline'}</span>
                              <Badge className={
                                isAssigned ? 'bg-blue-100 text-blue-700' :
                                  isSubmitted ? 'bg-yellow-100 text-yellow-700' :
                                    isUnderReview ? 'bg-purple-100 text-purple-700' :
                                      'bg-green-100 text-green-700'
                              }>
                                {isAssigned ? 'Assigned' :
                                  isSubmitted ? 'Submitted' :
                                    isUnderReview ? 'Under Review' :
                                      'Completed'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Task Description */}
                        {task.description && (
                          <div className="mb-4">
                            <p className="text-[14px] text-[#374151] whitespace-pre-wrap">{task.description}</p>
                          </div>
                        )}

                        {/* Attachments */}
                        {task.documentUrl && task.documentFilename && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 text-[14px] text-[#6b7280]">
                              <FileIcon className="h-4 w-4" />
                              <a
                                href={task.documentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#4640de] hover:underline flex items-center gap-1"
                              >
                                {task.documentFilename}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Submit Button for Assigned Tasks */}
                        {isAssigned && (
                          <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
                            <Button
                              onClick={() => {
                                setSelectedTask(task)
                                setShowSubmissionModal(true)
                              }}
                              className="bg-[#4640DE] hover:bg-[#3730A3] gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Submit Task
                            </Button>
                          </div>
                        )}

                        {/* Submission Info */}
                        {isSubmitted && (task.submissionUrl || task.submissionLink) && (
                          <div className="mb-4 p-3 bg-[#f9fafb] rounded border border-[#e5e7eb]">
                            <p className="text-[13px] font-medium text-[#1f2937] mb-2">Your Submission</p>

                            {/* File Submission */}
                            {task.submissionUrl && (
                              <div className="mb-2 flex items-center gap-2 text-[13px] text-[#6b7280]">
                                <FileIcon className="h-4 w-4" />
                                <a
                                  href={task.submissionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#4640de] hover:underline flex items-center gap-1"
                                >
                                  {task.submissionFilename || 'Submission File'}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}

                            {/* Link Submission */}
                            {task.submissionLink && (
                              <div className="mb-2 flex items-center gap-2 text-[13px] text-[#6b7280]">
                                <ExternalLink className="h-4 w-4" />
                                <a
                                  href={task.submissionLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#4640de] hover:underline flex items-center gap-1"
                                >
                                  View Submission Link
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}

                            {/* Submission Note */}
                            {task.submissionNote && (
                              <div className="mt-3 pt-3 border-t border-[#e5e7eb]">
                                <p className="text-[12px] font-medium text-[#1f2937] mb-1">Notes:</p>
                                <p className="text-[13px] text-[#374151] whitespace-pre-wrap">{task.submissionNote}</p>
                              </div>
                            )}

                            {task.submittedAt && (
                              <p className="text-[12px] text-[#9ca3af] mt-2">
                                Submitted: {formatDateTime(task.submittedAt)}
                              </p>
                            )}
                          </div>
                        )}

                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Interviews */}
            {interviews.length > 0 && (
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
                <h2 className="text-[20px] font-bold text-[#1f2937] mb-6">Interviews</h2>
                <div className="space-y-4">
                  {interviews.map((interview) => (
                    <div key={interview.id} className="border border-[#e5e7eb] rounded-lg p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-[16px] font-semibold text-[#1f2937] mb-2">{interview.title || 'Interview'}</h3>
                          <div className="flex items-center gap-4 text-[13px] text-[#6b7280]">
                            <span>{formatDateTime(interview.scheduledDate)}</span>
                            <Badge className={
                              interview.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                                interview.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                            }>
                              {interview.status || 'Scheduled'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {interview.location && (
                        <div className="mb-2">
                          <p className="text-[14px] text-[#374151]">Location: {interview.location}</p>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compensation Meetings History Only */}
            {compensationMeetings.length > 0 && (
              <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
                <h2 className="text-[20px] font-bold text-[#1f2937] mb-6 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  Compensation Meetings
                </h2>
                <div className="space-y-3">
                  {compensationMeetings.filter((m) => m != null).map((meeting, idx: number) => {
                    const meetingType = meeting.type || 'call'
                    const meetingStatus = (meeting.status || 'scheduled').toLowerCase()
                    const isCompleted = meetingStatus === 'completed'
                    const isCancelled = meetingStatus === 'cancelled'
                    const isScheduled = meetingStatus === 'scheduled'

                    let bgColor = ''
                    if (isCancelled) {
                      bgColor = 'bg-gray-50 border-gray-200'
                    } else if (isCompleted) {
                      bgColor = 'bg-green-50 border-green-200'
                    }

                    return (
                      <div key={idx} className={`border rounded-lg p-4 ${bgColor}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-medium text-gray-900 capitalize">{meetingType}</p>
                              <Badge variant="outline" className="text-xs">{meetingType}</Badge>
                              {isCompleted && !isCancelled && (
                                <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                                  Completed
                                </Badge>
                              )}
                              {isCancelled && (
                                <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                                  Cancelled
                                </Badge>
                              )}
                              {isScheduled && !isCompleted && !isCancelled && (
                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                                  Scheduled
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {formatDateTime(meeting.scheduledDate || meeting.createdAt)}
                            </p>
                          </div>
                        </div>
                        {meeting.location && (
                          <p className="text-xs text-gray-500 mt-1">Location: {meeting.location}</p>
                        )}
                        {meeting.meetingLink && (
                          <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-xs text-[#4640DE] hover:underline mt-1 block">
                            Meeting Link: {meeting.meetingLink}
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Info */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] shadow-sm p-6">
              <h3 className="text-[18px] font-bold text-[#1f2937] mb-4">Job Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[13px] text-[#6b7280] mb-1">Position</p>
                  <p className="text-[15px] font-semibold text-[#1f2937]">
                    {String(application?.job_title || application?.jobTitle || '')}
                  </p>
                </div>
                {application?.job_company ? (
                  <div>
                    <p className="text-[13px] text-[#6b7280] mb-1">Company</p>
                    <p className="text-[15px] font-medium text-[#1f2937]">{String(application.job_company)}</p>
                  </div>
                ) : null}
                {application?.job_location ? (
                  <div>
                    <p className="text-[13px] text-[#6b7280] mb-1">Location</p>
                    <p className="text-[15px] font-medium text-[#1f2937]">{String(application.job_location)}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Submission Modal */}
      {selectedTask && (
        <TaskSubmissionModal
          open={showSubmissionModal}
          onClose={() => {
            setShowSubmissionModal(false)
            setSelectedTask(null)
          }}
          onSubmit={async (data) => {
            if (!id || !selectedTask?.id) return
            try {
              await atsService.submitTechnicalTask(id, selectedTask.id, data)
              toast.success('Task submitted successfully')
              const tasksResponse = await atsService.getTechnicalTasksByApplicationForSeeker(id).catch(() => ({ data: [] }))
              setTechnicalTasks(tasksResponse.data || [])
              setShowSubmissionModal(false)
              setSelectedTask(null)
            } catch (error) {
              console.error('Error submitting task:', error)
              toast.error('Failed to submit task')
              throw error
            }
          }}
          taskTitle={selectedTask.title || 'Technical Task'}
        />
      )}

      {/* Reschedule Interview Modal */}
      {showRescheduleInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#1f2937] mb-4">Request to Reschedule Interview</h3>
            <p className="text-[14px] text-[#6b7280] mb-6">
              This feature will be available soon. You can contact the recruiter directly to request a reschedule.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRescheduleInterviewModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Meeting Modal */}
      {showRescheduleMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#1f2937] mb-4">Reschedule Meeting</h3>
            <p className="text-[14px] text-[#6b7280] mb-6">
              This feature will be available soon. You can contact the recruiter directly to reschedule the meeting.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRescheduleMeetingModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Signed Document Modal */}
      {showSignedDocumentModal && selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-[#1f2937] mb-2">Accept Offer - Upload Signed Document</h3>
            <p className="text-[14px] text-[#6b7280] mb-1">
              To accept this offer, you must upload the signed offer letter document.
            </p>
            <p className="text-[13px] text-red-600 mb-6 font-medium">
              * Signed document is required
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              id="signed-document-upload"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return

                const allowedExtensions = ['.pdf', '.doc', '.docx']
                const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
                if (!allowedExtensions.includes(fileExtension)) {
                  toast.error('Please upload a PDF, DOC, or DOCX file')
                  return
                }

                if (file.size > 10 * 1024 * 1024) {
                  toast.error('File size must be less than 10MB')
                  return
                }

                setSelectedFile(file)
              }}
            />
            <div className="space-y-4">
              {!selectedFile ? (
                <label
                  htmlFor="signed-document-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#e5e7eb] rounded-lg cursor-pointer hover:border-[#4640de] transition-colors"
                >
                  <Upload className="h-8 w-8 text-[#6b7280] mb-2" />
                  <p className="text-sm text-[#6b7280]">Click to upload or drag and drop</p>
                  <p className="text-xs text-[#9ca3af] mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                </label>
              ) : (
                <div className="border border-[#e5e7eb] rounded-lg p-4 flex items-center justify-between bg-[#f9fafb]">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#4640de]" />
                    <div>
                      <p className="text-sm font-medium text-[#1f2937]">{selectedFile.name}</p>
                      <p className="text-xs text-[#6b7280]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      const input = document.getElementById('signed-document-upload') as HTMLInputElement
                      if (input) input.value = ''
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSignedDocumentModal(false)
                    setSelectedOffer(null)
                    setSelectedFile(null)
                    const input = document.getElementById('signed-document-upload') as HTMLInputElement
                    if (input) input.value = ''
                  }}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedFile || !id || !selectedOffer?.id) {
                      toast.error('Please select a signed document to upload')
                      return
                    }

                    try {
                      setUploading(true)
                      await atsService.uploadSignedOfferDocument(id, selectedOffer.id, selectedFile)
                      toast.success('Offer accepted successfully! Signed document uploaded.')
                      const offersResponse = await atsService.getOffersByApplicationForSeeker(id).catch(() => ({ data: [] }))
                      const offersData = offersResponse?.data?.data || offersResponse?.data || offersResponse || []
                      setOffers(Array.isArray(offersData) ? offersData : [])
                      setShowSignedDocumentModal(false)
                      setSelectedOffer(null)
                      setSelectedFile(null)
                      const input = document.getElementById('signed-document-upload') as HTMLInputElement
                      if (input) input.value = ''
                    } catch (error) {
                      console.error('Error uploading signed document:', error)
                      toast.error('Failed to upload signed document')
                    } finally {
                      setUploading(false)
                    }
                  }}
                  disabled={!selectedFile || uploading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {uploading ? 'Uploading...' : 'Accept Offer & Upload'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline Offer Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeclineConfirmDialog}
        onClose={() => {
          setShowDeclineConfirmDialog(false)
          setOfferToDecline(null)
        }}
        onConfirm={async () => {
          if (!offerToDecline) return
          try {
            setDeclining(true)
            await atsService.declineOffer(offerToDecline.applicationId, offerToDecline.offerId)
            toast.success('Offer declined')
            const offersResponse = await atsService.getOffersByApplicationForSeeker(offerToDecline.applicationId).catch(() => ({ data: [] }))
            const offersData = offersResponse?.data?.data || offersResponse?.data || offersResponse || []
            setOffers(Array.isArray(offersData) ? offersData : [])
            setShowDeclineConfirmDialog(false)
            setOfferToDecline(null)
          } catch (error) {
            console.error('Error declining offer:', error)
            toast.error('Failed to decline offer')
          } finally {
            setDeclining(false)
          }
        }}
        title="Decline Offer"
        description="Are you sure you want to decline this offer? This action cannot be undone."
        confirmText="Decline Offer"
        cancelText="Cancel"
        variant="danger"
        isLoading={declining}
      />
    </SeekerLayout>
  )
}

export default SeekerApplicationDetails