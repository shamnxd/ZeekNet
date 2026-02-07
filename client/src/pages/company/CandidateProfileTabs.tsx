import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Mail,
  Phone,
  MapPin,
  User,
  Download,
  Briefcase,
} from "lucide-react";
import type { CandidateDetailsResponse } from "@/api/company.api";
import type { CompanySideApplication } from "@/interfaces/company/company-data.interface";
import type { ReactNode } from "react";

interface HiringStageMeta {
  key: string;
  label: string;
  completed: boolean;
  current: boolean;
  disabled: boolean;
}

interface CandidateProfileTabsProps {
  isATSMode: boolean;
  activeTab: "profile" | "resume" | "hiring";
  onChangeTab: (tab: "profile" | "resume" | "hiring") => void;
  hiringStages: HiringStageMeta[];
  selectedStage: string;
  onSelectStage: (stageKey: string) => void;
  renderStageContent: () => ReactNode;
  candidateData: CandidateDetailsResponse | null;
  candidateName: string;
  candidateRole?: string | null;
  candidateAvatar?: string | null;
  candidateEmail?: string | null;
  candidatePhone?: string | null;
  atsApplication: CompanySideApplication | null;
}

const CandidateProfileTabs = ({
  isATSMode,
  activeTab,
  onChangeTab,
  hiringStages,
  selectedStage,
  onSelectStage,
  renderStageContent,
  candidateData,
  candidateName,
  candidateRole,
  candidateAvatar,
  candidateEmail,
  candidatePhone,
  atsApplication,
}: CandidateProfileTabsProps) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      {/* Tabs */}
      <div className="border-b px-6">
        <div className="flex gap-8">
          <button
            onClick={() => onChangeTab("profile")}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "profile"
                ? "border-[#4640DE] text-[#4640DE]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Applicant Profile
          </button>
          <button
            onClick={() => onChangeTab("resume")}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "resume"
                ? "border-[#4640DE] text-[#4640DE]"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Resume
          </button>
          {isATSMode && (
            <button
              onClick={() => onChangeTab("hiring")}
              className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "hiring"
                  ? "border-[#4640DE] text-[#4640DE]"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Hiring Progress
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Hiring Progress Tab */}
        {activeTab === "hiring" && isATSMode && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Hiring Progress</h2>

            {/* Stage Tabs - Clickable stages */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {hiringStages.map((stage) => {
                const isSelected = selectedStage === stage.key;
                const isDisabled = stage.disabled;

                return (
                  <div
                    key={stage.key}
                    className="flex items-center flex-shrink-0"
                  >
                    <button
                      onClick={() => {
                        if (!isDisabled) {
                          onSelectStage(stage.key);
                        }
                      }}
                      disabled={isDisabled}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-[#4640DE] text-white shadow-md"
                          : isDisabled
                          ? "bg-gray-50 text-gray-400 cursor-not-allowed opacity-50"
                          : stage.completed
                          ? "bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer"
                          : stage.current
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
                      }`}
                    >
                      {stage.completed && (
                        <CheckCircle2 className="h-4 w-4 inline mr-1" />
                      )}
                      {stage.current && !stage.completed && (
                        <Circle className="h-4 w-4 inline mr-1 fill-current" />
                      )}
                      {stage.label}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Selected Stage Content */}
            {renderStageContent()}
          </div>
        )}

        {activeTab === "profile" && (candidateData || isATSMode) && (
          <div className="space-y-7">
            {candidateData ? (
              <>
                {/* Personal Info Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#25324B] mb-5">
                    Personal Info
                  </h3>
                  <div className="grid grid-cols-2 gap-6 mb-5">
                    <div>
                      <p className="text-sm text-[#7C8493] mb-1">Full Name</p>
                      <p className="text-sm font-medium text-[#25324B]">
                        {candidateData.user.name ||
                          candidateData.profile.name ||
                          "N/A"}
                      </p>
                    </div>
                    {candidateData.profile.dateOfBirth && (
                      <div>
                        <p className="text-sm text-[#7C8493] mb-1">
                          Date of Birth
                        </p>
                        <p className="text-sm font-medium text-[#25324B]">
                          {new Date(
                            candidateData.profile.dateOfBirth
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                    {candidateData.profile.gender && (
                      <div>
                        <p className="text-sm text-[#7C8493] mb-1">Gender</p>
                        <p className="text-sm font-medium text-[#25324B] capitalize">
                          {candidateData.profile.gender
                            .charAt(0)
                            .toUpperCase() +
                            candidateData.profile.gender.slice(1)}
                        </p>
                      </div>
                    )}
                    {candidateData.profile.languages &&
                      candidateData.profile.languages.length > 0 && (
                        <div>
                          <p className="text-sm text-[#7C8493] mb-1">
                            Language
                          </p>
                          <p className="text-sm font-medium text-[#25324B]">
                            {candidateData.profile.languages.join(", ")}
                          </p>
                        </div>
                      )}
                  </div>
                  {candidateData.profile.location && (
                    <div>
                      <p className="text-sm text-[#7C8493] mb-1">Address</p>
                      <p className="text-sm font-medium text-[#25324B]">
                        {candidateData.profile.location}
                      </p>
                    </div>
                  )}
                </div>

                <div className="h-px bg-[#D6DDEB]"></div>

                {/* Professional Info Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#25324B] mb-5">
                    Professional Info
                  </h3>
                  {candidateData.profile.summary && (
                    <div className="mb-5">
                      <p className="text-sm text-[#7C8493] mb-2">About Me</p>
                      <p className="text-sm text-[#25324B] leading-relaxed">
                        {candidateData.profile.summary}
                      </p>
                    </div>
                  )}
                  {candidateData.profile.skills &&
                    candidateData.profile.skills.length > 0 && (
                      <div>
                        <p className="text-sm text-[#7C8493] mb-2">Skill set</p>
                        <div className="flex flex-wrap gap-2">
                          {candidateData.profile.skills.map(
                            (skill: string, i: number) => (
                              <Badge
                                key={i}
                                variant="secondary"
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                              >
                                {skill}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Profile information not available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "resume" && (
          <div className="space-y-6">
            {/* Header Section with Profile, Contact Info, and View Resume Button */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                {/* Profile Picture */}
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                  {candidateAvatar ? (
                    <img
                      src={candidateAvatar}
                      alt={candidateName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                      {candidateName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name, Role, and Contact Info */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[#25324B] mb-1">
                    {candidateName}
                  </h2>
                  <p className="text-sm text-[#7C8493] mb-3">
                    {candidateRole}
                  </p>

                  {/* Contact Information */}
                  <div className="space-y-1">
                    {candidateEmail && (
                      <div className="flex items-center gap-2 text-sm text-[#25324B]">
                        <Mail className="h-4 w-4 text-[#7C8493]" />
                        <span>{candidateEmail}</span>
                      </div>
                    )}
                    {candidatePhone && candidatePhone !== "-" && (
                      <div className="flex items-center gap-2 text-sm text-[#25324B]">
                        <Phone className="h-4 w-4 text-[#7C8493]" />
                        <span>{candidatePhone}</span>
                      </div>
                    )}
                    {candidateData?.profile?.location && (
                      <div className="flex items-center gap-2 text-sm text-[#25324B]">
                        <MapPin className="h-4 w-4 text-[#7C8493]" />
                        <span>{candidateData.profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View Resume Button */}
              {(atsApplication?.resumeUrl ||
                atsApplication?.resume_url ||
                candidateData?.profile?.resume?.url) && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    window.open(
                      atsApplication?.resumeUrl ||
                        atsApplication?.resume_url ||
                        candidateData?.profile?.resume?.url,
                      "_blank"
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                  View Resume
                </Button>
              )}
            </div>

            {/* Cover Letter */}
            {(atsApplication?.coverLetter || atsApplication?.cover_letter) && (
              <div>
                <h3 className="text-lg font-semibold text-[#25324B] mb-3">
                  Cover Letter
                </h3>
                <p className="text-sm text-[#25324B] whitespace-pre-wrap leading-relaxed">
                  {atsApplication.coverLetter || atsApplication.cover_letter}
                </p>
              </div>
            )}

            {/* Languages */}
            {candidateData?.profile?.languages &&
              candidateData.profile.languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#25324B] mb-3">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {candidateData.profile.languages.map(
                      (lang: string, i: number) => (
                        <span
                          key={i}
                          className="text-sm text-[#25324B]"
                        >
                          {lang}
                          {i <
                          (candidateData.profile.languages?.length || 0) - 1
                            ? ", "
                            : ""}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Experience */}
            {candidateData?.experiences &&
              candidateData.experiences.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-[#25324B] mb-3 uppercase">
                    Experience
                  </h3>
                  <div className="space-y-4">
                    {candidateData.experiences.map((exp, i: number) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#25324B]">
                            {exp.title}
                          </h4>
                          <p className="text-sm text-[#7C8493]">
                            {exp.company} •{" "}
                            {exp.employmentType || "Full-time"}
                          </p>
                          <p className="text-sm text-[#7C8493] mt-1">
                            {new Date(exp.startDate).toLocaleDateString(
                              "en-US",
                              { month: "short", year: "numeric" }
                            )}{" "}
                            -{" "}
                            {exp.endDate
                              ? new Date(
                                  exp.endDate
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Present"}
                          </p>
                          {exp.location && (
                            <p className="text-sm text-[#7C8493] mt-1">
                              {exp.location}
                            </p>
                          )}
                          {exp.description && (
                            <p className="text-sm text-[#25324B] mt-2 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                          {exp.technologies &&
                            exp.technologies.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {exp.technologies.map(
                                  (tech: string, idx: number) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {tech}
                                    </Badge>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfileTabs;

