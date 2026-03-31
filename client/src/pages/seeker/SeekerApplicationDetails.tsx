
import SeekerLayout from '@/components/layouts/SeekerLayout';
import { Button } from '@/components/ui/button';
import { useSeekerApplicationDetails } from '@/hooks/use-seeker-application-details';
import { SeekerApplicationHeader } from '@/components/seeker/application/details/SeekerApplicationHeader';
import { SeekerHiringProgress } from '@/components/seeker/application/details/SeekerHiringProgress';
import { SeekerOfferList } from '@/components/seeker/application/details/SeekerOfferList';
import { SeekerTaskList } from '@/components/seeker/application/details/SeekerTaskList';
import { SeekerInterviewList } from '@/components/seeker/application/details/SeekerInterviewList';
import { SeekerCompensationMeetingList } from '@/components/seeker/application/details/SeekerCompensationMeetingList';
import { SeekerCompensationComments } from '@/components/seeker/application/details/SeekerCompensationComments';
import { SeekerApplicationSidebar } from '@/components/seeker/application/details/SeekerApplicationSidebar';
import { SeekerApplicationModals } from '@/components/seeker/application/details/SeekerApplicationModals';
import { ATSStage } from '@/constants/ats-stages';
import { ATSStage as ATSStageType } from '@/constants/ats-stages';

const SeekerApplicationDetails = () => {
  const {
    id,
    navigate,
    loading,
    application,
    technicalTasks,
    interviews,
    offers,
    compensationMeetings,
    comments,


    showSubmissionModal,
    setShowSubmissionModal,
    selectedTask,
    setSelectedTask,

    showSignedDocumentModal,
    setShowSignedDocumentModal,
    selectedOffer,
    setSelectedOffer,
    selectedFile,
    setSelectedFile,
    uploading,
    showDeclineConfirmDialog,
    setShowDeclineConfirmDialog,
    setOfferToDecline,
    declining,


    handleSubmitTask,
    handleUploadSignedDocument,
    handleDeclineOffer,


    formatDateTime,
    formatDate
  } = useSeekerApplicationDetails();

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
    );
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
    );
  }

  const stageValue = typeof application?.stage === 'string' ? application.stage : 'APPLIED';
  const currentStage = stageValue as ATSStageType;

  return (
    <SeekerLayout>
      <div className="px-8 xl:px-11 py-9 space-y-6 bg-[#f8f9ff] min-h-screen">
        <SeekerApplicationHeader
          jobTitle={String(application?.job_title || application?.jobTitle || '')}
          onBack={() => navigate('/seeker/applications')}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SeekerHiringProgress
              application={application}
              interviews={interviews}
              formatDate={formatDate}
            />

            {(offers.length > 0 || currentStage === ATSStage.OFFER) && (
              <SeekerOfferList
                offers={offers}
                onAccept={(offer) => {
                  setSelectedOffer(offer);
                  setShowSignedDocumentModal(true);
                }}
                onDecline={(offerId) => {
                  if (!id) return;
                  setOfferToDecline({ applicationId: id, offerId });
                  setShowDeclineConfirmDialog(true);
                }}
                onUploadSigned={(offer) => {
                  setSelectedOffer(offer);
                  setShowSignedDocumentModal(true);
                }}
                formatDateTime={formatDateTime}
              />
            )}

            <SeekerCompensationComments
              comments={comments}
              formatDateTime={formatDateTime}
            />

            <SeekerCompensationMeetingList
              compensationMeetings={compensationMeetings}
              formatDateTime={formatDateTime}
            />

            <SeekerTaskList
              technicalTasks={technicalTasks}
              onTaskSubmit={(task) => {
                setSelectedTask(task);
                setShowSubmissionModal(true);
              }}
              formatDate={formatDate}
              formatDateTime={formatDateTime}
            />

            <SeekerInterviewList
              interviews={interviews}
              formatDateTime={formatDateTime}
            />
          </div>

          <SeekerApplicationSidebar application={application} />
        </div>
      </div>

      <SeekerApplicationModals
        selectedTask={selectedTask}
        showSubmissionModal={showSubmissionModal}
        setShowSubmissionModal={setShowSubmissionModal}
        setSelectedTask={setSelectedTask}
        onSubmitTask={handleSubmitTask}

        showSignedDocumentModal={showSignedDocumentModal}
        setShowSignedDocumentModal={setShowSignedDocumentModal}
        selectedOffer={selectedOffer}
        setSelectedOffer={setSelectedOffer}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        uploading={uploading}
        onUploadSigned={handleUploadSignedDocument}

        showDeclineConfirmDialog={showDeclineConfirmDialog}
        setShowDeclineConfirmDialog={setShowDeclineConfirmDialog}
        setOfferToDecline={setOfferToDecline}
        declining={declining}
        onDeclineConfirm={handleDeclineOffer}
      />
    </SeekerLayout>
  );
};

export default SeekerApplicationDetails;