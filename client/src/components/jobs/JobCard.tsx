import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Clock, Star } from "lucide-react";

import type { JobCardProps } from '@/interfaces/job/job-card-props.interface';

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
      const jobId = job.id || job._id;
      if (jobId) {
        onViewDetails(jobId);
      }
    }
  };

  const companyLogo = job.companyLogo || job.company_logo || job.company?.logo;
  const companyName = job.companyName || job.company_name || job.company?.companyName || 'Company';
  const applicationCount = job.applicationCount ?? job.application_count ?? 0;
  const employmentTypes = job.employmentTypes || job.employment_types || [];
  const salary = job.salary || { min: 0, max: 0 };
  const isFeatured = !!(job.isFeatured ?? job.is_featured);

  return (
    <Card
      className={`!p-0 hover:shadow-lg transition-all duration-200 group cursor-pointer ${isFeatured
        ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white shadow-md'
        : 'hover:border-[#3570E2]/20 border border-gray-200 bg-white'
        }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `<div class="!bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                <span class="text-[#3570E2] font-bold text-xl">
                  ${companyName.charAt(0).toUpperCase()}
                </span>
              </div>`;
                }}
              />
            ) : (
              <div className="!bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                <span className="text-[#3570E2] font-bold text-xl">
                  {companyName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-sm text-[#6B7280]">{companyName}</p>
              {isFeatured && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-amber-400 text-amber-600 bg-amber-50 gap-0.5">
                  <Star className="w-3 h-3 fill-amber-500" />
                  Featured
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold text-[#141414] group-hover:text-[#3570E2] transition-colors line-clamp-2 leading-snug" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {job.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-3 text-sm text-[#6B7280] flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{job.location}</span>
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
                {formatSalary(salary.min, salary.max)}
              </span>
            </>
          )}
        </div>

        {job.description && (
          <p className="text-sm text-[#6B7280] line-clamp-2 mb-3 leading-relaxed">
            {job.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
            <Users className="w-4 h-4" />
            <span>{applicationCount} applied</span>
          </div>
          {job.createdAt && (
            <div className="flex items-center gap-1 text-xs text-[#9CA3AF]">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatDate(job.createdAt)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
