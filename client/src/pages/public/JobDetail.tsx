import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ArrowRight,
  CheckCircle,
  Users,
  Building,
  Globe,
  Loader2,
  AlertCircle,
  Upload,
  FileText,
  X,
  Sparkles
} from "lucide-react";
import PublicHeader from "@/components/layouts/PublicHeader";
import PublicFooter from "@/components/layouts/PublicFooter";
import ResumeAnalyzerModal from "@/components/jobs/ResumeAnalyzerModal";
import { jobApi } from "@/api/job.api";
import { jobApplicationApi } from "@/api";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import { toast } from "sonner";
import type { ApiError } from '@/types/api-error.type';
import { useAppSelector } from "@/hooks/useRedux";
import { UserRole } from "@/constants/enums";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, isInitialized } = useAppSelector((state) => state.auth);
  const [job, setJob] = useState<JobPostingResponse | null>(null);
  const [similarJobs, setSimilarJobs] = useState<JobPostingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzerOpen, setIsAnalyzerOpen] = useState(false);

  const canApply = isAuthenticated && role === UserRole.SEEKER;

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const jobResponse = await jobApi.getJobById(id);
        if (jobResponse.success && jobResponse.data) {
          setJob(jobResponse.data);
          
          const similarResponse = await jobApi.getAllJobs({
            limit: 4,
            category_ids: jobResponse.data.category_ids
          });
          
          if (similarResponse.success && similarResponse.data) {
            const filtered = similarResponse.data.jobs
              .filter((j: { id?: string; _id?: string }) => (j.id || j._id) !== id)
              .slice(0, 4);
            setSimilarJobs(filtered);
          }
        } else {
          setError(jobResponse.message || 'Failed to fetch job details');
        }
      } catch {
        setError('Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('apply') === 'true' && canApply && isInitialized) {
      setTimeout(() => {
        setIsApplyModalOpen(true);
        navigate(location.pathname, { replace: true });
      }, 100);
    }
  }, [canApply, isInitialized, location.search, location.pathname, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a PDF, DOC, or DOCX file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumeFileName("");
  };

  const handleResumeVerified = (file: File) => {
    setResumeFile(file);
    setResumeFileName(file.name);
    setIsApplyModalOpen(true); 
    
  };

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      toast.error('Please provide a cover letter');
      return;
    }

    if (!resumeFile) {
      toast.error('Please upload your resume');
      return;
    }

    if (!id) {
      toast.error('Invalid job');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('job_id', id);
      formData.append('cover_letter', coverLetter.trim());
      formData.append('resume', resumeFile);

      await jobApplicationApi.createApplication(formData);

      
      setJob((prevJob) => (prevJob ? { ...prevJob, has_applied: true } : null));

      setIsApplyModalOpen(false);
      setCoverLetter("");
      setResumeFile(null);
      setResumeFileName("");

      toast.success('Application submitted successfully');

    } catch (error: unknown) {
      const apiError = error as ApiError;
      const message =
        apiError?.response?.data?.message ||
        (Array.isArray((apiError?.response?.data as { errors?: { message: string }[] })?.errors) && (apiError.response?.data as { errors: { message: string }[] }).errors[0]?.message) ||
        'Failed to submit application';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenApplyModal = () => {
    if (!isAuthenticated) {
      navigate('/auth/login', { 
        state: { from: `${location.pathname}?apply=true` },
        replace: false 
      });
      toast.info('Please login to apply for this job');
      return;
    }

    if (role !== UserRole.SEEKER) {
      toast.error('Only job seekers can apply for jobs');
      return;
    }

    setIsApplyModalOpen(true);
  };

  const handleCloseApplyModal = () => {
    if (!isSubmitting) {
      setIsApplyModalOpen(false);
      setCoverLetter("");
      setResumeFile(null);
      setResumeFileName("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">{error || 'Job not found'}</p>
          <Button 
            onClick={() => navigate('/jobs')} 
            className="mt-4"
            variant="outline"
          >
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      <div className="max-w-[1152px] mx-auto">
        <div className="px-[96px] pt-[58px]">
          <div className="mb-6 flex items-center gap-2 text-sm">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-700">
              Home
            </button>
            <span className="text-gray-500">/</span>
            <button onClick={() => navigate('/jobs')} className="text-gray-500 hover:text-gray-700">
              Find Job
            </button>
            <span className="text-gray-500">/</span>
            <span className="text-gray-500">Graphics & Design</span>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">Job Details</span>
          </div>

          <div className="flex items-start justify-between mb-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {(job.company_logo || job.company?.logo) ? (
                  <img 
                    src={job.company_logo || job.company?.logo} 
                    alt={job.company_name || job.company?.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-blue-600">
                    {(job.company_name || job.company?.companyName)?.charAt(0) || job.title.charAt(0)}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-[32px] font-bold text-[#18191C] leading-tight">
                    {job.title}
                  </h1>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg text-[#474C54]">at {job.company_name || job.company?.companyName}</span>
                  <span className="px-3 py-1 bg-[#0BA02C] text-white text-sm font-semibold rounded">
                    {job.employment_types?.[0]?.toUpperCase() || 'FULL-TIME'}
                  </span>
                </div>
              </div>
            </div>

            {(!isAuthenticated || canApply) && isInitialized && (
              <Button 
                className="bg-[#4045DE] hover:bg-[#3338C0] text-white px-8 h-14 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleOpenApplyModal}
                disabled={job.has_applied}
              >
                {job.has_applied ? 'Already Applied' : 'Apply now'}
                {!job.has_applied && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>

        <div className="px-[96px] pb-[58px] flex gap-13">
          <div className="flex-1 max-w-[602px]">
            <div className="mb-8">
              <h2 className="text-[26px] font-bold text-[#25324B] mb-3">Description</h2>
              <p className="text-base text-[#515B6F] leading-relaxed">
                {job.description}
              </p>
            </div>

            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-[26px] font-bold text-[#25324B] mb-3">Responsibilities</h2>
                <div className="space-y-3">
                  {job.responsibilities.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#56CDAD] flex-shrink-0 mt-0.5" />
                      <p className="text-base text-[#515B6F]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {job.qualifications && job.qualifications.length > 0 && (
              <div className="mb-8">
                <h2 className="text-[26px] font-bold text-[#25324B] mb-3">Qualifications</h2>
                <div className="space-y-3">
                  {job.qualifications.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#56CDAD] flex-shrink-0 mt-0.5" />
                      <p className="text-base text-[#515B6F]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {job.nice_to_haves && job.nice_to_haves.length > 0 && (
              <div className="mb-8">
                <h2 className="text-[26px] font-bold text-[#25324B] mb-3">Nice-To-Haves</h2>
                <div className="space-y-3">
                  {job.nice_to_haves.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#56CDAD] flex-shrink-0 mt-0.5" />
                      <p className="text-base text-[#515B6F]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="w-[301px] flex-shrink-0 space-y-8">
            <div>
              <h3 className="text-[26px] font-bold text-[#25324B] mb-5">About this role</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-base text-[#515B6F]">Location</span>
                  <span className="text-base font-semibold text-[#25324B]">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-[#515B6F]">Job Type</span>
                  <span className="text-base font-semibold text-[#25324B]">
                    {job.employment_types?.join(', ') || 'Full-time'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-[#515B6F]">Salary</span>
                  <span className="text-base font-semibold text-[#202430]">
                    ₹{((job.salary?.min || 0) / 1000)}k-₹{((job.salary?.max || 0) / 1000)}k
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-[#515B6F]">Posted</span>
                  <span className="text-base font-semibold text-[#25324B]">
                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base text-[#515B6F]">Applications</span>
                  <span className="text-base font-semibold text-[#25324B]">
                    {job.application_count || 0}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-[26px] font-bold text-[#25324B] mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {job.category_ids?.map((category: string) => (
                  <Badge 
                    key={category}
                    className="bg-[rgba(86,205,173,0.1)] text-[#56CDAD] hover:bg-[rgba(86,205,173,0.1)] px-3 py-1.5"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-[26px] font-bold text-[#25324B] mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills_required?.map((skill: string) => (
                  <Badge 
                    key={skill}
                    variant="outline"
                    className="bg-[#F8F8FD] text-[#4045DE] border-0 px-3 py-2 text-base font-normal"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#D6DDEB] mx-[96px]" />

        {job.benefits && job.benefits.length > 0 && (
          <div className="px-[96px] py-[58px]">
            <div className="mb-5">
              <h2 className="text-[26px] font-bold text-[#25324B] mb-2">Benefits</h2>
              <p className="text-sm text-[#515B6F]">This job comes with several benefits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {job.benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-[#56CDAD] flex-shrink-0 mt-0.5" />
                  <p className="text-base text-[#515B6F]">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-px bg-[#D6DDEB] mx-[96px]" />

        <div className="px-[96px] py-[58px]">
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {(job.company_logo || job.company?.logo) ? (
                    <img 
                      src={job.company_logo || job.company?.logo}  
                      alt={job.company_name || job.company?.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {(job.company_name || job.company?.companyName)?.charAt(0) || 'C'}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="text-[30px] font-bold text-[#25324B] mb-1">
                    {job.company_name || job.company?.companyName}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-[#515B6F]">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{job.company?.organisation || ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{job.company?.employeeCount || 0} employees</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a href={job.company?.websiteLink || '#'} target="_blank" rel="noopener noreferrer">{job.company?.websiteLink || ''}</a>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-base text-[#515B6F] leading-relaxed">
                {job.company_name || job.company?.companyName} is a leading technology company that builds innovative solutions for the modern world. 
                We are committed to creating a diverse and inclusive workplace where talented individuals can thrive and make a meaningful impact.
              </p>
            </div>

            <div className="w-[394px] flex-shrink-0">
              {job.company?.workplacePictures && job.company.workplacePictures.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 h-[221px] bg-gray-200 rounded overflow-hidden">
                    <img 
                      src={job.company.workplacePictures[0].pictureUrl} 
                      alt={job.company.workplacePictures[0].caption || "Office"} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  {job.company.workplacePictures.slice(1, 3).map((picture: { pictureUrl: string; caption?: string }, index: number) => (
                    <div key={index} className="h-[104px] bg-gray-200 rounded overflow-hidden">
                      <img 
                        src={picture.pictureUrl} 
                        alt={picture.caption || "Office"} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  ))}
                  {job.company.workplacePictures.length < 3 && (
                    <div className="h-[104px] bg-gray-200 rounded overflow-hidden">
                      <img src="/white.png" alt="Office" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 h-[221px] bg-gray-200 rounded overflow-hidden">
                    <img src="/white.png" alt="Office" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-[104px] bg-gray-200 rounded overflow-hidden">
                    <img src="/white.png" alt="Office" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-[104px] bg-gray-200 rounded overflow-hidden">
                    <img src="/white.png" alt="Office" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {similarJobs.length > 0 && (
          <div className="bg-[#F8F8FD] px-[96px] py-[58px]">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-[26px] font-bold text-[#25324B]">Similar Jobs</h2>
              <button 
                onClick={() => navigate('/jobs')}
                className="text-sm font-semibold text-[#4045DE] flex items-center gap-2 hover:underline"
              >
                Show all jobs
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {similarJobs.map((similarJob) => {
                const jobData = similarJob as JobPostingResponse & {
                  companyLogo?: string;
                  companyName?: string;
                  viewCount?: number;
                  applicationCount?: number;
                  skillsRequired?: string[];
                  employmentTypes?: string[];
                };
                
                const companyLogo = jobData.companyLogo || jobData.company_logo || jobData.company?.logo;
                const companyName = jobData.companyName || jobData.company_name || jobData.company?.companyName || 'Company';
                const applicationCount = jobData.applicationCount || 0;
                const employmentTypes = jobData.employmentTypes || jobData.employment_types || [];
                const salary = jobData.salary || { min: 0, max: 0 };

                return (
                  <div 
                    key={similarJob.id || similarJob._id} 
                    className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-[#3570E2]/20 transition-all duration-200"
                    onClick={() => navigate(`/jobs/${similarJob.id || similarJob._id}`)}
                  >
                    {}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#3570E2]/10 to-[#3570E2]/5 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#3570E2]/10">
                        {companyLogo ? (
                          <img 
                            src={companyLogo} 
                            alt={companyName}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-[#3570E2] font-bold text-sm">
                            {companyName.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#6B7280] mb-0.5">{companyName}</p>
                        <h3 className="text-base font-semibold text-[#141414] hover:text-[#3570E2] transition-colors line-clamp-1 leading-snug" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {similarJob.title}
                        </h3>
                      </div>
                    </div>

                    {}
                    <div className="flex items-center gap-2 mb-3 text-xs text-[#6B7280] flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="truncate">{similarJob.location}</span>
                      </div>
                      {employmentTypes.length > 0 && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="px-2.5 py-0.5 bg-[#F3F4F6] rounded text-xs font-medium text-[#374151]">
                            {employmentTypes[0]}
                          </span>
                        </>
                      )}
                      {salary.min > 0 && salary.max > 0 && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="font-bold text-[#141414]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                            ₹{(salary.min / 1000).toFixed(0)}K-₹{(salary.max / 1000).toFixed(0)}K
                          </span>
                        </>
                      )}
                    </div>

                    {}
                    {similarJob.description && (
                      <p className="text-sm text-[#6B7280] line-clamp-2 mb-3 leading-relaxed">
                        {similarJob.description}
                      </p>
                    )}

                    {}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                      <div className="flex items-center gap-1.5 text-[#6B7280]">
                        <Users className="w-4 h-4" />
                        <span>{applicationCount} applied</span>
                      </div>
                      {similarJob.createdAt && (
                        <span className="text-[#9CA3AF]">
                          {new Date(similarJob.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <PublicFooter />

      {}
      <Dialog open={isApplyModalOpen} onOpenChange={handleCloseApplyModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#25324B]">
              Apply for {job?.title}
            </DialogTitle>
            <DialogDescription className="text-base text-[#515B6F]">
              Submit your application to {job?.company_name || job?.company?.companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {}
            <div className="bg-[#F8F8FD] rounded-lg p-4 border border-[#D6DDEB]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {(job?.company_logo || job?.company?.logo) ? (
                    <img 
                      src={job?.company_logo || job?.company?.logo} 
                      alt={job?.company_name || job?.company?.companyName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-blue-600">
                      {(job?.company_name || job?.company?.companyName)?.charAt(0) || 'C'}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#25324B] mb-1">
                    {job?.title}
                  </h3>
                  <p className="text-sm text-[#515B6F] mb-2">
                    {job?.company_name || job?.company?.companyName} • {job?.location}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-[rgba(86,205,173,0.1)] text-[#56CDAD] hover:bg-[rgba(86,205,173,0.1)]">
                      {job?.employment_types?.[0]?.toUpperCase() || 'FULL-TIME'}
                    </Badge>
                    <span className="text-sm text-[#515B6F]">
                      ₹{((job?.salary?.min || 0) / 1000)}k-₹{((job?.salary?.max || 0) / 1000)}k
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-base font-semibold text-[#25324B]">
                Cover Letter <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[150px] text-base"
                disabled={isSubmitting}
              />
              <p className="text-sm text-[#515B6F]">
                {coverLetter.length} characters
              </p>
            </div>

            {}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="resume" className="text-base font-semibold text-[#25324B]">
                  Resume <span className="text-red-500">*</span>
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 h-auto p-1 font-medium"
                  onClick={() => setIsAnalyzerOpen(true)}
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Check Resume Score
                </Button>
              </div>
              {!resumeFile ? (
                <div className="relative">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor="resume"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#D6DDEB] rounded-lg cursor-pointer bg-[#F8F8FD] hover:bg-[#F0F0F5] transition-colors"
                  >
                    <Upload className="w-8 h-8 text-[#4045DE] mb-2" />
                    <p className="text-sm font-medium text-[#25324B] mb-1">
                      Click to upload your resume
                    </p>
                    <p className="text-xs text-[#515B6F]">
                      PDF, DOC, or DOCX (Max 5MB)
                    </p>
                  </Label>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-[#F8F8FD] border border-[#D6DDEB] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#4045DE]/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#4045DE]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#25324B]">{resumeFileName}</p>
                      <p className="text-xs text-[#515B6F]">
                        {(resumeFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveResume}
                    disabled={isSubmitting}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Make sure your resume is up-to-date and your cover letter highlights your relevant experience for this position.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseApplyModal}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              disabled={isSubmitting || !coverLetter.trim() || !resumeFile}
              className="bg-[#4045DE] hover:bg-[#3338C0] text-white px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ResumeAnalyzerModal 
        isOpen={isAnalyzerOpen}
        onClose={() => setIsAnalyzerOpen(false)}
        jobId={id || ''}
        onResumeVerified={handleResumeVerified}
      />
    </div>
  );
};

export default JobDetail;