import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bookmark, Eye, Users, Clock } from "lucide-react";
import type { JobPostingResponse } from "@/types/job";

interface JobCardProps {
  job: JobPostingResponse;
  onViewDetails?: (jobId: string) => void;
}

const JobCard = ({ job, onViewDetails }: JobCardProps) => {
  const formatSalary = (min: number, max: number) => {
    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return `₹${(num / 1000000).toFixed(1)}M`;
      } else if (num >= 1000) {
        return `₹${(num / 1000).toFixed(0)}K`;
      }
      return `₹${num.toLocaleString()}`;
    };
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getEmploymentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'full-time':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'part-time':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'contract':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'internship':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'remote':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails(job.id || job._id);
    }
  };

  return (
    <Card 
      className="hover:shadow-lg hover:border-[#3570E2]/20 transition-all duration-300 group border border-gray-200 bg-white cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      <CardContent className="p-5 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3570E2]/10 to-[#3570E2]/5 rounded-lg flex items-center justify-center flex-shrink-0 border border-[#3570E2]/10">
              {(job.company_logo || job.company?.logo) ? (
                <img 
                  src={job.company_logo || job.company?.logo} 
                  alt={job.company_name || job.company?.companyName || 'Company'}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <span className="text-[#3570E2] font-bold text-lg">
                  {(job.company_name || job.company?.companyName)?.charAt(0) || job.title.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-[#141414] group-hover:text-[#3570E2] transition-colors line-clamp-2 leading-tight mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {job.title}
              </h3>
              <p className="text-sm font-medium text-[#394047] truncate" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {job.company_name || job.company?.companyName || 'Company'}
              </p>
            </div>
          </div>
          <Bookmark 
            className="w-5 h-5 text-gray-300 hover:text-[#3570E2] cursor-pointer transition-colors flex-shrink-0 ml-2" 
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>

        {/* Location */}
        <div className="flex items-center text-[#394047] text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-gray-400" />
          <span className="truncate">{job.location}</span>
        </div>

        {/* Skills */}
        {job.skills_required && job.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills_required.slice(0, 3).map((skill, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs px-2 py-0.5 bg-gray-50 text-[#394047] border-gray-200"
              >
                {skill}
              </Badge>
            ))}
            {job.skills_required.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 border-gray-200"
              >
                +{job.skills_required.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Employment Types */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(job.employment_types ?? []).map((type) => (
            <Badge
              key={type}
              variant="outline"
              className={`text-xs px-2.5 py-1 font-medium ${getEmploymentTypeColor(type)}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </Badge>
          ))}
        </div>

        {/* Salary */}
        <div className="mb-4">
          <span className="text-base font-semibold text-[#141414]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {formatSalary(job.salary.min, job.salary.max)}
          </span>
          <span className="text-sm text-[#394047] ml-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>/year</span>
        </div>

        {/* Stats and Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-[#394047]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{job.view_count || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{job.application_count || 0} applied</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(job.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
