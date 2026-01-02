import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee } from "lucide-react";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import { publicApi } from "@/api/public.api";
import type { JobPostingStepProps } from "@/interfaces/job/job-posting-step-props.interface";

const JobInformationStep: React.FC<JobPostingStepProps> = ({
  data,
  onDataChange,
  onNext,
}) => {

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categoriesOptions, setCategoriesOptions] = useState<ComboboxOption[]>([]);
  const [skillsOptions, setSkillsOptions] = useState<ComboboxOption[]>([]);
  const [jobRolesOptions, setJobRolesOptions] = useState<ComboboxOption[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [showJobRoleSuggestions, setShowJobRoleSuggestions] = useState(false);

  const employmentTypes = [
    { value: "full-time", label: "Full-Time" },
    { value: "part-time", label: "Part-Time" },
    { value: "remote", label: "Remote" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" }
  ];

  const fetchCategories = useCallback(async (searchTerm?: string) => {
    try {
      setCategoriesLoading(true);
      const response = await publicApi.getAllJobCategories({
        limit: 20,
        search: searchTerm,
      });
      if (response.success && response.data) {
        const fetchedOptions: ComboboxOption[] = response.data.map((categoryName: string) => ({
          value: categoryName,
          label: categoryName,
        }));
        
        const allOptions = [...fetchedOptions];
        for (const selectedCategory of data.categoryIds) {
          if (!allOptions.find(opt => opt.value === selectedCategory)) {
            allOptions.push({
              value: selectedCategory,
              label: selectedCategory,
            });
          }
        }
        
        setCategoriesOptions(allOptions);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  }, [data.categoryIds]);

  const fetchSkills = useCallback(async (searchTerm?: string) => {
    try {
      setSkillsLoading(true);
      const response = await publicApi.getAllSkills({
        limit: 20,
        search: searchTerm,
      });
      if (response.success && response.data) {
        const fetchedOptions: ComboboxOption[] = response.data.map((skillName: string) => ({
          value: skillName,
          label: skillName,
        }));

        const allOptions = [...fetchedOptions];
        for (const selectedSkill of data.skillsRequired) {
          if (!allOptions.find(opt => opt.value === selectedSkill)) {
            allOptions.push({
              value: selectedSkill,
              label: selectedSkill,
            });
          }
        }
        
        setSkillsOptions(allOptions);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setSkillsLoading(false);
    }
  }, [data.skillsRequired]);

  const fetchJobRoles = async (searchTerm?: string) => {
    try {
      const response = await publicApi.getAllJobRoles({
        limit: 20,
        search: searchTerm,
      });
      if (response.success && response.data) {
        const options: ComboboxOption[] = response.data.map((roleName: string) => ({
          value: roleName,
          label: roleName,
        }));
        setJobRolesOptions(options);
      }
    } catch (error) {
      console.error('Failed to fetch job roles:', error);
    }
  };

  useEffect(() => {
    const initializeOptions = async () => {
      await fetchCategories();
      await fetchSkills();
      await fetchJobRoles();
    };
    
    initializeOptions();
  }, [data.categoryIds, data.skillsRequired, fetchCategories, fetchSkills]);

  const handleTitleChange = (value: string) => {
    handleFieldChange('title', value);
    if (value.length >= 2) {
      fetchJobRoles(value);
      setShowJobRoleSuggestions(true);
    } else {
      setShowJobRoleSuggestions(false);
    }
  };

  const handleJobRoleSelect = (roleName: string) => {
    handleFieldChange('title', roleName);
    setShowJobRoleSuggestions(false);
  };

  const handleEmploymentTypeToggle = (type: string) => {
    const updatedTypes = data.employmentTypes.includes(type)
      ? data.employmentTypes.filter(t => t !== type)
      : [...data.employmentTypes, type];
    
    onDataChange({ employmentTypes: updatedTypes });
  };

  const handleSkillsChange = (selectedSkills: string[]) => {
    onDataChange({
      skillsRequired: selectedSkills
    });
  };

  const handleSalaryChange = (field: 'min' | 'max', value: number) => {
    onDataChange({ 
      salary: { 
        ...data.salary, 
        [field]: value 
      } 
    });
  };

  const handleCategoriesChange = (selectedCategoryIds: string[]) => {
    onDataChange({
      categoryIds: selectedCategoryIds
    });
    if (errors.categoryIds && selectedCategoryIds.length > 0) {
      setErrors(prev => ({ ...prev, categoryIds: "" }));
    }
  };

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.title.trim()) {
      newErrors.title = "Job title is required";
    } else if (data.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    } else if (data.title.trim().length > 100) {
      newErrors.title = "Title must not exceed 100 characters";
    }
    
    if (!data.location.trim()) {
      newErrors.location = "Location is required";
    } else if (data.location.trim().length < 2) {
      newErrors.location = "Location must be at least 2 characters";
    } else if (data.location.trim().length > 100) {
      newErrors.location = "Location must not exceed 100 characters";
    }
    
    if (data.employmentTypes.length === 0) {
      newErrors.employmentTypes = "Please select at least one employment type";
    } else {
      const validTypes = ["full-time", "part-time", "contract", "internship", "remote"];
      const invalidTypes = data.employmentTypes.filter(type => !validTypes.includes(type));
      if (invalidTypes.length > 0) {
        newErrors.employmentTypes = `Invalid employment types: ${invalidTypes.join(", ")}`;
      }
    }
    
    if (data.categoryIds.length === 0) {
      newErrors.categoryIds = "Please select at least one category";
    }
    
    if (data.salary.min < 0) {
      newErrors.salary = "Minimum salary cannot be negative";
    } else if (data.salary.max < 0) {
      newErrors.salary = "Maximum salary cannot be negative";
    } else if (data.salary.min > data.salary.max) {
      newErrors.salary = "Minimum salary cannot be greater than maximum salary";
    }
    
    if (!data.totalVacancies || data.totalVacancies < 1) {
      newErrors.totalVacancies = "Total vacancies must be at least 1";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateFields()) {
      onNext();
    }
  };

  const handleFieldChange = useCallback((field: keyof typeof data, value: unknown) => {
    onDataChange({ [field]: value });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  }, [onDataChange, errors]);

  return (
    <div className="flex flex-col items-end gap-5 px-4 py-6">
      {}
      <div className="flex flex-col gap-1 w-full">
        <h2 className="text-base font-semibold text-[#25324B]">Basic Information</h2>
        <p className="text-sm text-[#7C8493]">This information will be displayed publicly</p>
      </div>

      {}
      <div className="w-full h-px bg-[#D6DDEB]"></div>

      {}
      <div className="flex gap-30 w-full">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#25324B]">
            Job Title <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-[#7C8493]">Job titles must be describe one position</p>
        </div>
        <div className="flex flex-col gap-1 relative">
          <Input
            placeholder="e.g. Software Engineer"
            value={data.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onFocus={() => {
              if (data.title.length >= 2) {
                setShowJobRoleSuggestions(true);
              }
            }}
            onBlur={() => {
              setTimeout(() => setShowJobRoleSuggestions(false), 200);
            }}
            className={`w-[387px] h-11 px-4 py-3 border rounded-[10px] ${errors.title ? 'border-red-500' : 'border-[#D6DDEB]'}`}
          />
          <p className="text-xs text-[#7C8493]">At least 5 characters</p>
          {errors.title && (
            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
          )}
          {showJobRoleSuggestions && jobRolesOptions.length > 0 && (
            <div className="absolute top-full left-0 z-50 w-[387px] mt-1 bg-white border border-[#D6DDEB] rounded-[10px] shadow-lg max-h-60 overflow-auto">
              {jobRolesOptions.map((role) => (
                <div
                  key={role.value}
                  onClick={() => handleJobRoleSelect(role.value)}
                  className="px-4 py-2 hover:bg-[#F8F9FF] cursor-pointer text-sm text-[#25324B]"
                >
                  {role.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {}
      <div className="w-full h-px bg-[#D6DDEB]"></div>

      {}
      <div className="flex gap-30 w-full">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#25324B]">
            Location <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-[#7C8493]">Where is this job located?</p>
        </div>
        <div className="flex flex-col gap-1">
          <Input
            placeholder="e.g. New York, NY or Remote"
            value={data.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            className={`w-[387px] h-11 px-4 py-3 border rounded-[10px] ${errors.location ? 'border-red-500' : 'border-[#D6DDEB]'}`}
          />
          <p className="text-xs text-[#7C8493]">Specify city, state or country</p>
          {errors.location && (
            <p className="text-xs text-red-500 mt-1">{errors.location}</p>
          )}
        </div>
      </div>

      {}
      <div className="w-full h-px bg-[#D6DDEB]"></div>

      {}
      <div className="flex gap-30 w-full">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#25324B]">
            Type of Employment <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-[#7C8493]">You can select multiple type of employment</p>
        </div>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {employmentTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.employmentTypes.includes(type.value)}
                  onChange={() => handleEmploymentTypeToggle(type.value)}
                  className="w-5 h-5 text-[#4640DE] border-2 border-[#D6DDEB] rounded focus:ring-[#4640DE]"
                />
                <span className="text-sm text-[#515B6F]">{type.label}</span>
              </label>
            ))}
          </div>
          {errors.employmentTypes && (
            <p className="text-xs text-red-500 mt-1">{errors.employmentTypes}</p>
          )}
        </div>
      </div>

      {}
      <div className="w-full h-px bg-[#D6DDEB]"></div>

      {}
      <div className="flex gap-30 w-full">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#25324B]">Salary</h3>
          <p className="text-sm text-[#7C8493]">Please specify the estimated salary range for the role. *You can leave this blank</p>
        </div>
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-18">
            <div className="flex items-center gap-2 px-3 py-2 border border-[#CCCCF5] rounded-[10px]">
              <IndianRupee className="h-5 w-5 text-[#202430] opacity-50" />
              <div className="w-px h-5 bg-[#A8ADB7]"></div>
              <Input
                type="number"
                value={data.salary.min}
                onChange={(e) => handleSalaryChange('min', parseInt(e.target.value) || 0)}
                className="w-[60px] border-none p-0 text-sm font-semibold text-[#25324B]"
              />
            </div>
            <span className="text-sm text-[#7C8493]">to</span>
            <div className="flex items-center gap-2 px-3 py-2 border border-[#CCCCF5] rounded-[10px]">
              <IndianRupee className="h-5 w-5 text-[#202430] opacity-50" />
              <div className="w-px h-5 bg-[#A8ADB7]"></div>
              <Input
                type="number"
                value={data.salary.max}
                onChange={(e) => handleSalaryChange('max', parseInt(e.target.value) || 0)}
                className="w-[66px] border-none p-0 text-sm font-semibold text-[#25324B]"
              />
            </div>
          </div>
          {errors.salary && (
            <p className="text-xs text-red-500 mt-1">{errors.salary}</p>
          )}
          </div>
      </div>

      {}
      <div className="w-full h-px bg-[#D6DDEB]"></div>

      {}
      <div className="flex gap-30 w-full">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#25324B]">
            Total Vacancies <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-[#7C8493]">Number of positions available for this job</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min="1"
              placeholder="e.g. 1"
              value={data.totalVacancies ?? 1}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                handleFieldChange('totalVacancies', value);
              }}
              disabled={data.status === 'closed'}
              className={`w-[387px] h-11 px-4 py-3 border rounded-[10px] ${errors.totalVacancies ? 'border-red-500' : 'border-[#D6DDEB]'} ${data.status === 'closed' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {data.filledVacancies !== undefined && data.filledVacancies > 0 && (
              <div className="flex flex-col">
                <span className="text-xs text-[#7C8493]">Filled: <strong className="text-[#25324B]">{data.filledVacancies}</strong></span>
              </div>
            )}
          </div>
          <p className="text-xs text-[#7C8493]">Minimum 1 vacancy required</p>
          {errors.totalVacancies && (
            <p className="text-xs text-red-500 mt-1">{errors.totalVacancies}</p>
          )}
          {data.filledVacancies !== undefined && data.filledVacancies > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              {data.filledVacancies} position{data.filledVacancies > 1 ? 's' : ''} already filled
            </p>
          )}
        </div>
      </div>

      {}
      <div className="w-full h-px bg-[#D6DDEB]"></div>

      {}
      <div className="flex gap-30 w-full">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#25324B]">
            Categories <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-[#7C8493]">Select job categories</p>
        </div>
        <div className="flex flex-col gap-3">
          <Label className="text-sm font-semibold text-[#515B6F]">Job Categories</Label>
          <Combobox
            options={categoriesOptions}
            value={data.categoryIds}
            onChange={handleCategoriesChange}
            placeholder="Type to search categories..."
            multiple={true}
            loading={categoriesLoading}
            onSearch={(searchTerm) => {
              if (searchTerm.length >= 2 || searchTerm.length === 0) {
                fetchCategories(searchTerm);
              }
            }}
            className="w-full"
          />
          {errors.categoryIds && (
            <p className="text-xs text-red-500 mt-1">{errors.categoryIds}</p>
          )}
        </div>
      </div>

      {}
      <div className="w-full h-px bg-[#D6DDEB]"></div>

      {}
      <div className="flex gap-30 w-full">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-[#25324B]">Required Skills</h3>
          <p className="text-sm text-[#7C8493]">Select required skills for the job</p>
        </div>
        <div className="flex flex-col gap-3">
          <Combobox
            options={skillsOptions}
            value={data.skillsRequired}
            onChange={handleSkillsChange}
            placeholder="Type to search skills..."
            multiple={true}
            loading={skillsLoading}
            onSearch={(searchTerm) => {
              if (searchTerm.length >= 2 || searchTerm.length === 0) {
                fetchSkills(searchTerm);
              }
            }}
            className="w-full"
          />
        </div>
      </div>

      {}
      <div className="w-full h-px bg-[#D6DDEB]"></div>

      {}
      <Button 
        onClick={handleNext} 
        variant="company"
        className="w-[150px] h-10 bg-[#4640de] hover:bg-[#4640DE]/90 text-white text-sm font-bold rounded-lg"
      >
        Next Step
      </Button>
    </div>
  );
};

export default JobInformationStep;