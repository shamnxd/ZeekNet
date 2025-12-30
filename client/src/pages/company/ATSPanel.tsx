import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CompanyLayout from '@/components/layouts/CompanyLayout';
import { ATSStage, STAGE_COLORS, ATSStageDisplayNames, SubStageDisplayNames } from '@/constants/ats-stages';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Briefcase, Loader2 } from 'lucide-react';
import { companyApi } from '@/api/company.api';
import type { JobPostingResponse } from '@/interfaces/job/job-posting-response.interface';
import type { ApplicationsKanbanResponse, ApplicationKanbanItem } from '@/interfaces/ats/ats-pipeline.interface';

const ATSPanel = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<JobPostingResponse[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');
  const [enabledStages, setEnabledStages] = useState<ATSStage[]>([]);
  const [applicationsByStage, setApplicationsByStage] = useState<ApplicationsKanbanResponse>({});
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedJob = jobs.find(job => job.id === selectedJobId);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const response = await companyApi.getJobPostings({ limit: 100 });
        if (response.data && response.data.jobs) {
          // Filter only active jobs
          const activeJobs = response.data.jobs.filter(job => job.status === 'active');
          setJobs(activeJobs);

          // Construct URL param handling
          const jobIdParam = searchParams.get('jobId');
          if (jobIdParam) {
            setSelectedJobId(jobIdParam);
          } else if (activeJobs.length > 0) {
            // Optionally select first job, or leave empty
          }
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoadingJobs(false);
      }
    };
    fetchJobs();
  }, [searchParams]);

  useEffect(() => {
    const fetchPipelineAndApps = async () => {
      if (!selectedJobId) {
        setApplicationsByStage({});
        setEnabledStages([]);
        return;
      }

      try {
        setLoadingApps(true);

        // Fetch pipeline config and applications in parallel
        const [pipelineResponse, applicationsResponse] = await Promise.all([
          companyApi.getJobATSPipeline(selectedJobId),
          companyApi.getJobApplicationsForKanban(selectedJobId),
        ]);

        if (pipelineResponse.data) {
          setEnabledStages(pipelineResponse.data.enabledStages as ATSStage[]);
        }

        if (applicationsResponse.data) {
          setApplicationsByStage(applicationsResponse.data);
        }
      } catch (error) {
        console.error("Failed to fetch pipeline or applications", error);
        setApplicationsByStage({});
        setEnabledStages([]);
      } finally {
        setLoadingApps(false);
      }
    };

    if (selectedJobId) {
      // Update URL
      setSearchParams({ jobId: selectedJobId });
      fetchPipelineAndApps();
    }
  }, [selectedJobId, setSearchParams]);


  const getCandidatesByStage = (stage: ATSStage): ApplicationKanbanItem[] => {
    if (!selectedJobId) return [];

    const stageApps = applicationsByStage[stage] || [];

    if (searchTerm === '') return stageApps;

    return stageApps.filter(app =>
      (app.seekerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleStageClick = (stage: ATSStage) => {
    if (!selectedJobId) return;
    navigate(`/company/ats/stage/${encodeURIComponent(stage)}?jobId=${selectedJobId}`);
  };

  const handleCandidateClick = (candidateId: string) => {
    // Navigate to the candidate profile view we just updated
    // Use the application ID as the candidate identifier for ATS view if needed, 
    // or pass both context.
    // Based on CandidateProfileView logic: "/ats/candidate/:id"
    navigate(`/company/ats/candidate/${candidateId}`);
  };

  if (loadingJobs) {
    return (
      <CompanyLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ATS Pipeline</h1>
            <p className="text-gray-500 text-sm mt-0.5">Track candidates through your hiring process</p>
          </div>
        </div>

        {/* Job Selector */}
        <div className="bg-white rounded-lg mb-8 mt-6">
          <label className="block text-xs font-semibold text-gray-900 mb-2">
            Select Job
          </label>

          <div className="flex items-center justify-between gap-4">

            {/* Custom Dropdown */}
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => {
                  const dropdown = document.getElementById('job-dropdown');
                  if (dropdown) {
                    dropdown.classList.toggle('hidden');
                  }
                }}
                className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4640DE] focus:border-[#4640DE] text-xs bg-white font-medium text-left hover:border-gray-400 transition-colors flex items-center justify-between group"
              >
                <span className={selectedJob ? 'text-gray-900' : 'text-gray-400'}>
                  {selectedJob ? selectedJob.title : 'Select a job to view its ATS pipeline'}
                </span>
                <svg
                  className="w-4 h-4 text-[#4640DE] group-hover:translate-y-0.5 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown List */}
              <div
                id="job-dropdown"
                className="hidden absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto"
              >
                {jobs.map((job) => {
                  const isSelected = selectedJobId === job.id;

                  return (
                    <div
                      key={job.id}
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setSearchTerm('');
                        const dropdown = document.getElementById('job-dropdown');
                        if (dropdown) dropdown.classList.add('hidden');
                      }}
                      className={`px-2.5 py-1.5 cursor-pointer transition-all border-b border-gray-100 last:border-b-0 ${isSelected
                        ? 'bg-[#4640DE] bg-opacity-10 border-l-4 border-l-[#4640DE]'
                        : 'hover:bg-gray-50 hover:border-l-4 hover:border-l-[#4640DE]/30'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className={`font-medium text-[11px] ${isSelected ? '!text-white' : '!text-gray-900'}`}>
                            {job.title}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 ml-2">
                          <div className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isSelected
                            ? 'bg-[#4640DE] text-white'
                            : 'bg-gray-100 text-gray-700'
                            }`}>
                            {job.application_count || job.applicationCount || job.applications || 0}
                          </div>
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {
              selectedJobId && (
                <div className="bg-white relative rounded-lg flex items-center w-[400px] justify-between">
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4640DE] focus:border-transparent"
                  />
                  <div className="flex absolute right-2 items-center gap-1.5 h-5 w-5 justify-center items-center bg-white rounded-full border border-[#4640DE]/30">
                    {loadingApps ? (
                      <Loader2 className="h-3 w-3 animate-spin text-[#4640DE]" />
                    ) : (
                      <span className="text-xs font-bold text-[#4640DE]">
                        {Object.values(applicationsByStage).reduce((sum, apps) => sum + apps.length, 0)}
                      </span>
                    )}
                  </div>
                </div>
              )
            }

          </div>
        </div>

        {!selectedJobId ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Briefcase className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                Select a job to view its ATS pipeline
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Choose a job from the dropdown above to see candidates organized by hiring stages
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Kanban Board */}
            <div className="flex gap-3 overflow-x-auto pb-3 min-h-[500px]">
              {enabledStages.map((stage) => {
                const stageKey = stage as ATSStage;
                const candidates = getCandidatesByStage(stageKey);
                const stageColor = STAGE_COLORS[stageKey] || '#6B7280'; // Default gray if undefined

                return (
                  <div
                    key={stage}
                    className="flex-shrink-0 w-60 bg-gray-50 rounded-lg border border-gray-200 flex flex-col h-full"
                  >
                    {/* Stage Header */}
                    <div
                      onClick={() => handleStageClick(stageKey)}
                      className="p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                      style={{ borderTopColor: stageColor, borderTopWidth: '2px' }}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-gray-900">{ATSStageDisplayNames[stageKey] || stage}</h3>
                        <Badge
                          variant="secondary"
                          className="!bg-white !text-gray-700 !border-gray-200 !text-xs"
                        >
                          {candidates.length}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-0.5">Click to view sub-stages</p>
                    </div>

                    {/* Candidate Cards */}
                    <div className="p-2 space-y-2 flex-grow overflow-y-auto">
                      {candidates.length === 0 ? (
                        <div className="text-center py-6 text-gray-400 text-xs">
                          No candidates in this stage
                        </div>
                      ) : (
                        candidates.map((app) => (
                          <div
                            key={app.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCandidateClick(app.id);
                            }}
                            className="bg-white rounded-lg p-3 border border-gray-200 hover:border-[#4640DE] hover:shadow-md transition-all cursor-pointer group"
                          >
                            {/* Candidate Header */}
                            <div className="flex items-start gap-2">
                              <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                {app.seekerAvatar ? (
                                  <img
                                    src={app.seekerAvatar}
                                    alt={app.seekerName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                    {(app.seekerName || 'C').charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-xs text-gray-900 group-hover:text-[#4640DE] transition-colors line-clamp-1">
                                  {app.seekerName || 'Candidate'}
                                </h4>
                                <p className="text-[10px] text-gray-600 line-clamp-1 mt-0.5">
                                  {app.jobTitle || selectedJob?.title}
                                </p>
                              </div>
                            </div>

                            {/* ATS Score */}
                            {app.atsScore !== undefined && (
                              <div className="mt-2 flex items-center gap-1.5">
                                <TrendingUp className="h-3 w-3 text-[#4640DE]" />
                                <span className="text-[10px] font-medium text-gray-700">
                                  ATS Match: {app.atsScore}%
                                </span>
                              </div>
                            )}

                            {/* Sub-stage Badge */}
                            {app.subStage && (
                              <div className="mt-2">
                                <Badge
                                  variant="secondary"
                                  className="!text-[10px] !py-0.5 !px-1.5"
                                  style={{
                                    backgroundColor: `${stageColor}15`,
                                    color: stageColor,
                                    borderColor: `${stageColor}30`
                                  }}
                                >
                                  {SubStageDisplayNames[app.subStage] || app.subStage}
                                </Badge>
                              </div>
                            )}

                            <div className="mt-1.5 text-[10px] text-gray-500">
                              📅 Applied: {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Recent'}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </CompanyLayout >
  );
};

export default ATSPanel;
