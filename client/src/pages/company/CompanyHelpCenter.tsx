import React from 'react';
import CompanyLayout from '@/components/layouts/CompanyLayout';
import { Card } from '@/components/ui/card';
import { Mail, ShieldCheck, FileText, MessageSquare, Clock, Briefcase, CheckCircle2 } from 'lucide-react';

const companyFaqs = [
  {
    question: 'How do I move candidates in ATS Pipeline?',
    answer: 'Open applicant details and move candidates stage by stage based on screening, interviews, and evaluations.',
  },
  {
    question: 'Where can I view all applications for a job?',
    answer: 'Use All Applicants to filter by job and stage, then open application details for complete candidate context.',
  },
  {
    question: 'How do candidate view limits work?',
    answer: 'Candidate discovery limits apply to Find Candidates browsing. Application-based candidate viewing remains available.',
  },
  {
    question: 'How can I manage subscription and billing?',
    answer: 'Go to Plans & Billing to check limits, billing history, and upgrade or change your active plan.',
  },
  {
    question: 'What should I include when contacting support?',
    answer: 'Share relevant job IDs, candidate IDs, and screenshots so the support team can resolve issues faster.',
  },
  {
    question: 'Why is a candidate shown as blocked in applications?',
    answer: 'Blocked users may still appear in historical records, but actions like messaging may be disabled based on platform rules.',
  },
  {
    question: 'Can I change hiring stages after posting a job?',
    answer: 'Yes, you can adjust workflow in ATS where supported, but keep stage changes consistent to avoid applicant confusion.',
  },
  {
    question: 'How do I improve applicant quality?',
    answer: 'Use clear role titles, required skills, realistic salary range, and specific responsibilities in job descriptions.',
  },
];

const CompanyHelpCenter: React.FC = () => {
  return (
    <CompanyLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#25324b]">Help Center</h1>
          <p className="text-sm text-[#7c8493] mt-1">
            Quick help for hiring, applications, ATS pipeline, billing, and account support.
          </p>
        </div>

        <Card className="p-6 border border-[#d6ddeb]">
          <h2 className="text-lg font-semibold text-[#25324b] mb-4">Getting Started</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-[#e4e7ec] p-4 bg-white">
              <div className="flex items-center gap-2 mb-2 text-[#4640de]">
                <Briefcase className="w-4 h-4" />
                <p className="font-medium text-sm">Post Jobs Effectively</p>
              </div>
              <p className="text-sm text-[#515b6f]">
                Add clear titles, requirements, and hiring stages to attract better applicants.
              </p>
            </div>
            <div className="rounded-lg border border-[#e4e7ec] p-4 bg-white">
              <div className="flex items-center gap-2 mb-2 text-[#4640de]">
                <MessageSquare className="w-4 h-4" />
                <p className="font-medium text-sm">Manage Communication</p>
              </div>
              <p className="text-sm text-[#515b6f]">
                Use Messages and ATS comments to keep candidate communication organized.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[#d6ddeb]">
          <h2 className="text-lg font-semibold text-[#25324b] mb-4">Best Practice Checklist</h2>
          <div className="space-y-3 text-sm text-[#515b6f]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4640de] mt-0.5" />
              <span>Keep job titles specific and searchable (example: Frontend Developer - React).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4640de] mt-0.5" />
              <span>Review applicants daily and move ATS stages consistently to keep pipeline healthy.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4640de] mt-0.5" />
              <span>Use structured interview and task feedback before making final hiring decisions.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4640de] mt-0.5" />
              <span>Track plan usage in Billing so posting and candidate discovery are not interrupted.</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[#d6ddeb]">
          <h2 className="text-lg font-semibold text-[#25324b] mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {companyFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-[#e4e7ec] bg-white">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[#25324b] flex items-center justify-between">
                  {faq.question}
                  <span className="text-[#7c8493] transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-[#515b6f]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Card>

        <Card className="p-6 border border-[#d6ddeb]">
          <h2 className="text-lg font-semibold text-[#25324b] mb-4">Contact Support</h2>
          <div className="space-y-3 text-sm text-[#515b6f]">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#4640de]" />
              <span>Email: support@zeeknet.shamnadt.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4640de]" />
              <span>Support Hours: Monday to Saturday, 9:00 AM - 6:00 PM IST</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4640de]" />
              <span>For billing/security requests, add "Billing" or "Security" in email subject.</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#4640de]" />
              <span>Share job ID or candidate ID in tickets for faster support.</span>
            </div>
          </div>
        </Card>
      </div>
    </CompanyLayout>
  );
};

export default CompanyHelpCenter;
