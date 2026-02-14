import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import CompanyLayout from '@/components/layouts/CompanyLayout';
import { ATSStage, STAGE_COLORS, ATSStageDisplayNames, STAGE_SUB_STAGES } from '@/constants/ats-stages';
import { companyApi } from '@/api/company.api';
import type { JobPostingResponse } from '@/interfaces/job/job-posting-response.interface';
import type { ApplicationsKanbanResponse, ApplicationKanbanItem } from '@/interfaces/ats/ats-pipeline.interface';
import type { CompanySideApplication } from '@/interfaces/company/company-data.interface';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp, Briefcase } from 'lucide-react';

const ATSStageDetail = () => {
  const navigate = useNavigate();
  const { stage } = useParams<{ stage: string }>();
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get('jobId');

  const [searchTerm, setSearchTerm] = useState('');
  const [applicationsByStage, setApplicationsByStage] = useState<ApplicationsKanbanResponse>({});
  const [job, setJob] = useState<JobPostingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const decodedStage = decodeURIComponent(stage || '') as ATSStage;
  const stageColor = STAGE_COLORS[decodedStage] || '#6B7280';


  const subStages = STAGE_SUB_STAGES[decodedStage] || [];


  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) return;
      try {
        setLoading(true);


        const [jobRes, applicationsRes] = await Promise.all([
          companyApi.getJobPosting(jobId),
          companyApi.getJobApplicationsForKanban(jobId),
        ]);

        if (jobRes.data) {
          setJob(jobRes.data);
        }


        if (applicationsRes.data && applicationsRes.data.applications) {
          const applications = applicationsRes.data.applications;

          const groupedByStage: ApplicationsKanbanResponse = {};

          applications.forEach((app: CompanySideApplication) => {
            const stage = app.stage;
            if (!groupedByStage[stage]) {
              groupedByStage[stage] = [];
            }

            groupedByStage[stage].push({
              id: app.id,
              seekerId: app.seeker_id || app.seekerId || '',
              seekerName: app.seeker_name,
              seekerAvatar: app.seeker_avatar,
              jobTitle: app.job_title,
              atsScore: app.score,
              subStage: app.sub_stage,
              appliedDate: app.applied_date || '',
            });
          });

          setApplicationsByStage(groupedByStage);
        }
      } catch (error) {
        console.error("Failed to fetch stage details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [jobId]);

  const getCandidatesBySubStage = (subStageKey: string): ApplicationKanbanItem[] => {
    if (!jobId) return [];


    const stageApps = applicationsByStage[decodedStage] || [];


    const candidates = stageApps.filter(app => app.subStage === subStageKey);

    if (searchTerm === '') return candidates;

    return candidates.filter(app =>
      (app.seekerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.jobTitle || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCandidateClick = (candidateId: string) => {
    navigate(`/company/ats/candidate/${candidateId}`);
  };

  const handleBackClick = () => {
    navigate('/company/ats');
  };

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#4640DE]" />
        </div>
      </CompanyLayout>
    );
  }

  if (!jobId || !job) {
    return (
      <CompanyLayout>
        <div className="px-4 py-4">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900">No job selected or job not found</h2>
            <Button
              onClick={handleBackClick}
              className="mt-4"
              variant="outline"
            >
              Back to ATS Panel
            </Button>
          </div>
        </div>
      </CompanyLayout>
    );
  }

  const totalCandidates = subStages.reduce((sum, subStage) => {
    return sum + getCandidatesBySubStage(subStage.key).length;
  }, 0);

  return (
    <CompanyLayout>
      <div className="px-5 py-5 space-y-5">
        { }
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleBackClick}
              className="!border-gray-300 !px-2.5 !py-1.5 !text-sm"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-2" />
              Back
            </Button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-gray-900">{ATSStageDisplayNames[decodedStage] || decodedStage}</h1>
                <Badge
                  variant="secondary"
                  className="!text-sm"
                  style={{
                    backgroundColor: `${stageColor}15`,
                    color: stageColor,
                    borderColor: `${stageColor}30`
                  }}
                >
                  {totalCandidates}
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Briefcase className="h-3.5 w-3.5 text-gray-500" />
                <p className="text-sm text-gray-500">{job.title}</p>
              </div>
            </div>
          </div>
        </div>

        { }
        <div className="bg-white rounded-lg border border-gray-200 p-3.5">
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4640DE] focus:border-transparent"
          />
        </div>

        { }
        <div className="flex gap-3.5 overflow-x-auto pb-3.5">
          {subStages.length === 0 ? (
            <div className="text-center py-12 w-full">
              <p className="text-gray-500">No sub-stages configured for this stage</p>
            </div>
          ) : (
            subStages.map((subStage) => {
              const candidates = getCandidatesBySubStage(subStage.key);

              return (
                <div
                  key={subStage.key}
                  className="flex-shrink-0 w-64 bg-gray-50 rounded-lg border border-gray-200"
                >
                  { }
                  <div
                    className="p-3.5 border-b border-gray-200"
                    style={{ borderTopColor: stageColor, borderTopWidth: '2px' }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm text-gray-900">{subStage.label}</h3>
                      <Badge
                        variant="secondary"
                        className="!bg-white !text-gray-700 !border-gray-200 !text-sm"
                      >
                        {candidates.length}
                      </Badge>
                    </div>
                  </div>

                  { }
                  <div className="p-2.5 space-y-2.5 max-h-[calc(100vh-280px)] overflow-y-auto">
                    {candidates.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        No candidates
                      </div>
                    ) : (
                      candidates.map((app) => (
                        <div
                          key={app.id}
                          onClick={() => handleCandidateClick(app.id)}
                          className="bg-white rounded-lg p-3.5 border border-gray-200 hover:border-[#4640DE] hover:shadow-md transition-all cursor-pointer group"
                        >
                          { }
                          <div className="flex items-start gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                              {app.seekerAvatar ? (
                                <img
                                  src={app.seekerAvatar}
                                  alt={app.seekerName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-400">
                                  {(app.seekerName || 'C').charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 group-hover:text-[#4640DE] transition-colors line-clamp-1">
                                {app.seekerName || 'Candidate'}
                              </h4>
                              <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                                {app.jobTitle || job?.title}
                              </p>
                            </div>
                          </div>

                          { }
                          {app.atsScore !== undefined && (
                            <div className="mt-2.5 flex items-center gap-2">
                              <TrendingUp className="h-3.5 w-3.5 text-[#4640DE]" />
                              <span className="text-xs font-medium text-gray-700">
                                ATS Match: {app.atsScore}%
                              </span>
                            </div>
                          )}

                          { }
                          <div className="mt-2 text-xs text-gray-500">
                            📅 Applied: {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : 'Recent'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </CompanyLayout>
  );
};

export default ATSStageDetail;
