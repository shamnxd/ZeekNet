import { useState } from "react";
import CompanyLayout from "../../components/layouts/CompanyLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, ClipboardList, Heart } from "lucide-react";
import JobInformationStep from "../../components/company/JobInformationStep";
import JobDescriptionStep from "../../components/company/JobDescriptionStep";
import PerksBenefitsStep from "../../components/company/PerksBenefitsStep";
import type { JobPostingData } from "../../types/job-posting";
import { companyApi, type JobPostingRequest } from "../../api/company.api";
import { toast } from "sonner";

const PostJob = () => {
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
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataChange = (stepData: Partial<JobPostingData>) => {
    setJobData(prev => ({ ...prev, ...stepData }));
  };

  const handleSubmit = async () => {
    try {
      if (!jobData.title || jobData.title.length < 5) {
        toast.error("Validation failed", {
          description: "Title must be at least 5 characters",
        });
        return;
      }

      if (!jobData.description || jobData.description.length < 10) {
        toast.error("Validation failed", {
          description: "Description must be at least 10 characters",
        });
        return;
      }

      if (!jobData.responsibilities || jobData.responsibilities.length === 0) {
        toast.error("Validation failed", {
          description: "At least one responsibility is required",
        });
        return;
      }

      if (!jobData.qualifications || jobData.qualifications.length === 0) {
        toast.error("Validation failed", {
          description: "At least one qualification is required",
        });
        return;
      }

      if (!jobData.location || jobData.location.length < 2) {
        toast.error("Validation failed", {
          description: "Location must be at least 2 characters",
        });
        return;
      }

      if (!jobData.employmentTypes || jobData.employmentTypes.length === 0) {
        toast.error("Validation failed", {
          description: "At least one employment type is required",
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
        category_ids: jobData.categoryIds.length > 0 ? jobData.categoryIds : ["tech"]
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
        });
        
        setCurrentStep(1);
      } else {
        toast.error("Failed to post job", {
          description: response.message || "Please try again later.",
        });
      }
    } catch (error: unknown) {
      // Extract error message from axios error structure
      let errorMessage = "Please try again later.";
      
      if (error && typeof error === 'object') {
        // Check for axios error response
        if ('response' in error && error.response && typeof error.response === 'object') {
          const response = error.response as { data?: { message?: string } };
          errorMessage = response.data?.message || errorMessage;
        } 
        // Fallback to direct message property
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

  return (
    <CompanyLayout>
      <div className="flex flex-col items-center px-5">
        {}
        <div className="flex items-center py-6 w-full">
          <Button variant="ghost" size="sm" onClick={handlePrevious}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-[#25324B]">Post a Job</h1>
        </div>

        {}
        <div className="flex items-center justify-center gap-20 px-5 py-3  w-full">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#4640DE] text-white"
                        : isCompleted
                        ? "bg-[#4640DE] text-white"
                        : "bg-[#E9EBFD] text-[#7C8493]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-normal ${
                        isActive
                          ? "text-[#4640DE]"
                          : isCompleted
                          ? "text-[#4640DE]"
                          : "text-[#A8ADB7]"
                      }`}
                    >
                      Step {step.id}/3
                    </p>
                    <p
                      className={`text-base font-semibold ${
                        isActive
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
                  <div className="w-0 h-8 mx-5 border-l border-[#D6DDEB]" />
                )}
              </div>
            );
          })}
        </div>

        {}
        <div className="w-full">
        <CurrentStepComponent
          data={jobData}
          onDataChange={handleDataChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === 3}
          onSubmit={handleSubmit}
        />
        </div>
      </div>
    </CompanyLayout>
  );
};

export default PostJob;