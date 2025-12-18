import CompanyLayout from '../../components/layouts/CompanyLayout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loading } from '@/components/ui/loading'
import { ScoreBadge } from '@/components/ui/score-badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { jobApplicationApi } from '@/api'
import { chatApi } from '@/api/chat.api'
import { toast } from 'sonner'
import { ApplicationStage } from '@/constants/enums'
import { 
  ArrowLeft, Star, Mail, Phone, Instagram, Twitter, Globe,
  Download, Plus, MoreHorizontal, Clock, MapPin, MessageCircle
} from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'
import type { ApplicationDetails as ApplicationDetailsData } from '@/interfaces/application/application-details.interface'
import type { ApiError } from '@/types/api-error.type'

const ApplicationDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState<ApplicationDetailsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [scheduleInterviewOpen, setScheduleInterviewOpen] = useState(false)
  const [giveRatingOpen, setGiveRatingOpen] = useState(false)
  const [addScheduleOpen, setAddScheduleOpen] = useState(false)
  const [addFeedbackOpen, setAddFeedbackOpen] = useState(false)
  const [editScheduleOpen, setEditScheduleOpen] = useState(false)
  const [moveToNextStepOpen, setMoveToNextStepOpen] = useState(false)
  const [rejectApplicationOpen, setRejectApplicationOpen] = useState(false)
  const [sendMessageOpen, setSendMessageOpen] = useState(false)
  const [hireRejectDialogOpen, setHireRejectDialogOpen] = useState(false)
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null)
  const [scheduleForm, setScheduleForm] = useState({
    date: '', time: '', location: '', interviewType: '', interviewer: '', notes: ''
  })
  const [ratingForm, setRatingForm] = useState({ rating: 0 })
  const [feedbackForm, setFeedbackForm] = useState({ feedback: '' })
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' })
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      if (!id) {
        toast.error('Application ID not found')
        navigate('/company/applicants')
        return
      }
      try {
        setLoading(true)
        const res = await jobApplicationApi.getCompanyApplicationById(id)
        const a = res?.data?.data || res?.data
        const mapped: ApplicationDetailsData = {
          _id: a.id,
          seeker_id: a.seeker_id,
          seeker_name: a.seeker_name || 'Candidate',
          seeker_avatar: a.seeker_avatar,
          seeker_headline: a.seeker_headline,
          job_id: a.job_id,
          job_title: a.job_title,
          job_company: a.job_company,
          job_location: a.job_location,
          job_type: a.job_type,
          score: a.score,
          stage: a.stage,
          applied_date: a.applied_date,
          cover_letter: a.cover_letter,
          resume_url: a.resume_url,
          full_name: a.full_name,
          date_of_birth: a.date_of_birth,
          gender: a.gender,
          email: a.email,
          phone: a.phone,
          address: a.address,
          about_me: a.about_me,
          languages: a.languages,
          skills: a.skills,
          resume_data: a.resume_data,
          interview_schedule: (a.interviews || []).map((iv: { id: string; date: string; interviewer_name?: string; interview_type: string; time: string; location: string; status: string; feedback?: unknown }) => ({
            id: iv.id, date: iv.date, interviewer_name: iv.interviewer_name || '',
            interviewer_avatar: undefined, interview_type: iv.interview_type,
            time: iv.time, location: iv.location, status: iv.status, feedback: iv.feedback
          })),
        }
        setApplication(mapped)
      } catch {
        toast.error('Failed to load application details')
        navigate('/company/applicants')
      } finally {
        setLoading(false)
      }
    }
    fetchApplicationDetails()
  }, [id, navigate])

  const reload = async () => {
    if (!id) return
    try {
      const res = await jobApplicationApi.getCompanyApplicationById(id)
      const a = res?.data?.data || res?.data
      const mapped: ApplicationDetailsData = {
        _id: a.id, seeker_id: a.seeker_id, seeker_name: a.seeker_name || 'Candidate',
        seeker_avatar: a.seeker_avatar, seeker_headline: a.seeker_headline,
        job_id: a.job_id, job_title: a.job_title, job_company: a.job_company,
        job_location: a.job_location, job_type: a.job_type, score: a.score,
        stage: a.stage, applied_date: a.applied_date, cover_letter: a.cover_letter,
        resume_url: a.resume_url, full_name: a.full_name, date_of_birth: a.date_of_birth,
        gender: a.gender, email: a.email, phone: a.phone, address: a.address,
        about_me: a.about_me, languages: a.languages, skills: a.skills,
        resume_data: a.resume_data,
        interview_schedule: (a.interviews || []).map((iv: { id: string; date: string; interviewer_name?: string; interview_type: string; time: string; location: string; status: string; feedback?: unknown }) => ({
          id: iv.id, date: iv.date, interviewer_name: iv.interviewer_name || '',
          interviewer_avatar: undefined, interview_type: iv.interview_type,
          time: iv.time, location: iv.location, status: iv.status, feedback: iv.feedback
        })),
      }
      setApplication(mapped)
    } catch { }
  }

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  const getStageBadge = (stage: string) => {
    const stageMap: Record<string, { label: string; className: string }> = {
      [ApplicationStage.APPLIED]: { label: 'Applied', className: 'border-[#4640DE] text-[#4640DE]' },
      [ApplicationStage.SHORTLISTED]: { label: 'Shortlisted', className: 'border-[#4640DE] text-[#4640DE]' },
      [ApplicationStage.INTERVIEW]: { label: 'Interview', className: 'border-[#4640DE] text-[#4640DE]' },
      [ApplicationStage.REJECTED]: { label: 'Rejected', className: 'border-red-500 text-red-500' },
      [ApplicationStage.HIRED]: { label: 'Hired', className: 'border-[#56CDAD] text-[#56CDAD]' },
    }
    const stageInfo = stageMap[stage] || stageMap[ApplicationStage.APPLIED]
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#4640DE]"></div>
        <span className={`text-sm font-medium ${stageInfo.className}`}>{stageInfo.label}</span>
      </div>
    )
  }

  const handleScheduleInterview = () => {
    toast.success('Interview scheduled successfully')
    setScheduleInterviewOpen(false)
    setScheduleForm({ date: '', time: '', location: '', interviewType: '', interviewer: '', notes: '' })
  }

  const handleGiveRating = async () => {
    if (!id || ratingForm.rating === 0) {
      toast.error('Please select a rating')
      return
    }
    try {
      await jobApplicationApi.updateApplicationScore(id, { score: ratingForm.rating })
      toast.success('Rating submitted successfully')
      await reload()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update score')
    }
    setGiveRatingOpen(false)
    setRatingForm({ rating: 0 })
  }

  const handleAddSchedule = async (moveToInterview = false) => {
    if (!id) return
    try {
      await jobApplicationApi.addInterview(id, {
        date: scheduleForm.date, time: scheduleForm.time, location: scheduleForm.location,
        interview_type: scheduleForm.interviewType, interviewer_name: scheduleForm.interviewer,
      })
      toast.success('Interview schedule added successfully')

      if (moveToInterview && application?.stage === 'shortlisted') {
        try {
          await jobApplicationApi.updateApplicationStage(id, { stage: 'interview' })
          toast.success('Application moved to interview stage')
        } catch (error: unknown) {
          const apiError = error as ApiError;
          toast.error(apiError?.response?.data?.message || 'Failed to update stage')
        }
      }
      
      await reload()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to add interview')
    }
    setAddScheduleOpen(false)
    setScheduleForm({ date: '', time: '', location: '', interviewType: '', interviewer: '', notes: '' })
  }

  const handleOpenEditSchedule = (iv: { id: string; date: string; time?: string; location?: string; interview_type?: string; interviewer_name?: string }) => {
    setSelectedInterviewId(iv.id)
    setScheduleForm({
      date: iv.date ? String(iv.date).slice(0, 10) : '',
      time: iv.time || '', location: iv.location || '',
      interviewType: iv.interview_type || '', interviewer: iv.interviewer_name || '', notes: '',
    })
    setEditScheduleOpen(true)
  }

  const handleUpdateSchedule = async () => {
    if (!id || !selectedInterviewId) return
    try {
      await jobApplicationApi.updateInterview(id, selectedInterviewId, {
        date: scheduleForm.date, time: scheduleForm.time, location: scheduleForm.location,
        interview_type: scheduleForm.interviewType, interviewer_name: scheduleForm.interviewer,
      })
      toast.success('Interview updated successfully')
      await reload()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update interview')
    }
    setEditScheduleOpen(false)
    setSelectedInterviewId(null)
  }

  const handleCancelInterview = async (interviewId: string) => {
    if (!id) return
    try {
      await jobApplicationApi.deleteInterview(id, interviewId)
      toast.success('Interview cancelled')
      await reload()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to cancel interview')
    }
  }

  const handleMarkAsCompleted = async (interviewId: string) => {
    if (!id) return
    try {
      const interview = application?.interview_schedule?.find((iv) => iv.id === interviewId)
      if (!interview) return

      await jobApplicationApi.updateInterview(id, interviewId, {
        date: interview.date,
        time: interview.time,
        location: interview.location,
        interview_type: interview.interview_type,
        interviewer_name: interview.interviewer_name,
        status: 'completed',
      })
      toast.success('Interview marked as completed')
      await reload()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to mark interview as completed')
    }
  }

  const handleAddFeedback = async () => {
    if (!id || !selectedInterviewId) return
    try {
      await jobApplicationApi.addInterviewFeedback(id, selectedInterviewId, {
        reviewer_name: 'Reviewer', comment: feedbackForm.feedback,
      })
      toast.success('Feedback added successfully')
      await reload()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to add feedback')
    }
    setAddFeedbackOpen(false)
    setFeedbackForm({ feedback: '' })
    setSelectedInterviewId(null)
  }

  const handleMoveToNextStep = () => {
    if (!application) return

    if (application.stage === ApplicationStage.SHORTLISTED) {
      setMoveToNextStepOpen(false)
      setAddScheduleOpen(true)
      return
    }

    if (application.stage === ApplicationStage.INTERVIEW) {
      setMoveToNextStepOpen(false)
      setHireRejectDialogOpen(true)
      return
    }

    setMoveToNextStepOpen(true)
  }

  const handleMoveToNextStepConfirm = async () => {
    if (!id || !application) return
    const nextMap: Record<string, string> = {
      [ApplicationStage.APPLIED]: ApplicationStage.SHORTLISTED,
      [ApplicationStage.SHORTLISTED]: ApplicationStage.INTERVIEW,
      [ApplicationStage.INTERVIEW]: ApplicationStage.HIRED,
      [ApplicationStage.REJECTED]: ApplicationStage.REJECTED,
      [ApplicationStage.HIRED]: ApplicationStage.HIRED,
    }
    const next = nextMap[application.stage] || ApplicationStage.SHORTLISTED
    try {
      await jobApplicationApi.updateApplicationStage(id, { stage: next as ApplicationStage })
      toast.success('Application moved to next step')
      await reload()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update stage')
    }
    setMoveToNextStepOpen(false)
  }

  const handleHire = async () => {
    if (!id) return
    try {
      await jobApplicationApi.updateApplicationStage(id, { stage: ApplicationStage.HIRED })
      toast.success('Application moved to hired stage')
      await reload()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update stage')
    }
    setHireRejectDialogOpen(false)
  }

  const handleRejectApplication = async () => {
    if (!id) return
    try {
      await jobApplicationApi.updateApplicationStage(id, { stage: ApplicationStage.REJECTED, rejection_reason: rejectReason })
      toast.success('Application rejected')
      await reload()
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to reject application')
    }
    setRejectApplicationOpen(false)
    setRejectReason('')
  }

  const handleSendMessage = () => {
    toast.success('Message sent successfully')
    setSendMessageOpen(false)
    setMessageForm({ subject: '', message: '' })
  }

  const handleChatWithApplicant = async () => {
    if (!application?.seeker_id) return
    try {
      const conversation = await chatApi.createConversation({ participantId: application.seeker_id })
      navigate(`/company/messages?chat=${conversation.id}`)
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Unable to start chat')
    }
  }

  if (loading) {
    return (
      <CompanyLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loading />
        </div>
      </CompanyLayout>
    )
  }

  if (!application) {
    return (
      <CompanyLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Application not found</h2>
            <p className="text-gray-600 mb-4">The application you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/company/applicants')}>Back to Applications</Button>
          </div>
        </div>
      </CompanyLayout>
    )
  }

  return (
    <CompanyLayout>
      <div className="min-h-screen bg-white">
        {}
        <div className="border-b border-[#D6DDEB]">
          <div className="px-7 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="p-1.5" onClick={() => navigate('/company/applicants')}>
                  <ArrowLeft className="w-4 h-4 text-[#25324B]" />
                </Button>
                <h1 className="text-xl font-semibold text-[#25324B]">Applicant Details</h1>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="px-7 py-7">
          <div className="grid grid-cols-3 gap-7">
            {}
            <div className="space-y-5">
              <Card className="border border-[#D6DDEB] rounded-lg">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4 mb-5">
                    <Avatar className="w-16 h-16">
                      {application.seeker_avatar ? (
                        <AvatarImage src={application.seeker_avatar} alt={application.seeker_name} />
                      ) : null}
                      <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-lg font-semibold">
                        {getInitials(application.seeker_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-[#25324B] mb-1">{application.seeker_name}</h2>
                      <p className="text-sm text-[#7C8493] mb-3">{application.seeker_headline || application.job_title}</p>
                      
                      {}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">ATS Match Score</span>
                          <ScoreBadge score={application.score} />
                        </div>
                        <div className="flex items-center gap-3">
                          {application.score === -1 ? (
                            <>
                              <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                                <div className="h-full rounded-full bg-blue-400 animate-pulse" style={{ width: '50%' }} />
                              </div>
                              <span className="text-sm font-medium text-gray-500 min-w-[4rem] text-right">
                                Calculating...
                              </span>
                            </>
                          ) : (
                            <>

                            </>
                          )}
                        </div>
                    </div>
                  </div>

                  <div className="bg-[#F8F8FD] rounded-lg p-4 mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#25324B]">Applied Jobs</span>
                      <span className="text-sm text-[#7C8493]">{getTimeAgo(application.applied_date)}</span>
                    </div>
                    <div className="h-px bg-[#D6DDEB] mb-3"></div>
                    <div>
                      <p className="text-sm font-semibold text-[#25324B] mb-1">{application.job_title}</p>
                      <div className="flex items-center gap-2 text-xs text-[#7C8493]">
                        <span>{application.job_company}</span>
                        <span>•</span>
                        <span>{application.job_type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F8F8FD] rounded-lg p-4 mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-[#25324B]">Stage</span>
                    </div>
                    <div className="h-px bg-[#D6DDEB] mb-3"></div>
                    {getStageBadge(application.stage)}
                  </div>

                  <div className="flex items-center gap-2 mb-5">
                    {application.stage === ApplicationStage.SHORTLISTED ? (
                      <Button 
                        variant="outline" 
                        className="flex-1 border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                        onClick={() => setScheduleInterviewOpen(true)}
                      >
                        Schedule Interview
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="flex-1 border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                        onClick={handleMoveToNextStep}
                        disabled={application.stage === ApplicationStage.REJECTED || application.stage === ApplicationStage.HIRED}
                      >
                        Move To Next Stage
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      className="border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white"
                      onClick={handleChatWithApplicant}
                      title="Chat with applicant"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>

                  <div className="h-px bg-[#D6DDEB] mb-5"></div>

                  <div>
                    <h3 className="text-lg font-semibold text-[#25324B] mb-4">Contact</h3>
                    <div className="space-y-4">
                      {application.email && (
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-[#7C8493] mb-0.5">Email</p>
                            <p className="text-sm font-medium text-[#25324B]">{application.email}</p>
                          </div>
                        </div>
                      )}
                      {application.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-[#7C8493] mb-0.5">Phone</p>
                            <p className="text-sm font-medium text-[#25324B]">{application.phone}</p>
                          </div>
                        </div>
                      )}
                      {application.instagram && (
                        <div className="flex items-start gap-3">
                          <Instagram className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-[#7C8493] mb-0.5">Instagram</p>
                            <a href={`https://${application.instagram}`} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-medium text-[#4640DE] hover:underline">
                              {application.instagram}
                            </a>
                          </div>
                        </div>
                      )}
                      {application.twitter && (
                        <div className="flex items-start gap-3">
                          <Twitter className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-[#7C8493] mb-0.5">Twitter</p>
                            <a href={`https://${application.twitter}`} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-medium text-[#4640DE] hover:underline">
                              {application.twitter}
                            </a>
                          </div>
                        </div>
                      )}
                      {application.website && (
                        <div className="flex items-start gap-3">
                          <Globe className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-[#7C8493] mb-0.5">Website</p>
                            <a href={`https://${application.website}`} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-medium text-[#4640DE] hover:underline">
                              {application.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {}
            <div className="col-span-2">
              <Card className="border border-[#D6DDEB] rounded-lg">
                <Tabs defaultValue="profile" className="w-full">
                  <div className="border-b border-[#D6DDEB] px-5">
                    <TabsList className="bg-transparent h-auto p-0">
                      <TabsTrigger value="profile" className="data-[state=active]:border-b-2 data-[state=active]:border-[#4640DE] data-[state=active]:text-[#25324B] !shadow-none rounded-none">
                        Applicant Profile
                      </TabsTrigger>
                      <TabsTrigger value="resume" className="data-[state=active]:border-b-2 data-[state=active]:border-[#4640DE] data-[state=active]:text-[#25324B] !shadow-none rounded-none">
                        Resume
                      </TabsTrigger>
                      <TabsTrigger value="progress" className="data-[state=active]:border-b-2 data-[state=active]:border-[#4640DE] data-[state=active]:text-[#25324B] !shadow-none rounded-none">
                        Hiring Progress
                      </TabsTrigger>
                      <TabsTrigger value="schedule" className="data-[state=active]:border-b-2 data-[state=active]:border-[#4640DE] data-[state=active]:text-[#25324B] !shadow-none rounded-none">
                        Interview Schedules
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="profile" className="p-7 m-0">
                    <div className="mb-7">
                      <h3 className="text-lg font-semibold text-[#25324B] mb-5">Personal Info</h3>
                      <div className="grid grid-cols-2 gap-6 mb-5">
                        <div>
                          <p className="text-sm text-[#7C8493] mb-1">Full Name</p>
                          <p className="text-sm font-medium text-[#25324B]">{application.full_name || application.seeker_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#7C8493] mb-1">Date of Birth</p>
                          <p className="text-sm font-medium text-[#25324B]">
                            {application.date_of_birth ? new Date(application.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#7C8493] mb-1">Gender</p>
                          <p className="text-sm font-medium text-[#25324B]">
                            {application.gender ? application.gender.charAt(0).toUpperCase() + application.gender.slice(1) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-[#7C8493] mb-1">Language</p>
                          <p className="text-sm font-medium text-[#25324B]">{application.languages?.join(', ') || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-[#7C8493] mb-1">Address</p>
                        <p className="text-sm font-medium text-[#25324B]">{application.address || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="h-px bg-[#D6DDEB] mb-7"></div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#25324B] mb-5">Professional Info</h3>
                      {application.about_me && (
                        <div className="mb-5">
                          <p className="text-sm text-[#7C8493] mb-2">About Me</p>
                          <div className="space-y-2">
                            {application.about_me.split('\n').map((paragraph, index) => (
                              <p key={index} className="text-sm font-medium text-[#25324B]">{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-[#7C8493] mb-2">Skill set</p>
                        <div className="flex flex-wrap gap-2">
                          {application.skills && application.skills.length > 0 ? (
                            application.skills.map((skill, index) => (
                              <Badge key={index} variant="outline" className="bg-[#F8F8FD] text-[#4640DE] border-0 px-2.5 py-1 rounded-lg text-xs">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-[#7C8493]">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="resume" className="p-7 m-0">
                    <div className="border border-[#D6DDEB] rounded-lg p-6">
                      {}
                      <div className="flex items-start gap-4 mb-6 pb-6 border-b border-[#D6DDEB]">
                        <Avatar className="w-16 h-16">
                          {application.seeker_avatar ? (
                            <AvatarImage src={application.seeker_avatar} alt={application.seeker_name} />
                          ) : null}
                          <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-lg font-semibold">
                            {getInitials(application.seeker_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-[#25324B] mb-1">
                            {application.full_name || application.seeker_name}
                          </h3>
                          <p className="text-base text-[#25324B] mb-4">
                            {application.seeker_headline || application.current_job || 'Product Designer'}
                          </p>
                          <div className="space-y-1 text-sm text-[#7C8493]">
                            {application.email && <p>{application.email}</p>}
                            {application.phone && <p>{application.phone}</p>}
                            {application.address && <p>{application.address}</p>}
                          </div>
                        </div>
                        {application.resume_url && (
                          <Button
                            variant="outline"
                            className="border-[#CCCCF5] text-[#4640DE]"
                            onClick={() => {
                              if (application.resume_url) {
                                window.open(application.resume_url, '_blank')
                              }
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            View Resume
                          </Button>
                        )}
                      </div>

                      {}
                      {application.cover_letter && (
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-[#25324B] mb-3">Cover Letter</h4>
                          <p className="text-sm text-[#25324B] whitespace-pre-line">{application.cover_letter}</p>
                        </div>
                      )}

                      {}
                      {application.resume_data?.industry_knowledge && application.resume_data.industry_knowledge.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-[#25324B] mb-3">Industry Knowledge</h4>
                          <div className="flex flex-wrap gap-2">
                            {application.resume_data.industry_knowledge.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-[#F8F8FD] text-[#4640DE] border-0 px-3 py-1 rounded-lg text-sm"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {}
                      {application.resume_data?.tools_technologies && application.resume_data.tools_technologies.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-[#25324B] mb-3">Tools & Technologies</h4>
                          <p className="text-sm text-[#7C8493]">
                            {application.resume_data.tools_technologies.join(', ')}
                          </p>
                        </div>
                      )}

                      {}
                      {application.resume_data?.other_skills && application.resume_data.other_skills.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-[#25324B] mb-3">Other Skills</h4>
                          <p className="text-sm text-[#7C8493]">
                            {application.resume_data.other_skills.join(', ')}
                          </p>
                        </div>
                      )}

                      {}
                      {application.languages && application.languages.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-[#25324B] mb-3">Languages</h4>
                          <div className="space-y-1">
                            {application.languages.map((lang, index) => (
                              <p key={index} className="text-sm text-[#7C8493]">{lang}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {}
                      {(application.website || application.instagram || application.twitter) && (
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-[#25324B] mb-3">Social</h4>
                          <div className="space-y-1">
                            {application.website && (
                              <a href={`https://${application.website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4640DE] hover:underline block">
                                {application.website}
                              </a>
                            )}
                            {application.instagram && (
                              <a href={`https://${application.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4640DE] hover:underline block">
                                linkedin.com/in/yourname
                              </a>
                            )}
                            {application.twitter && (
                              <a href={`https://${application.twitter}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#4640DE] hover:underline block">
                                dribbble.com/yourname
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {}
                      {application.resume_data?.experience && application.resume_data.experience.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-base font-semibold text-[#25324B] mb-4 uppercase">experience</h4>
                          <div className="space-y-6">
                            {application.resume_data.experience.map((exp, index) => (
                              <div key={index} className="pb-4 border-b border-[#D6DDEB] last:border-0 last:pb-0">
                                <h5 className="text-base font-semibold text-[#25324B] mb-1">{exp.title}</h5>
                                <p className="text-sm text-[#25324B] mb-1">{exp.company}</p>
                                <p className="text-sm text-[#7C8493] mb-2">
                                  {exp.period}
                                  {exp.location && `, ${exp.location}`}
                                </p>
                                {exp.description && (
                                  <p className="text-sm text-[#7C8493]">{exp.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {}
                      {application.resume_data?.education && application.resume_data.education.length > 0 && (
                        <div>
                          <h4 className="text-base font-semibold text-[#25324B] mb-4 uppercase">education</h4>
                          <div className="space-y-4">
                            {application.resume_data.education.map((edu, index) => (
                              <div key={index}>
                                <h5 className="text-base font-semibold text-[#25324B] mb-1">{edu.degree}</h5>
                                <p className="text-sm text-[#25324B] mb-1">{edu.school}</p>
                                <p className="text-sm text-[#7C8493]">
                                  {edu.period}
                                  {edu.location && `, ${edu.location}`}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="progress" className="p-7 m-0">
                    <div className="space-y-6">
                      {}
                      <div>
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-lg font-semibold text-[#25324B]">Current Stage</h3>
                          {application.stage === 'interview' && (
                            <Button
                              variant="outline"
                              className="border-[#CCCCF5] text-[#4640DE]"
                              onClick={() => setGiveRatingOpen(true)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Give Rating
                            </Button>
                          )}
                        </div>

                        {}
                        {(() => {
                          const stageOrder = ['in-review', 'shortlisted', 'interview', 'hired/declined'] as const
                          const mapStageToIndex: Record<string, number> = {
                            'applied': 0,
                            'shortlisted': 1,
                            'interview': 2,
                            'hired': 3,
                            'rejected': 3,
                          }
                          const activeIndex = mapStageToIndex[application.stage] ?? 0
                          return (
                            <div className="flex items-center gap-2 mb-6">
                              {stageOrder.map((label, idx) => (
                                <div
                                  key={label}
                                  className={`flex-1 rounded-lg px-4 py-3 text-center ${
                                    idx === activeIndex ? 'bg-[#4640DE] text-white' : idx < activeIndex ? 'bg-[#E9EBFD] text-[#4640DE]' : 'bg-[#F8F8FD] text-[#7C8493]'
                                  }`}
                                >
                                  <p className="text-sm font-semibold capitalize">{label}</p>
                                </div>
                              ))}
                            </div>
                          )
                        })()}

                        {}
                        {application.stage !== 'hired' && application.stage !== 'rejected' && (
                          <div className="bg-white border border-[#D6DDEB] rounded-lg p-5">
                            <h4 className="text-base font-semibold text-[#25324B] mb-4">Stage Info</h4>
                            {application.stage === 'interview' ? (
                              <div className="space-y-4">
                                {application.interview_schedule && application.interview_schedule.length > 0 ? (
                                  <div className="space-y-3">
                                    {application.interview_schedule.map((interview) => (
                                      <div key={interview.id} className="border border-[#D6DDEB] rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                          <div>
                                            <p className="text-sm font-semibold text-[#25324B] mb-1">
                                              {interview.interview_type}
                                            </p>
                                            <p className="text-xs text-[#7C8493]">
                                              {interview.interviewer_name} • {new Date(interview.date).toLocaleDateString()} • {interview.time}
                                            </p>
                                          </div>
                                          {interview.status && (
                                            <Badge 
                                              className={`border-0 px-3 py-1 rounded-full text-xs font-semibold ${
                                                interview.status === 'completed' 
                                                  ? 'bg-[#56CDAD]/10 text-[#56CDAD]'
                                                  : interview.status === 'scheduled'
                                                  ? 'bg-[#4640DE]/10 text-[#4640DE]'
                                                  : interview.status === 'cancelled'
                                                  ? 'bg-red-100 text-red-600'
                                                  : 'bg-[#FFB836]/10 text-[#FFB836]'
                                              }`}
                                            >
                                              {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                                            </Badge>
                                          )}
                                        </div>
                                        {interview.feedback && (
                                          <div className="mt-2 pt-2 border-t border-[#D6DDEB]">
                                            <p className="text-xs text-[#7C8493] mb-1">Feedback</p>
                                            <p className="text-sm text-[#25324B]">
                                              <span className="font-semibold">{interview.feedback.reviewer_name}:</span>{' '}
                                              {interview.feedback.comment}
                                              {typeof interview.feedback.rating === 'number' && (
                                                <span className="ml-2 text-[#FFB836]">({interview.feedback.rating}/5)</span>
                                              )}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-sm text-[#7C8493] text-center py-4">No interviews scheduled</p>
                                )}
                                <Button
                                  variant="outline"
                                  className="w-full border-[#CCCCF5] text-[#4640DE] bg-[#F8F8FD]"
                                  onClick={handleMoveToNextStep}
                                >
                                  Move To Next Step
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {application.stage === 'shortlisted' ? (
                                  <Button
                                    variant="outline"
                                    className="w-full border-[#CCCCF5] text-[#4640DE] bg-[#F8F8FD]"
                                    onClick={() => setAddScheduleOpen(true)}
                                  >
                                    Schedule Interview
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    className="w-full border-[#CCCCF5] text-[#4640DE] bg-[#F8F8FD]"
                                    onClick={handleMoveToNextStep}
                                  >
                                    Move To Next Step
                                  </Button> 
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="h-px bg-[#D6DDEB]"></div>

                      {}
                      <div>
                        <div className="space-y-4">
                          {application.hiring_progress?.notes && application.hiring_progress.notes.length > 0 ? (
                            application.hiring_progress.notes.map((note) => (
                              <div key={note.id} className="bg-white border border-[#D6DDEB] rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <Avatar className="w-10 h-10">
                                    {note.author_avatar ? (
                                      <AvatarImage src={note.author_avatar} />
                                    ) : null}
                                    <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-xs">
                                      {getInitials(note.author)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-sm font-semibold text-[#25324B]">{note.author}</span>
                                      <span className="text-xs text-[#7C8493]">{note.date}</span>
                                      <div className="w-1 h-1 rounded-full bg-[#7C8493]"></div>
                                      <span className="text-xs text-[#7C8493]">{note.time}</span>
                                    </div>
                                    <p className="text-sm text-[#25324B] mb-2">{note.content}</p>
                                    {note.replies ? (
                                      <button className="text-sm font-semibold text-[#4640DE] hover:underline">
                                        {note.replies} Replies
                                      </button>
                                    ) : (
                                      <button className="text-sm font-semibold text-[#4640DE] hover:underline">
                                        Reply
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-[#7C8493] text-center py-4">No notes yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="schedule" className="p-7 m-0">
                    <div className="space-y-6">
                      {}
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-[#25324B]">Interview List</h3>
                        {application.interview_schedule && application.interview_schedule.length > 0 && (
                          <Button
                            variant="ghost"
                            className="text-[#4640DE] hover:text-[#4640DE] hover:bg-[#F8F8FD]"
                            onClick={() => setAddScheduleOpen(true)}
                            disabled={application.stage === 'rejected' || application.stage === 'hired'}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Schedule Interview
                          </Button>
                        )}
                      </div>

                      {}
                      <div className="space-y-6">
                        {application.interview_schedule && application.interview_schedule.length > 0 ? (
                          (() => {
                            const grouped = application.interview_schedule.reduce((acc, interview) => {
                              const interviewDate = new Date(interview.date)
                              interviewDate.setHours(0, 0, 0, 0)
                              const today = new Date()
                              today.setHours(0, 0, 0, 0)
                              const tomorrow = new Date(today)
                              tomorrow.setDate(tomorrow.getDate() + 1)
                              
                              let dateLabel: string
                              if (interviewDate.getTime() === tomorrow.getTime()) {
                                dateLabel = `Tomorrow - ${interviewDate.toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}`
                              } else {
                                dateLabel = interviewDate.toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              }
                              
                              if (!acc[dateLabel]) {
                                acc[dateLabel] = []
                              }
                              acc[dateLabel].push(interview)
                              return acc
                            }, {} as Record<string, typeof application.interview_schedule>)

                            return Object.entries(grouped).map(([date, interviews]) => (
                              <div key={date} className="space-y-3">
                                <p className="text-sm text-[#7C8493]">{date}</p>
                                {interviews.map((interview) => (
                                  <div
                                    key={interview.id}
                                    className="bg-white border border-[#D6DDEB] rounded-lg p-4 flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-4 flex-1">
                                      <Avatar className="w-12 h-12">
                                        {interview.interviewer_avatar ? (
                                          <AvatarImage src={interview.interviewer_avatar} />
                                        ) : null}
                                        <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE]">
                                          {getInitials(interview.interviewer_name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <h4 className="text-base font-semibold text-[#25324B] mb-1">
                                          {interview.interviewer_name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          <p className="text-sm text-[#7C8493]">{interview.interview_type}</p>
                                          {interview.status && (
                                            <Badge className="bg-[#F8F8FD] text-[#4640DE] border-0 px-2 py-0.5 rounded-full text-xs">
                                              {interview.status}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <Clock className="w-4 h-4 text-[#7C8493]" />
                                          <p className="text-sm font-medium text-[#25324B]">{interview.time}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <MapPin className="w-4 h-4 text-[#7C8493]" />
                                          <p className="text-sm text-[#7C8493]">{interview.location}</p>
                                        </div>
                                        {interview.feedback && (
                                          <div className="mt-2 rounded-md bg-[#F8F8FD] border border-[#E6EAF5] p-3">
                                            <p className="text-xs text-[#7C8493] mb-1">Feedback</p>
                                            <p className="text-sm text-[#25324B]">
                                              <span className="font-semibold">{interview.feedback.reviewer_name}:</span>{' '}
                                              {interview.feedback.comment}
                                              {typeof interview.feedback.rating === 'number' && (
                                                <span className="ml-2 text-[#FFB836]">({interview.feedback.rating}/5)</span>
                                              )}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {!interview.feedback && interview.status === 'completed' && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="border-[#CCCCF5] text-[#4640DE]"
                                          onClick={() => {
                                            setSelectedInterviewId(interview.id)
                                            setAddFeedbackOpen(true)
                                          }}
                                        >
                                          <Plus className="w-4 h-4 mr-2" />
                                          Add Feedback
                                        </Button>
                                      )}
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="outline" size="sm" className="border-[#CCCCF5] text-[#4640DE]">
                                            <MoreHorizontal className="w-4 h-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          {interview.status !== 'completed' && interview.status !== 'cancelled' ? (
                                            <>
                                              <DropdownMenuItem onClick={() => handleOpenEditSchedule(interview)}>Edit Schedule</DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => handleCancelInterview(interview.id)}>Cancel Interview</DropdownMenuItem>
                                              <DropdownMenuItem onClick={() => handleMarkAsCompleted(interview.id)}>Mark as Completed</DropdownMenuItem>
                                            </>
                                          ) : (
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))
                          })()
                        ) : (
                          <div className="text-center py-10">
                            <p className="text-sm text-[#7C8493] mb-4">No interview schedules yet</p>
                            <Button
                              variant="outline"
                              className="border-[#CCCCF5] text-[#4640DE]"
                              onClick={() => setAddScheduleOpen(true)}
                              disabled={application.stage === 'rejected' || application.stage === 'hired'}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Schedule Interview
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {}
      <Dialog open={scheduleInterviewOpen} onOpenChange={setScheduleInterviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Schedule an interview for {application?.seeker_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Interview Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={scheduleForm.location}
                onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                placeholder="Enter interview location"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interviewType">Interview Type</Label>
                <Select value={scheduleForm.interviewType} onValueChange={(value) => setScheduleForm({ ...scheduleForm, interviewType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Interview</SelectItem>
                    <SelectItem value="video">Video Interview</SelectItem>
                    <SelectItem value="onsite">On-site Interview</SelectItem>
                    <SelectItem value="written">Written Test</SelectItem>
                    <SelectItem value="skill">Skill Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="interviewer">Interviewer</Label>
                <Input
                  id="interviewer"
                  value={scheduleForm.interviewer}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, interviewer: e.target.value })}
                  placeholder="Interviewer name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                placeholder="Additional notes (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleInterviewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleInterview} className="bg-[#4640DE] hover:bg-[#4640DE]/90">
              Schedule Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={giveRatingOpen} onOpenChange={setGiveRatingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Give Rating</DialogTitle>
            <DialogDescription>
              Rate the applicant's performance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-center block">Rating</Label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingForm({ rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= ratingForm.rating
                          ? 'text-[#FFB836] fill-[#FFB836]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {ratingForm.rating > 0 && (
                <p className="text-center text-sm text-[#7C8493] mt-2">
                  {ratingForm.rating} out of 5 stars
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setGiveRatingOpen(false)
              setRatingForm({ rating: 0 })
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleGiveRating} 
              className="bg-[#4640DE] hover:bg-[#4640DE]/90"
              disabled={ratingForm.rating === 0}
            >
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Schedule Interview Modal */}
      <Dialog open={addScheduleOpen} onOpenChange={setAddScheduleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Schedule Interview</DialogTitle>
            <DialogDescription>
              Schedule a new interview for {application?.seeker_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleDate">Interview Date</Label>
                <Input
                  id="scheduleDate"
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleTime">Time</Label>
                <Input
                  id="scheduleTime"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleLocation">Location</Label>
              <Input
                id="scheduleLocation"
                value={scheduleForm.location}
                onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                placeholder="Enter interview location"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduleType">Interview Type</Label>
                <Select value={scheduleForm.interviewType} onValueChange={(value) => setScheduleForm({ ...scheduleForm, interviewType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Interview</SelectItem>
                    <SelectItem value="video">Video Interview</SelectItem>
                    <SelectItem value="onsite">On-site Interview</SelectItem>
                    <SelectItem value="written">Written Test</SelectItem>
                    <SelectItem value="skill">Skill Test</SelectItem>
                    <SelectItem value="final">Final Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduleInterviewer">Interviewer</Label>
                <Input
                  id="scheduleInterviewer"
                  value={scheduleForm.interviewer}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, interviewer: e.target.value })}
                  placeholder="Interviewer name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="scheduleNotes">Notes</Label>
              <Textarea
                id="scheduleNotes"
                value={scheduleForm.notes}
                onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                placeholder="Additional notes (optional)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddScheduleOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleAddSchedule(application?.stage === 'shortlisted')} 
              className="bg-[#4640DE] hover:bg-[#4640DE]/90"
            >
              {application?.stage === 'shortlisted' ? 'Schedule & Move to Interview' : 'Add Schedule'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Schedule Interview Modal */}
      <Dialog open={editScheduleOpen} onOpenChange={setEditScheduleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Interview Schedule</DialogTitle>
            <DialogDescription>
              Update interview details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editDate">Interview Date</Label>
                <Input
                  id="editDate"
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editTime">Time</Label>
                <Input
                  id="editTime"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="editLocation">Location</Label>
              <Input
                id="editLocation"
                value={scheduleForm.location}
                onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                placeholder="Enter interview location"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editType">Interview Type</Label>
                <Select value={scheduleForm.interviewType} onValueChange={(value) => setScheduleForm({ ...scheduleForm, interviewType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone Interview</SelectItem>
                    <SelectItem value="video">Video Interview</SelectItem>
                    <SelectItem value="onsite">On-site Interview</SelectItem>
                    <SelectItem value="written">Written Test</SelectItem>
                    <SelectItem value="skill">Skill Test</SelectItem>
                    <SelectItem value="final">Final Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editInterviewer">Interviewer</Label>
                <Input
                  id="editInterviewer"
                  value={scheduleForm.interviewer}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, interviewer: e.target.value })}
                  placeholder="Interviewer name"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSchedule} className="bg-[#4640DE] hover:bg-[#4640DE]/90">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Feedback Modal */}
      <Dialog open={addFeedbackOpen} onOpenChange={setAddFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Feedback</DialogTitle>
            <DialogDescription>
              Add feedback for this interview
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={feedbackForm.feedback}
                onChange={(e) => setFeedbackForm({ feedback: e.target.value })}
                placeholder="Enter your feedback..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFeedback} className="bg-[#4640DE] hover:bg-[#4640DE]/90">
              Add Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move To Next Step Confirmation */}
      <ConfirmationDialog
        isOpen={moveToNextStepOpen}
        onClose={() => setMoveToNextStepOpen(false)}
        onConfirm={handleMoveToNextStepConfirm}
        title="Move To Next Step"
        description="Are you sure you want to move this application to the next stage?"
        confirmText="Move"
        cancelText="Cancel"
      />

      {/* Hire/Reject Dialog */}
      <Dialog open={hireRejectDialogOpen} onOpenChange={setHireRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Final Decision</DialogTitle>
            <DialogDescription>
              Make your final decision for this application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-[#7C8493]">
              Would you like to hire this candidate or reject the application?
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setRejectApplicationOpen(true)
                setHireRejectDialogOpen(false)
              }}
            >
              Reject
            </Button>
            <Button 
              onClick={handleHire} 
              className="bg-[#56CDAD] hover:bg-[#56CDAD]/90 text-white"
            >
              Hire
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Application Modal */}
      <Dialog open={rejectApplicationOpen} onOpenChange={setRejectApplicationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rejectReason">Reason</Label>
              <Textarea
                id="rejectReason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectApplicationOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRejectApplication} 
              variant="destructive"
              disabled={!rejectReason.trim()}
            >
              Reject Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Modal */}
      <Dialog open={sendMessageOpen} onOpenChange={setSendMessageOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {application?.seeker_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={messageForm.subject}
                onChange={(e) => setMessageForm({ ...messageForm, subject: e.target.value })}
                placeholder="Message subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={messageForm.message}
                onChange={(e) => setMessageForm({ ...messageForm, message: e.target.value })}
                placeholder="Enter your message..."
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendMessageOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} className="bg-[#4640DE] hover:bg-[#4640DE]/90">
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CompanyLayout>
  )
}

export default ApplicationDetails

