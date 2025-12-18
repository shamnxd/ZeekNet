import { useState, useCallback } from "react";
import type { JobPostingData } from "@/interfaces/job/job-posting-data.interface";

class RequiredRule {
  validate(value: string): { isValid: boolean; errorMessage?: string } {
    return {
      isValid: value.trim().length > 0,
      errorMessage: "This field is required"
    };
  }
}

class MinLengthRule {
  minLength: number;
  
  constructor(minLength: number) {
    this.minLength = minLength;
  }
  
  validate(value: string): { isValid: boolean; errorMessage?: string } {
    return {
      isValid: value.length >= this.minLength,
      errorMessage: `Minimum length is ${this.minLength} characters`
    };
  }
}

class MaxLengthRule {
  maxLength: number;
  
  constructor(maxLength: number) {
    this.maxLength = maxLength;
  }
  
  validate(value: string): { isValid: boolean; errorMessage?: string } {
    return {
      isValid: value.length <= this.maxLength,
      errorMessage: `Maximum length is ${this.maxLength} characters`
    };
  }
}

class ArrayMinLengthRule {
  minLength: number;
  
  constructor(minLength: number) {
    this.minLength = minLength;
  }
  
  validate(value: unknown[]): { isValid: boolean; errorMessage?: string } {
    return {
      isValid: Array.isArray(value) && value.length >= this.minLength,
      errorMessage: `At least ${this.minLength} items are required`
    };
  }
}

class BaseValidator<T> {
  rules: Array<{ validate: (value: T) => { isValid: boolean; errorMessage?: string } }> = [];

  addRule(rule: { validate: (value: T) => { isValid: boolean; errorMessage?: string } }): this {
    this.rules.push(rule);
    return this;
  }

  validate(value: T): { isValid: boolean; errorMessage?: string } {
    for (const rule of this.rules) {
      const result = rule.validate(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  }
}

export const useJobDescriptionForm = (
  data: JobPostingData,
  onDataChange: (updates: Partial<JobPostingData>) => void
) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = useCallback((field: keyof JobPostingData, value: string | string[]) => {
    if (field === 'responsibilities' || field === 'qualifications' || field === 'niceToHaves') {
      if (Array.isArray(value)) {
        onDataChange({ [field]: value });
      } else {
        const lines = value.split('\n').filter(line => line.trim());
        onDataChange({ [field]: lines });
      }
    } else {
      onDataChange({ [field]: value as string });
    }
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: "" }));
    }
  }, [onDataChange, errors]);

  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    
    const descriptionValidator = new BaseValidator<string>()
      .addRule(new RequiredRule())
      .addRule(new MinLengthRule(10))
      .addRule(new MaxLengthRule(500));
    
    const responsibilitiesValidator = new BaseValidator<string[]>()
      .addRule(new ArrayMinLengthRule(1));
    
    const qualificationsValidator = new BaseValidator<string[]>()
      .addRule(new ArrayMinLengthRule(1));
    
    const descriptionResult = descriptionValidator.validate(data.description);
    if (!descriptionResult.isValid) {
      newErrors.description = descriptionResult.errorMessage || "Job description is required";
    }
    
    const responsibilitiesResult = responsibilitiesValidator.validate(data.responsibilities);
    if (!responsibilitiesResult.isValid) {
      newErrors.responsibilities = responsibilitiesResult.errorMessage || "At least one responsibility is required";
    }
    
    const qualificationsResult = qualificationsValidator.validate(data.qualifications);
    if (!qualificationsResult.isValid) {
      newErrors.qualifications = qualificationsResult.errorMessage || "At least one qualification is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    errors,
    handleFieldChange,
    validateFields,
  };
};