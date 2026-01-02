
import { useNavigate } from 'react-router-dom';
import CompanyLayout from '../../components/layouts/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { ArrowLeft } from 'lucide-react';
import { useApplicationDetails } from '@/hooks/use-application-details';
import { ApplicationSidebar } from '@/components/company/application/ApplicationSidebar';
import { ApplicationTabs } from '@/components/company/application/ApplicationTabs';
import { ApplicationModals } from '@/components/company/application/ApplicationModals';

const ApplicationDetails = () => {
  const navigate = useNavigate();
  const {
    
    application,
    loading,

    
    setScheduleInterviewOpen,
    setGiveRatingOpen,
    setAddScheduleOpen,
    setEditScheduleOpen,
    setAddFeedbackOpen,
    setMoveToNextStepOpen,
    setHireRejectDialogOpen,
    setRejectApplicationOpen,
    setSendMessageOpen,
    setSelectedInterviewId,

    
    scheduleForm, setScheduleForm,
    ratingForm, setRatingForm,
    feedbackForm, setFeedbackForm,
    rejectReason, setRejectReason,
    messageForm, setMessageForm,

    
    scheduleInterviewOpen,
    giveRatingOpen,
    addScheduleOpen,
    editScheduleOpen,
    addFeedbackOpen,
    moveToNextStepOpen,
    hireRejectDialogOpen,
    rejectApplicationOpen,
    sendMessageOpen,

    
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
  } = useApplicationDetails();

  if (loading) {
    return (
      <CompanyLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loading />
        </div>
      </CompanyLayout>
    );
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
    );
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
              <ApplicationSidebar
                application={application}
                onScheduleInterview={() => setScheduleInterviewOpen(true)}
                onMoveToNextStep={handleMoveToNextStep}
                onChat={handleChatWithApplicant}
              />
            </div>

            {}
            <div className="col-span-2">
              <ApplicationTabs
                application={application}
                onGiveRating={() => setGiveRatingOpen(true)}
                onAddSchedule={() => setAddScheduleOpen(true)}
                onMoveToNextStep={handleMoveToNextStep}
                onAddFeedback={(id) => {
                  setSelectedInterviewId(id);
                  setAddFeedbackOpen(true);
                }}
                onEditSchedule={handleOpenEditSchedule}
                onCancelInterview={handleCancelInterview}
                onMarkAsCompleted={handleMarkAsCompleted}
              />
            </div>
          </div>
        </div>
      </div>

      {}
      <ApplicationModals
        application={application}
        scheduleInterviewOpen={scheduleInterviewOpen} setScheduleInterviewOpen={setScheduleInterviewOpen}
        giveRatingOpen={giveRatingOpen} setGiveRatingOpen={setGiveRatingOpen}
        addScheduleOpen={addScheduleOpen} setAddScheduleOpen={setAddScheduleOpen}
        editScheduleOpen={editScheduleOpen} setEditScheduleOpen={setEditScheduleOpen}
        addFeedbackOpen={addFeedbackOpen} setAddFeedbackOpen={setAddFeedbackOpen}
        moveToNextStepOpen={moveToNextStepOpen} setMoveToNextStepOpen={setMoveToNextStepOpen}
        hireRejectDialogOpen={hireRejectDialogOpen} setHireRejectDialogOpen={setHireRejectDialogOpen}
        rejectApplicationOpen={rejectApplicationOpen} setRejectApplicationOpen={setRejectApplicationOpen}
        sendMessageOpen={sendMessageOpen} setSendMessageOpen={setSendMessageOpen}

        scheduleForm={scheduleForm} setScheduleForm={setScheduleForm}
        ratingForm={ratingForm} setRatingForm={setRatingForm}
        feedbackForm={feedbackForm} setFeedbackForm={setFeedbackForm}
        rejectReason={rejectReason} setRejectReason={setRejectReason}
        messageForm={messageForm} setMessageForm={setMessageForm}

        handleScheduleInterview={handleScheduleInterview}
        handleGiveRating={handleGiveRating}
        handleAddSchedule={handleAddSchedule}
        handleUpdateSchedule={handleUpdateSchedule}
        handleAddFeedback={handleAddFeedback}
        handleMoveToNextStepConfirm={handleMoveToNextStepConfirm}
        handleHire={handleHire}
        handleRejectApplication={handleRejectApplication}
        handleSendMessage={handleSendMessage}
      />
    </CompanyLayout>
  );
};

export default ApplicationDetails;
