
import CompanyLayout from '../../components/layouts/CompanyLayout';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { useJobDetails } from '@/hooks/use-job-details';
import { JobHeader } from '@/components/company/job/details/JobHeader';
import { JobTabs } from '@/components/company/job/details/JobTabs';
import { JobStatusAlert } from '@/components/company/job/details/JobStatusAlert';
import { JobApplicantsTab } from '@/components/company/job/details/JobApplicantsTab';
import { JobDetailsTab } from '@/components/company/job/details/JobDetailsTab';

const JobDetails = () => {
  const {
    id,
    navigate,
    jobData,
    loading,
    activeTab,
    setActiveTab,
    searchTerm,
    setSearchTerm,
    stageFilter,
    setStageFilter,
    applicationsLoading,
    filteredApplicants,
    normalizeStage,
    stageCounts,
    getEmploymentType,
    formatSalary,
    formatDate,
  } = useJobDetails();

  if (loading) {
    return (
      <CompanyLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loading />
        </div>
      </CompanyLayout>
    );
  }

  if (!jobData) {
    return (
      <CompanyLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Job not found</h2>
            <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/company/job-listing')}>
              Back to Job Listings
            </Button>
          </div>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <div className="min-h-screen bg-white">
        <JobHeader
          jobData={jobData}
          onBack={() => navigate('/company/job-listing')}
          employmentType={getEmploymentType()}
        />

        <JobTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <JobStatusAlert jobData={jobData} />

        <div className="px-7 py-7">
          {activeTab === 'applicants' && (
            <JobApplicantsTab
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              stageFilter={stageFilter}
              setStageFilter={setStageFilter}
              applicationsLoading={applicationsLoading}
              filteredApplicants={filteredApplicants}
              onViewApplication={(applicantId) => navigate(`/company/applicants/${applicantId}`)}
              formatDate={formatDate}
              normalizeStage={normalizeStage}
            />
          )}

          {activeTab === 'details' && (
            <JobDetailsTab
              jobData={jobData}
              stageCounts={stageCounts}
              employmentType={getEmploymentType()}
              formattedSalary={formatSalary()}
              onEdit={() => navigate(`/company/edit-job/${id}`)}
              formatDate={formatDate}
            />
          )}


        </div>
      </div>
    </CompanyLayout>
  );
};

export default JobDetails;