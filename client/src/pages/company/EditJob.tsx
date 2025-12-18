import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CompanyLayout from "../../components/layouts/CompanyLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, ClipboardList, Heart } from "lucide-react";
import JobInformationStep from "../../components/company/JobInformationStep";
import JobDescriptionStep from "../../components/company/JobDescriptionStep";
import PerksBenefitsStep from "../../components/company/PerksBenefitsStep";
import type { JobPostingData } from "@/interfaces/job/job-posting-data.interface";
import { companyApi } from "../../api/company.api";
import type { JobPostingRequest } from "@/interfaces/company/company-api.interface";
import { toast } from "sonner";
import { Loading } from "@/components/ui/loading";

const EditJob = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchJobData = async () => {
      if (!id) {
        toast.error("Job ID not found");
        navigate("/company/job-listing");
        return;
      }

      try {
        setLoading(true);
        const response = await companyApi.getJobPosting(id);
        
        if (response.success && response.data) {
          const job = response.data;
          
          setJobData({
            title: job.title || "",
            employmentTypes: job.employmentTypes || job.employment_types || [],
            salary: job.salary || { min: 5000, max: 22000 },
            categoryIds: job.categoryIds || job.category_ids || [],
            skillsRequired: job.skillsRequired || job.skills_required || [],
            location: job.location || "",
            description: job.description || "",
            responsibilities: job.responsibilities || [],
            qualifications: job.qualifications || [],
            niceToHaves: job.niceToHaves || job.nice_to_haves || [],
            benefits: job.benefits || [],
          });
        } else {
          toast.error("Failed to load job data");
          navigate("/company/job-listing");
        }
      } catch {
        toast.error("Failed to load job data");
        navigate("/company/job-listing");
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, navigate]);

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
    if (!id) {
      toast.error("Job ID not found");
      return;
    }

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

      const response = await companyApi.updateJobPosting(id, jobPostingData);
      
      if (response.success) {
        toast.success("Job updated successfully!", {
          description: "Your job posting has been updated.",
        });
        
        navigate("/company/job-listing");
      } else {
        toast.error("Failed to update job", {
          description: response.message || "Please try again later.",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : "Please try again later.";
      toast.error("Failed to update job", {
        description: errorMessage,
      });
    }
  };

  if (loading) {
    return (
      <CompanyLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading />
        </div>
      </CompanyLayout>
    );
  }

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <CompanyLayout>
      <div className="flex flex-col items-center px-5">
        {}
        <div className="flex items-center py-6 w-full">
          <Button variant="ghost" size="sm" onClick={() => navigate("/company/job-listing")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-semibold text-[#25324B]">Edit Job</h1>
        </div>

        {}
        <div className="flex items-center justify-center gap-20 px-5 py-3 w-full">
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

export default EditJob;