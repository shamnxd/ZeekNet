import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBadge } from "@/components/ui/score-badge";
import {
  Mail,
  Phone,
  MessageCircle,
  Globe,
  Instagram,
  Twitter,
  X,
} from "lucide-react";
import type { CandidateDetailsResponse } from "@/api/company.api";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { JobPostingResponse } from "@/interfaces/job/job-posting-response.interface";
import { ATSStage, OfferSubStage } from "@/constants/ats-stages";

interface CandidateProfileSidebarProps {
  isATSMode: boolean;
  candidateName: string;
  candidateRole?: string | null;
  candidateAvatar?: string | null;
  candidateEmail?: string | null;
  candidatePhone?: string | null;
  candidateData?: CandidateDetailsResponse | null;
  atsApplication?: CompanySideApplication | null;
  atsJob?: JobPostingResponse | null;
  candidateScore: number;
  onScheduleInterview?: () => void;
  onOpenChat?: () => void;
  onReject?: () => void;
}

const getInitials = (name: string) => {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "CN"
  );
};

const getTimeAgo = (dateString: string) => {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const CandidateProfileSidebar = ({
  isATSMode,
  candidateName,
  candidateRole,
  candidateAvatar,
  candidateEmail,
  candidatePhone,
  candidateData,
  atsApplication,
  atsJob,
  candidateScore,
  onScheduleInterview,
  onOpenChat,
  onReject,
}: CandidateProfileSidebarProps) => {
  const canShowRejectButton = useMemo(() => {
    if (!atsApplication) return false;

    const isOfferStage = atsApplication.stage === ATSStage.OFFER;
    const subStage = atsApplication.subStage;

    if (isOfferStage) {
      if (
        subStage === OfferSubStage.OFFER_SENT ||
        subStage === OfferSubStage.OFFER_DECLINED ||
        subStage === OfferSubStage.OFFER_ACCEPTED
      ) {
        return false;
      }
    }

    return true;
  }, [atsApplication]);

  return (
    <Card className="border border-[#D6DDEB] rounded-lg shadow-sm">
      <CardContent className="p-5">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-5">
          <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
            {candidateAvatar ? (
              <AvatarImage
                src={candidateAvatar}
                alt={candidateName}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-[#4640DE]/10 text-[#4640DE] text-lg font-semibold">
              {getInitials(candidateName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2
              className="text-lg font-semibold text-[#25324B] mb-1 truncate"
              title={candidateName}
            >
              {candidateName}
            </h2>
            <p
              className="text-sm text-[#7C8493] mb-3 truncate"
              title={candidateRole || undefined}
            >
              {candidateRole}
            </p>

            {isATSMode && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    ATS Match Score
                  </span>
                  <ScoreBadge score={candidateScore} />
                </div>
                <div className="flex items-center gap-3">
                  {candidateScore === -1 || candidateScore === undefined ? (
                    <>
                      <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-400 animate-pulse"
                          style={{ width: "50%" }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-500 min-w-[4rem] text-right">
                        Calculating...
                      </span>
                    </>
                  ) : (
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          candidateScore >= 70
                            ? "bg-green-500"
                            : candidateScore >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${candidateScore}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {isATSMode && (
          <>
            <div className="bg-[#F8F8FD] rounded-lg p-4 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#25324B]">
                  Applied Jobs
                </span>
                <span className="text-sm text-[#7C8493]">
                  {getTimeAgo(atsApplication?.applied_date || "")}
                </span>
              </div>
              <div className="h-px bg-[#D6DDEB] mb-3"></div>
              <div>
                <p
                  className="text-sm font-semibold text-[#25324B] mb-1 line-clamp-1"
                  title={atsJob?.title || atsApplication?.job?.title}
                >
                  {atsJob?.title ||
                    atsApplication?.job?.title ||
                    "Job Title"}
                </p>
                <div className="flex items-center gap-2 text-xs text-[#7C8493]">
                  <span>{atsJob?.company_name || "ZeekNet"}</span>
                  <span>•</span>
                  <span>
                    {atsJob?.employmentTypes?.join(", ") || "Full-time"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F8FD] rounded-lg p-4 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#25324B]">
                  Stage
                </span>
              </div>
              <div className="h-px bg-[#D6DDEB] mb-3"></div>
              <Badge className="bg-[#4640DE] hover:bg-[#3730A3] text-white border-none py-1">
                {atsApplication?.stage || "Applied"}
              </Badge>
              {atsApplication?.stage !== "APPLIED" && (
                <p className="text-xs text-gray-500 mt-2">
                  Sub-stage:{" "}
                  {atsApplication?.subStage?.replace(/_/g, " ") || "-"}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-5">
              {atsApplication?.stage === ATSStage.SHORTLISTED && (
                <Button
                  variant="outline"
                  className="w-full border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white transition-colors"
                  onClick={onScheduleInterview}
                >
                  Schedule Interview
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-[#CCCCF5] text-[#4640DE] hover:bg-[#4640DE] hover:text-white transition-colors"
                  onClick={onOpenChat}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat
                </Button>
                {canShowRejectButton && (
                  <Button
                    variant="outline"
                    className="flex-1 border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    onClick={onReject}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        <div className="h-px bg-[#D6DDEB] mb-5"></div>

        <div>
          <h3 className="text-lg font-semibold text-[#25324B] mb-4">
            Contact
          </h3>
          <div className="space-y-4">
            {candidateEmail && (
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-[#7C8493] mb-0.5">Email</p>
                  <a
                    href={`mailto:${candidateEmail}`}
                    className="text-sm font-medium text-[#25324B] truncate block hover:text-[#4640DE]"
                  >
                    {candidateEmail}
                  </a>
                </div>
              </div>
            )}
            {candidatePhone && candidatePhone !== "-" && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#7C8493] mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-[#25324B]">
                    {candidatePhone}
                  </p>
                </div>
              </div>
            )}

            {/* Socials from array */}
            {candidateData?.profile?.socialLinks?.map((social, idx) => {
              let Icon = Globe;
              if (social.name.toLowerCase().includes("instagram"))
                Icon = Instagram;
              else if (social.name.toLowerCase().includes("twitter"))
                Icon = Twitter;

              return (
                <div key={idx} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 text-[#7C8493] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-[#7C8493] mb-0.5 capitalize">
                      {social.name}
                    </p>
                    <a
                      href={
                        social.link.startsWith("http")
                          ? social.link
                          : `https://${social.link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#4640DE] hover:underline break-all"
                    >
                      {social.link.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateProfileSidebar;

