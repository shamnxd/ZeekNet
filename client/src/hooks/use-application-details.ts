
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { jobApplicationApi } from '@/api';
import { chatApi } from '@/api/chat.api';
import type { ApplicationDetails as ApplicationDetailsData } from '@/interfaces/application/application-details.interface';
import type { ApiError } from '@/types/api-error.type';
import { ApplicationStage } from '@/constants/enums';

export const useApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  
  const [scheduleInterviewOpen, setScheduleInterviewOpen] = useState(false);
  const [giveRatingOpen, setGiveRatingOpen] = useState(false);
  const [addScheduleOpen, setAddScheduleOpen] = useState(false);
  const [addFeedbackOpen, setAddFeedbackOpen] = useState(false);
  const [editScheduleOpen, setEditScheduleOpen] = useState(false);
  const [moveToNextStepOpen, setMoveToNextStepOpen] = useState(false);
  const [rejectApplicationOpen, setRejectApplicationOpen] = useState(false);
  const [sendMessageOpen, setSendMessageOpen] = useState(false);
  const [hireRejectDialogOpen, setHireRejectDialogOpen] = useState(false);

  
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);

  
  const [scheduleForm, setScheduleForm] = useState({
    date: '', time: '', location: '', interviewType: '', notes: ''
  });
  const [ratingForm, setRatingForm] = useState({ rating: 0 });
  const [feedbackForm, setFeedbackForm] = useState({ feedback: '' });
  const [messageForm, setMessageForm] = useState({ subject: '', message: '' });
  const [rejectReason, setRejectReason] = useState('');



  const fetchApplicationDetails = useCallback(async () => {
    if (!id) {
      toast.error('Application ID not found');
      navigate('/company/applicants');
      return;
    }
    try {
      setLoading(true);
      const res = await jobApplicationApi.getCompanyApplicationById(id);
      const a = res?.data?.data || res?.data;
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
        interview_schedule: (a.interviews || []).map((iv: Record<string, unknown>) => ({
          id: String(iv.id || ''), date: String(iv.date || ''),
          interviewer_avatar: undefined, interview_type: String(iv.interview_type || ''),
          time: String(iv.time || ''), location: String(iv.location || ''), 
          status: (iv.status as 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | undefined), 
          feedback: (iv.feedback as { reviewer_name: string; rating?: number; comment: string; reviewed_at: string } | undefined)
        })),
        
        hiring_progress: a.hiring_progress || { notes: [] }
      };
      setApplication(mapped);
    } catch {
      toast.error('Failed to load application details');
      navigate('/company/applicants');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchApplicationDetails();
  }, [fetchApplicationDetails]);

  const reload = async () => {
    if (!id) return;
    try {
      const res = await jobApplicationApi.getCompanyApplicationById(id);
      const a = res?.data?.data || res?.data;
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
        interview_schedule: (a.interviews || []).map((iv: Record<string, unknown>) => ({
          id: String(iv.id || ''), date: String(iv.date || ''),
          interviewer_avatar: undefined, interview_type: String(iv.interview_type || ''),
          time: String(iv.time || ''), location: String(iv.location || ''), 
          status: (iv.status as 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | undefined), 
          feedback: (iv.feedback as { reviewer_name: string; rating?: number; comment: string; reviewed_at: string } | undefined)
        })),
         hiring_progress: a.hiring_progress || { notes: [] }
      };
      setApplication(mapped);
    } catch { }
  };

  const handleScheduleInterview = () => {
    toast.success('Interview scheduled successfully');
    setScheduleInterviewOpen(false);
    setScheduleForm({ date: '', time: '', location: '', interviewType: '', notes: '' });
  };

  const handleGiveRating = async () => {
    if (!id || ratingForm.rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    try {
      await jobApplicationApi.updateApplicationScore(id, { score: ratingForm.rating });
      toast.success('Rating submitted successfully');
      await reload();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update score');
    }
    setGiveRatingOpen(false);
    setRatingForm({ rating: 0 });
  };

  const handleAddSchedule = async (moveToInterview = false) => {
    if (!id) return;
    try {
      await jobApplicationApi.addInterview(id, {
        date: scheduleForm.date, time: scheduleForm.time, location: scheduleForm.location,
        interview_type: scheduleForm.interviewType,
      });
      toast.success('Interview schedule added successfully');

      if (moveToInterview && application?.stage === 'shortlisted') {
        try {
          await jobApplicationApi.updateApplicationStage(id, { stage: 'interview' });
          toast.success('Application moved to interview stage');
        } catch (error: unknown) {
          const apiError = error as ApiError;
          toast.error(apiError?.response?.data?.message || 'Failed to update stage');
        }
      }
      
      await reload();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to add interview');
    }
    setAddScheduleOpen(false);
    setScheduleForm({ date: '', time: '', location: '', interviewType: '', notes: '' });
  };

  const handleOpenEditSchedule = (iv: { id: string; date: string; time?: string; location?: string; interview_type?: string }) => {
    setSelectedInterviewId(iv.id);
    setScheduleForm({
      date: iv.date ? String(iv.date).slice(0, 10) : '',
      time: iv.time || '', location: iv.location || '',
      interviewType: iv.interview_type || '', notes: '',
    });
    setEditScheduleOpen(true);
  };

  const handleUpdateSchedule = async () => {
    if (!id || !selectedInterviewId) return;
    try {
      await jobApplicationApi.updateInterview(id, selectedInterviewId, {
        date: scheduleForm.date, time: scheduleForm.time, location: scheduleForm.location,
        interview_type: scheduleForm.interviewType,
      });
      toast.success('Interview updated successfully');
      await reload();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update interview');
    }
    setEditScheduleOpen(false);
    setSelectedInterviewId(null);
  };

  const handleCancelInterview = async (interviewId: string) => {
    if (!id) return;
    try {
      await jobApplicationApi.deleteInterview(id, interviewId);
      toast.success('Interview cancelled');
      await reload();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to cancel interview');
    }
  };

  const handleMarkAsCompleted = async (interviewId: string) => {
    if (!id) return;
    try {
      const interview = application?.interview_schedule?.find((iv) => iv.id === interviewId);
      if (!interview) return;

      await jobApplicationApi.updateInterview(id, interviewId, {
        date: interview.date,
        time: interview.time,
        location: interview.location,
        interview_type: interview.interview_type,
        status: 'completed',
      });
      toast.success('Interview marked as completed');
      await reload();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to mark interview as completed');
    }
  };

  const handleAddFeedback = async () => {
    if (!id || !selectedInterviewId) return;
    try {
      await jobApplicationApi.addInterviewFeedback(id, selectedInterviewId, {
        reviewer_name: 'Reviewer', comment: feedbackForm.feedback,
      });
      toast.success('Feedback added successfully');
      await reload();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to add feedback');
    }
    setAddFeedbackOpen(false);
    setFeedbackForm({ feedback: '' });
    setSelectedInterviewId(null);
  };

  const handleMoveToNextStep = () => {
    if (!application) return;

    if (application.stage === ApplicationStage.SHORTLISTED) {
      setMoveToNextStepOpen(false);
      setAddScheduleOpen(true);
      return;
    }

    if (application.stage === ApplicationStage.INTERVIEW) {
      setMoveToNextStepOpen(false);
      setHireRejectDialogOpen(true);
      return;
    }

    setMoveToNextStepOpen(true);
  };

  const handleMoveToNextStepConfirm = async () => {
    if (!id || !application) return;
    const nextMap: Record<string, string> = {
      [ApplicationStage.APPLIED]: ApplicationStage.SHORTLISTED,
      [ApplicationStage.SHORTLISTED]: ApplicationStage.INTERVIEW,
      [ApplicationStage.INTERVIEW]: ApplicationStage.HIRED,
      [ApplicationStage.REJECTED]: ApplicationStage.REJECTED,
      [ApplicationStage.HIRED]: ApplicationStage.HIRED,
    };
    const next = nextMap[application.stage] || ApplicationStage.SHORTLISTED;
    try {
      await jobApplicationApi.updateApplicationStage(id, { stage: next as ApplicationStage });
      toast.success('Application moved to next step');
      await reload();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update stage');
    }
    setMoveToNextStepOpen(false);
  };

  const handleHire = async () => {
    if (!id) return;
    try {
      await jobApplicationApi.updateApplicationStage(id, { stage: ApplicationStage.HIRED });
      toast.success('Application moved to hired stage');
      await reload();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to update stage');
    }
    setHireRejectDialogOpen(false);
  };

  const handleRejectApplication = async () => {
    if (!id) return;
    try {
      await jobApplicationApi.updateApplicationStage(id, { stage: ApplicationStage.REJECTED, rejection_reason: rejectReason });
      toast.success('Application rejected');
      await reload();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Failed to reject application');
    }
    setRejectApplicationOpen(false);
    setRejectReason('');
  };

  const handleSendMessage = () => {
    toast.success('Message sent successfully');
    setSendMessageOpen(false);
    setMessageForm({ subject: '', message: '' });
  };

  const handleChatWithApplicant = async () => {
    if (!application?.seeker_id) return;
    try {
      const conversation = await chatApi.createConversation({ participantId: application.seeker_id });
      navigate(`/company/messages?chat=${conversation.id}`);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      toast.error(apiError?.response?.data?.message || 'Unable to start chat');
    }
  };

  return {
    
    application,
    loading,
    
    
    scheduleInterviewOpen, setScheduleInterviewOpen,
    giveRatingOpen, setGiveRatingOpen,
    addScheduleOpen, setAddScheduleOpen,
    addFeedbackOpen, setAddFeedbackOpen,
    editScheduleOpen, setEditScheduleOpen,
    moveToNextStepOpen, setMoveToNextStepOpen,
    rejectApplicationOpen, setRejectApplicationOpen,
    sendMessageOpen, setSendMessageOpen,
    hireRejectDialogOpen, setHireRejectDialogOpen,

    
    selectedInterviewId, setSelectedInterviewId,

    
    scheduleForm, setScheduleForm,
    ratingForm, setRatingForm,
    feedbackForm, setFeedbackForm,
    messageForm, setMessageForm,
    rejectReason, setRejectReason,

    
    handleScheduleInterview,
    handleGiveRating,
    handleAddSchedule,
    handleOpenEditSchedule,
    handleUpdateSchedule,
    handleCancelInterview,
    handleMarkAsCompleted,
    handleAddFeedback,
    handleMoveToNextStep,
    handleMoveToNextStepConfirm,
    handleHire,
    handleRejectApplication,
    handleSendMessage,
    handleChatWithApplicant,
    
    
    reload,
  };
};
