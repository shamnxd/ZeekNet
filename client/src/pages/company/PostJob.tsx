import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyLayout from "../../components/layouts/CompanyLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, ClipboardList, Heart, AlertCircle, GitPullRequest } from "lucide-react";
import JobInformationStep from "../../components/company/JobInformationStep";
import JobDescriptionStep from "../../components/company/JobDescriptionStep";
import PerksBenefitsStep from "../../components/company/PerksBenefitsStep";
import HiringPipelineStep from "../../components/company/HiringPipelineStep";
import type { JobPostingData } from "@/interfaces/job/job-posting-data.interface";
import { companyApi } from "../../api/company.api";
import type { JobPostingRequest } from "@/interfaces/company/company-api.interface";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/useRedux";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ATSStage } from "@/constants/ats-stages";

const PostJob = () => {
  const navigate = useNavigate();
  const { companyVerificationStatus } = useAppSelector((state) => state.auth);
  const isVerified = companyVerificationStatus === 'verified';
  const [currentStep, setCurrentStep] = useState(1);
  const [jobData, setJobData] = useState<JobPostingData>({
    title: "",
    employmentTypes: [],
    salary: {
      min: 5000,
      max: 22000,
    },
    categoryIds: [],
    skillsRequired: [],
    location: "",
    description: "",
    responsibilities: [],
    qualifications: [],
    niceToHaves: [],
    benefits: [],
    enabledStages: Object.values(ATSStage),
  });

  const steps = [
    {
      id: 1,
      title: "Job Information",
      description: "Basic job details and requirements",
      icon: Briefcase,
      component: JobInformationStep,
    },
    {
      id: 2,
      title: "Job Description",
      description: "Detailed job description and responsibilities",
      icon: ClipboardList,
      component: JobDescriptionStep,
    },
    {
      id: 3,
      title: "Perks & Benefits",
      description: "Company benefits and perks",
      icon: Heart,
      component: PerksBenefitsStep,
    },
    {
      id: 4,
      title: "Hiring Pipeline",
      description: "Customize hiring workflow",
      icon: GitPullRequest,
      component: HiringPipelineStep,
    },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (stepData: Partial<JobPostingData>) => {
    setJobData((prev) => ({ ...prev, ...stepData }));
  };

  const handleSubmit = async () => {
    try {
      if (!jobData.title || jobData.title.length < 5) {
        toast.error("Validation failed", {
          description: "Title must be at least 5 characters",
        });
        return;
      }

      const jobPostingData: JobPostingRequest = {
        title: jobData.title,
        description: jobData.description,
        responsibilities: jobData.responsibilities,
        qualifications: jobData.qualifications,
        nice_to_haves: jobData.niceToHaves,
        benefits: jobData.benefits,
        salary: jobData.salary,
        employment_types: jobData.employmentTypes as ("full-time" | "part-time" | "contract" | "internship" | "remote")[],
        location: jobData.location,
        skills_required: jobData.skillsRequired,
        category_ids: jobData.categoryIds.length > 0 ? jobData.categoryIds : ["tech"],
        enabled_stages: jobData.enabledStages.length > 0 ? jobData.enabledStages : Object.values(ATSStage) as string[]
      };

      const response = await companyApi.createJobPosting(jobPostingData);

      if (response.success) {
        toast.success("Job posted successfully!", {
          description: "Your job posting has been submitted and is now live.",
        });

        setJobData({
          title: "",
          employmentTypes: [],
          salary: {
            min: 5000,
            max: 22000,
          },
          categoryIds: [],
          skillsRequired: [],
          location: "",
          description: "",
          responsibilities: [],
          qualifications: [],
          niceToHaves: [],
          benefits: [],
          enabledStages: Object.values(ATSStage),
        });

        setCurrentStep(1);
      } else {
        toast.error("Failed to post job", {
          description: response.message || "Please try again later.",
        });
      }
    } catch (error: unknown) {
      let errorMessage = "Please try again later.";

      if (error && typeof error === 'object') {
        if ('response' in error && error.response && typeof error.response === 'object') {
          const response = error.response as { data?: { message?: string } };
          errorMessage = response.data?.message || errorMessage;
        }
        else if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }

      toast.error("Failed to post job", {
        description: errorMessage,
      });
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  if (!isVerified) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-amber-100 rounded-full">
                  <AlertCircle className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <CardTitle className="text-center">Profile Verification Required</CardTitle>
              <CardDescription className="text-center">
                Please complete and verify your company profile before posting jobs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Your company profile status: <strong>{companyVerificationStatus || 'not_created'}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Complete your profile setup and wait for admin verification to post jobs.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/company/dashboard')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => navigate('/company/profile')}
                >
                  Go to Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <div className="flex flex-col items-center px-5">
        <div className="flex items-center py-6 w-full">
          <Button variant="ghost" size="sm" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-[#25324B]">Post a Job</h1>
        </div>

        <div className="flex items-center justify-center gap-20 px-5 py-3 w-full">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isActive
                        ? "bg-[#4640DE] text-white"
                        : isCompleted
                          ? "bg-[#4640DE] text-white"
                          : "bg-[#E9EBFD] text-[#7C8493]"
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="hidden md:block">
                    <p
                      className={`text-sm font-normal ${isActive
                          ? "text-[#4640DE]"
                          : isCompleted
                            ? "text-[#4640DE]"
                            : "text-[#A8ADB7]"
                        }`}
                    >
                      Step {step.id}/4
                    </p>
                    <p
                      className={`text-base font-semibold ${isActive
                          ? "text-[#25324B]"
                          : isCompleted
                            ? "text-[#25324B]"
                            : "text-[#7C8493]"
                        }`}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block w-0 h-8 mx-5 border-l border-[#D6DDEB]" />
                )}
              </div>
            );
          })}
        </div>

        <div className="w-full">
          <CurrentStepComponent
            data={jobData}
            onDataChange={handleDataChange}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={currentStep === 1}
            isLastStep={currentStep === 4}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </CompanyLayout>
  );
};

export default PostJob;