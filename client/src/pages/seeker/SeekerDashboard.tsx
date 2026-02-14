import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, ChevronRight, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAppSelector } from '@/hooks/useRedux';
import { jobApplicationApi } from '@/api';
import { jobApi } from '@/api/job.api';
import { seekerApi } from '@/api/seeker.api';
import { atsService } from '@/services/ats.service';
import JobCard from '@/components/jobs/JobCard';
import type { Application } from '@/interfaces/application/application.interface';
import type { JobPostingResponse } from '@/interfaces/job/job-posting-response.interface';
import { formatATSStage } from '@/utils/formatters';

type ScheduleItem = {
  id: string;
  time: string;
  title: string;
  company: string;
  position: string;
  type: string;
  applicationId: string;
};

function SeekerDashboard() {
  const { name } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [totalApplied, setTotalApplied] = useState(0);
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [recommendedJobs, setRecommendedJobs] = useState<JobPostingResponse[]>([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await jobApplicationApi.getSeekerApplications({ page: 1, limit: 100 });
        const data = res?.data?.data || res?.data;
        const list = data?.applications || [];
        const total = data?.pagination?.total ?? 0;
        setApplications(list);
        setTotalApplied(total);
      } catch {
        setApplications([]);
        setTotalApplied(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadSchedule = async () => {
      if (applications.length === 0) {
        setSchedule([]);
        return;
      }
      setScheduleLoading(true);
      const appMap = new Map<string, { company: string; job: string }>();
      applications.slice(0, 15).forEach((a) => {
        const id = a?.id || a?._id;
        if (id) appMap.set(id, { company: a?.company_name || a?.companyName || 'Company', job: a?.job_title || a?.jobTitle || 'Job' });
      });
      const today = new Date().toDateString();
      const items: ScheduleItem[] = [];
      const appIds = applications.slice(0, 15).map((a) => a?.id || a?._id).filter(Boolean) as string[];
      await Promise.all(
        appIds.map(async (appId) => {
          try {
            const [intRes, meetRes] = await Promise.all([
              atsService.getInterviewsByApplicationForSeeker(appId),
              atsService.getCompensationMeetingsForSeeker(appId),
            ]);
            const ints = Array.isArray(intRes?.data) ? intRes.data : (intRes?.data ? [intRes.data] : []);
            const meets = Array.isArray(meetRes) ? meetRes : (Array.isArray(meetRes?.data) ? meetRes.data : meetRes?.data ? [meetRes.data] : []);
            const info = appMap.get(appId) || { company: 'Company', job: 'Job' };
            for (const i of ints) {
              if (i?.status !== 'scheduled') continue;
              const d = i?.scheduledDate ? new Date(i.scheduledDate) : null;
              if (!d || d.toDateString() !== today) continue;
              items.push({
                id: `int-${i.id}`,
                time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                title: i.title || 'Interview',
                company: info.company,
                position: info.job,
                type: i.videoType === 'in-app' ? 'In-App Video' : (i.meetingLink ? 'Video Call' : 'Interview'),
                applicationId: appId,
              });
            }
            for (const m of meets) {
              if (m?.status !== 'scheduled') continue;
              const d = m?.scheduledDate ? new Date(m.scheduledDate) : null;
              if (!d || d.toDateString() !== today) continue;
              items.push({
                id: `meet-${m.id}`,
                time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
                title: 'Compensation meeting',
                company: info.company,
                position: info.job,
                type: m.meetingLink ? 'Video Call' : 'Meeting',
                applicationId: appId,
              });
            }
          } catch { /* ignore */ }
        }),
      );
      items.sort((a, b) => a.time.localeCompare(b.time));
      setSchedule(items);
      setScheduleLoading(false);
    };
    loadSchedule();
  }, [applications]);

  useEffect(() => {
    const loadRecommended = async () => {
      setRecommendedLoading(true);
      try {
        let search: string | undefined;
        const profileRes = await seekerApi.getProfile().catch(() => null);
        const profile = profileRes?.data;
        if (profile?.skills?.length) search = profile.skills[0];
        else if (profile?.headline?.trim()) search = profile.headline.trim();
        const res = await jobApi.getAllJobs({ search, page: 1, limit: 6 });
        const list = res?.data?.jobs || [];
        setRecommendedJobs(Array.isArray(list) ? list : []);
      } catch {
        setRecommendedJobs([]);
      } finally {
        setRecommendedLoading(false);
      }
    };
    loadRecommended();
  }, []);

  const interviewedCount = applications.filter((a) => String(a?.stage || '').toLowerCase() === 'interview').length;
  const shortlistedCount = applications.filter((a) => String(a?.stage || '').toLowerCase() === 'shortlisted').length;
  const recentApps = applications.slice(0, 3);

  const stats = [
    {
      label: 'Total Jobs Applied',
      value: loading ? '...' : String(totalApplied),
      icon: FileText,
      bgColor: 'bg-gradient-to-br from-[#4640de]/10 to-[#6366f1]/10',
      iconColor: 'text-[#4640de]',
    },
    {
      label: 'Interviewed',
      value: loading ? '...' : String(interviewedCount),
      icon: Users,
      bgColor: 'bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10',
      iconColor: 'text-[#10b981]',
    },
    {
      label: 'Total Shortlisted',
      value: loading ? '...' : String(shortlistedCount),
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-[#f59e0b]/10 to-[#d97706]/10',
      iconColor: 'text-[#f59e0b]',
    },
  ];

  return (
    <div className="px-8 xl:px-8 py-3 space-y-5 bg-[#f8f9ff] min-h-screen">

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-[26px] font-bold text-[#1f2937]">
            {name ? `Hi, ${name.split(' ')[0] || name}! 👋` : 'Hi! 👋'}
          </h1>
          <p className="text-[14px] text-[#6b7280] leading-relaxed">
            Here's what's happening with your job search applications this week.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5 bg-white border border-[#e5e7eb] rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-[#6b7280] mb-1">{stat.label}</p>
                  <p className="text-[28px] font-bold text-[#1f2937] leading-none">{stat.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        <Card className="lg:col-span-2 bg-white border border-[#e5e7eb] rounded-lg shadow-sm !p-0 !gap-0 overflow-hidden">
          <div className="p-5 border-b border-[#e5e7eb] bg-gradient-to-r from-[#f8f9ff] to-white">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#1f2937]">Recent Applications</h3>
              <button onClick={() => navigate('/seeker/applications')} className="text-[#4640de] text-[12px] font-medium hover:underline flex items-center gap-1">
                View All Applications
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#e5e7eb]">
            {loading ? (
              <div className="p-8 text-center text-[#6b7280] text-sm">Loading...</div>
            ) : recentApps.length === 0 ? (
              <div className="p-8 text-center text-[#6b7280] text-sm">No applications yet</div>
            ) : (
              recentApps.map((app, idx) => (
                <div
                  key={app?.id || app?._id || idx}
                  className="p-5 hover:bg-[#f8f9ff] transition-colors duration-200 bg-white"
                  role="button"
                  tabIndex={0}
                  onClick={() => (app?.id || app?._id) && navigate(`/seeker/applications/${app.id || app._id}`)}
                  onKeyDown={(e) => e.key === 'Enter' && (app?.id || app?._id) && navigate(`/seeker/applications/${app.id || app._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#eef2ff] text-[#4338ca] font-semibold">
                        {app?.company_logo ? (
                          <img src={app.company_logo} alt="" className="w-11 h-11 rounded-full object-cover" />
                        ) : (
                          (app?.company_name || app?.companyName || 'C').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-[#1f2937] mb-1">{app?.job_title || app?.jobTitle || 'Job'}</h4>
                        <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-1">
                          <span className="font-medium text-[#374151]">{app?.company_name || app?.companyName || '-'}</span>
                        </div>
                        <p className="text-[12px] text-[#6b7280]">
                          {app?.applied_date ? new Date(app.applied_date).toLocaleDateString() : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="px-3 py-1 rounded-full text-[11px] font-bold">
                        {formatATSStage((app?.stage as string) || 'Applied')}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5 bg-white border border-[#e5e7eb] rounded-lg shadow-sm">
          <h3 className="text-[16px] font-bold text-[#1f2937] mb-4">Today's Schedule</h3>
          <div className="space-y-4">
            {scheduleLoading ? (
              <div className="p-4 text-center text-[#6b7280] text-sm">Loading...</div>
            ) : schedule.length === 0 ? (
              <div className="p-4 text-center text-[#6b7280] text-sm">No meetings or interviews today</div>
            ) : (
              schedule.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gradient-to-r from-[#f8f9ff] to-white rounded-lg border border-[#e5e7eb] cursor-pointer hover:border-[#4640de]/30 transition-colors"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/seeker/applications/${item.applicationId}`)}
                  onKeyDown={(e) => e.key === 'Enter' && navigate(`/seeker/applications/${item.applicationId}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#eef2ff]">
                      <Calendar className="w-5 h-5 text-[#4640de]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-[#1f2937]">{item.title}</p>
                      <p className="text-[11px] text-[#6b7280]">{item.position} at {item.company}</p>
                      <p className="text-[11px] text-[#4640de] font-medium">{item.type}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[13px] font-bold text-[#1f2937]">{item.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm !p-0 !gap-0">
        <div className="p-6 border-b border-[#e5e7eb] bg-gradient-to-r from-[#f8f9ff] to-white">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#1f2937]">Recommended Jobs</h3>
            <button
              onClick={() => navigate('/jobs')}
              className="text-[#4640de] text-[12px] font-medium hover:underline flex items-center gap-1"
            >
              View All Jobs
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedLoading ? (
            <div className="col-span-full p-8 text-center text-[#6b7280] text-sm">Loading...</div>
          ) : recommendedJobs.length === 0 ? (
            <div className="col-span-full p-8 text-center text-[#6b7280] text-sm">No recommended jobs</div>
          ) : (
            recommendedJobs.map((job) => (
              <JobCard
                key={job.id || job._id}
                job={job}
                onViewDetails={(id) => navigate(`/jobs/${id}`)}
              />
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

export default SeekerDashboard;