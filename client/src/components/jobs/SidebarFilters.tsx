import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  IndianRupee,
  Briefcase,
  X
} from "lucide-react";
import type { JobPostingQuery } from "@/interfaces/job/job-posting-query.interface";
import type { SidebarFiltersProps } from '@/interfaces/job/sidebar-filters-props.interface';

const employmentTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

const salaryRanges = [
  { value: '0-500000', label: 'Under ₹5L', min: 0, max: 500000 },
  { value: '500000-1000000', label: '₹5L - ₹10L', min: 500000, max: 1000000 },
  { value: '1000000-2000000', label: '₹10L - ₹20L', min: 1000000, max: 2000000 },
  { value: '2000000-5000000', label: '₹20L - ₹50L', min: 2000000, max: 5000000 },
  { value: '5000000-10000000', label: '₹50L - ₹1Cr', min: 5000000, max: 10000000 },
  { value: '10000000+', label: '₹1Cr+', min: 10000000, max: 999999999 },
];

const SidebarFilters = ({ onSearch, loading = false }: SidebarFiltersProps) => {
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<string[]>([]);
  const [selectedSalaryRange, setSelectedSalaryRange] = useState<{min: number, max: number} | null>(null);

  const handleEmploymentTypeToggle = (type: string) => {
    setSelectedEmploymentTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSalaryRangeSelect = (range: {min: number, max: number}) => {
    setSelectedSalaryRange(prev => 
      prev?.min === range.min && prev?.max === range.max ? null : range
    );
  };

  const handleApplyFilters = () => {
    const query: JobPostingQuery = {
      employment_types: selectedEmploymentTypes.length > 0 ? selectedEmploymentTypes : undefined,
      salary_min: selectedSalaryRange?.min,
      salary_max: selectedSalaryRange?.max,
    };
    
    Object.keys(query).forEach(key => {
      if (query[key as keyof JobPostingQuery] === undefined) {
        delete query[key as keyof JobPostingQuery];
      }
    });
    onSearch(query);
  };

  const clearFilters = () => {
    setSelectedEmploymentTypes([]);
    setSelectedSalaryRange(null);
    onSearch({});
  };

  const hasActiveFilters = selectedEmploymentTypes.length > 0 || selectedSalaryRange;

  return (
    <div className="space-y-6">
      {}
      <div>
        <h3 className="text-[18px] font-medium text-[#141414] mb-4 flex items-center gap-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <Briefcase className="w-4 h-4" />
          Employment Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {employmentTypes.map((type) => (
            <Badge
              key={type.value}
              variant={selectedEmploymentTypes.includes(type.value) ? "default" : "outline"}
              className={`cursor-pointer transition-all text-sm ${
                selectedEmploymentTypes.includes(type.value)
                  ? 'bg-[#3570E2] text-white border-[#3570E2]'
                  : 'hover:bg-gray-100 border-gray-200 text-[#394047]'
              }`}
              onClick={() => handleEmploymentTypeToggle(type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </div>

      {}
      <div>
        <h3 className="text-[18px] font-medium text-[#141414] mb-4 flex items-center gap-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          <IndianRupee className="w-4 h-4" />
          Salary Range
        </h3>
        <div className="space-y-2">
          {salaryRanges.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="salary"
                checked={selectedSalaryRange?.min === range.min && selectedSalaryRange?.max === range.max}
                onChange={() => handleSalaryRangeSelect({min: range.min, max: range.max})}
                className="w-4 h-4 border-gray-300 text-[#3570E2] focus:ring-[#3570E2] focus:ring-2"
              />
              <span className="text-[16px] text-[#394047]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {}
      {hasActiveFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#141414]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Active Filters:
            </span>
            <button
              onClick={clearFilters}
              className="text-xs text-[#3570E2] hover:text-[#3570E2]/80"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedEmploymentTypes.map((type) => (
              <Badge key={type} variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                {employmentTypes.find(t => t.value === type)?.label}
                <button
                  onClick={() => handleEmploymentTypeToggle(type)}
                  className="ml-2 hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {selectedSalaryRange && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 text-xs">
                {salaryRanges.find(r => r.min === selectedSalaryRange.min)?.label}
                <button
                  onClick={() => setSelectedSalaryRange(null)}
                  className="ml-2 hover:bg-orange-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      {}
      <Button
        onClick={handleApplyFilters}
        disabled={loading}
        className="w-full bg-[#3570E2] hover:bg-[#3570E2]/90 text-white"
      >
        {loading ? "Applying..." : "Apply Filters"}
      </Button>
    </div>
  );
};

export default SidebarFilters;

