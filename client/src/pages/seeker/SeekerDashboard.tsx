import { FileText, Users, Calendar, ChevronRight, ChevronLeft, MoreVertical, TrendingUp } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '@/components/ui/button';

export function SeekerDashboard() {
  const stats = [
    {
      label: 'Total Jobs Applied',
      value: '45',
      icon: FileText,
      bgColor: 'bg-gradient-to-br from-[#4640de]/10 to-[#6366f1]/10',
      iconColor: 'text-[#4640de]',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Interviewed',
      value: '18',
      icon: Users,
      bgColor: 'bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10',
      iconColor: 'text-[#10b981]',
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Response Rate',
      value: '40%',
      icon: TrendingUp,
      bgColor: 'bg-gradient-to-br from-[#f59e0b]/10 to-[#d97706]/10',
      iconColor: 'text-[#f59e0b]',
      change: '+5%',
      changeType: 'positive'
    },
  ];

  const upcomingInterviews = [
    {
      time: '10:00 AM',
      interviewer: 'Joe Bartmann',
      company: 'Divvy',
      position: 'HR Manager',
      type: 'Video Call',
      avatar: 'JB'
    },
    {
      time: '2:30 PM',
      interviewer: 'Sarah Chen',
      company: 'TechCorp',
      position: 'Senior Developer',
      type: 'Phone Call',
      avatar: 'SC'
    }
  ];

  return (
    <div className="px-8 xl:px-11 py-9 space-y-6 bg-[#f8f9ff] min-h-screen">
      
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-[26px] font-bold text-[#1f2937]">
            Good morning, Jake! 👋
          </h1>
          <p className="text-[14px] text-[#6b7280] leading-relaxed">
            Here's what's happening with your job search applications this week.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white border border-[#e5e7eb] rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
            <Calendar className="w-4 h-4 text-[#4640de]" />
            <span className="text-[12px] font-medium text-[#374151]">
              Jul 19 - Jul 25
            </span>
          </div>
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
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-[#10b981]" />
                    <span className="text-[11px] font-medium text-[#10b981]">{stat.change}</span>
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
              <button className="text-[#4640de] text-[12px] font-medium hover:underline flex items-center gap-1">
                View All Applications
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-[#e5e7eb]">
            <div className="p-5 hover:bg-[#f8f9ff] transition-colors duration-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center">
                    <img src="/facebook.png" alt="Facebook Logo" className="w-11 h-11" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1f2937] mb-1">Frontend Developer</h4>
                    <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-1">
                      <span className="font-medium text-[#374151]">Facebook</span>
                      <span>•</span>
                      <span>Menlo Park, CA</span>
                      <span>•</span>
                      <span>Full-time</span>
                    </div>
                    <p className="text-[12px] font-medium text-[#10b981]">$90k - $130k</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-[#6b7280] mb-1">Applied</p>
                    <p className="text-[12px] font-medium text-[#374151]">Oct 24, 2023</p>
                  </div>
                  <Badge variant="seekrPending" className="px-3 py-1 rounded-full text-[11px] font-bold">
                    Pending
                  </Badge>
                  <button className="p-2 hover:bg-[#f3f4f6] rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-[#6b7280]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 hover:bg-[#f8f9ff] transition-colors duration-200 bg-[#fafbfc]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <img src="/google.png" alt="Google Logo" className="w-11 h-11" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1f2937] mb-1">UI/UX Designer</h4>
                    <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-1">
                      <span className="font-medium text-[#374151]">Google</span>
                      <span>•</span>
                      <span>Mountain View, CA</span>
                      <span>•</span>
                      <span>Full-time</span>
                    </div>
                    <p className="text-[12px] font-medium text-[#10b981]">$80k - $120k</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-[#6b7280] mb-1">Applied</p>
                    <p className="text-[12px] font-medium text-[#374151]">Oct 22, 2023</p>
                  </div>
                  <Badge variant="seekrInterviewed" className="px-3 py-1 rounded-full text-[11px] font-bold">
                    Interview
                  </Badge>
                  <button className="p-2 hover:bg-[#f3f4f6] rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-[#6b7280]" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 hover:bg-[#f8f9ff] transition-colors duration-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    <img src="/spotify.png" alt="Spotify Logo" className="w-11 h-11" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-bold text-[#1f2937] mb-1">Backend Developer</h4>
                    <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-1">
                      <span className="font-medium text-[#374151]">Spotify</span>
                      <span>•</span>
                      <span>Stockholm, Sweden</span>
                      <span>•</span>
                      <span>Full-time</span>
                    </div>
                    <p className="text-[12px] font-medium text-[#10b981]">$100k - $150k</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-[#6b7280] mb-1">Applied</p>
                    <p className="text-[12px] font-medium text-[#374151]">Oct 20, 2023</p>
                  </div>
                  <Badge variant="seekrAccepted" className="px-3 py-1 rounded-full text-[11px] font-bold">
                    Accepted
                  </Badge>
                  <button className="p-2 hover:bg-[#f3f4f6] rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-[#6b7280]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-white border border-[#e5e7eb] rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[16px] font-bold text-[#1f2937]">Today's Schedule</h3>
            <div className="flex items-center gap-1">
              <button className="p-1 hover:bg-[#f3f4f6] rounded-lg">
                <ChevronLeft className="w-4 h-4 text-[#6b7280]" />
              </button>
              <button className="p-1 hover:bg-[#f3f4f6] rounded-lg">
                <ChevronRight className="w-4 h-4 text-[#6b7280]" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {upcomingInterviews.map((interview, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-[#f8f9ff] to-white rounded-lg border border-[#e5e7eb]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center">
                    <img src="https://img.freepik.com/premium-photo/3d-avatar-cartoon-character_113255-103130.jpg" alt="Google Logo" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-bold text-[#1f2937]">{interview.interviewer}</p>
                    <p className="text-[11px] text-[#6b7280]">{interview.position} at {interview.company}</p>
                    <p className="text-[11px] text-[#4640de] font-medium">{interview.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] font-bold text-[#1f2937]">{interview.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-white border border-[#e5e7eb] rounded-lg shadow-sm !p-0 !gap-0">
        <div className="p-6 border-b border-[#e5e7eb] bg-gradient-to-r from-[#f8f9ff] to-white">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#1f2937]">Recommended Jobs</h3>
            <button className="text-[#4640de] text-[12px] font-medium hover:underline flex items-center gap-1">
              View All Jobs
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-[#e5e7eb]">
          <div className="p-5 hover:bg-[#f8f9ff] transition-colors duration-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <img src="/google.png" alt="Google Logo" className="w-11 h-11" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#1f2937] mb-1">Senior Frontend Developer</h4>
                  <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-1">
                    <span className="font-medium text-[#374151]">Google</span>
                    <span>•</span>
                    <span>Mountain View, CA</span>
                    <span>•</span>
                    <span>Full-time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-medium text-[#10b981]">$120k - $180k</p>
                    <Badge variant="outline" className="text-[11px] text-[#4640de] border-[#4640de]/20">Remote</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[11px] font-medium text-[#6b7280] mb-1">Posted</p>
                  <p className="text-[12px] font-medium text-[#374151]">2 days ago</p>
                </div>
                <Button variant='seeker'>
                  Apply Now
                </Button>
              </div>
            </div>
          </div>

          <div className="p-5 hover:bg-[#f8f9ff] transition-colors duration-200 bg-[#fafbfc]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <img src="/facebook.png" alt="Facebook Logo" className="w-11 h-11" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#1f2937] mb-1">Product Manager</h4>
                  <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-1">
                    <span className="font-medium text-[#374151]">Meta</span>
                    <span>•</span>
                    <span>Menlo Park, CA</span>
                    <span>•</span>
                    <span>Full-time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-medium text-[#10b981]">$130k - $200k</p>
                    <Badge variant="outline" className="text-[11px] text-[#f59e0b] border-[#f59e0b]/20">Hybrid</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[11px] font-medium text-[#6b7280] mb-1">Posted</p>
                  <p className="text-[12px] font-medium text-[#374151]">3 days ago</p>
                </div>
                <Button variant='seeker'>
                  Apply Now
                </Button>
              </div>
            </div>
          </div>

          <div className="p-5 hover:bg-[#f8f9ff] transition-colors duration-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <img src="/instagram.png" alt="Instagram Logo" className="w-11 h-11" />
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-[#1f2937] mb-1">Data Scientist</h4>
                  <div className="flex items-center gap-2 text-[12px] text-[#6b7280] mb-1">
                    <span className="font-medium text-[#374151]">Meta</span>
                    <span>•</span>
                    <span>Los Gatos, CA</span>
                    <span>•</span>
                    <span>Full-time</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-medium text-[#10b981]">$110k - $170k</p>
                    <Badge variant="outline" className="text-[11px] text-[#f59e0b] border-[#f59e0b]/20">On-site</Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[11px] font-medium text-[#6b7280] mb-1">Posted</p>
                  <p className="text-[12px] font-medium text-[#374151]">4 days ago</p>
                </div>
                <Button variant='seeker' className='text-sm'>
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SeekerDashboard;