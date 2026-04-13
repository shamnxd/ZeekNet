import React from 'react';
import { Card } from '@/components/ui/card';
import { Mail, ShieldCheck, FileText, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';

const seekerFaqs = [
  {
    question: 'How do I update my public profile details?',
    answer: 'Go to My Public Profile and use the edit actions for profile, about, experience, education, and skills.',
  },
  {
    question: 'How can I fix errors while adding experience or education?',
    answer: 'Make sure required fields are filled, start date is valid, and end date is set only when the entry is not current.',
  },
  {
    question: 'Where do I track job applications?',
    answer: 'Open My Applications to view stage updates, hiring progress, and application-specific details.',
  },
  {
    question: 'How do I communicate with companies?',
    answer: 'Use Messages to respond quickly and professionally. Clear communication helps move applications faster.',
  },
  {
    question: 'How can I keep my account secure?',
    answer: 'Use a strong password, avoid sharing login credentials, and report suspicious activity to support immediately.',
  },
  {
    question: 'Why is my profile not appearing strong to recruiters?',
    answer: 'Add measurable achievements, complete experience details, relevant skills, and keep your resume updated.',
  },
  {
    question: 'What should I do if my resume is not uploading?',
    answer: 'Try a smaller file size, standard file format, and ensure your internet connection is stable before retrying.',
  },
  {
    question: 'How can I improve response rates from companies?',
    answer: 'Apply to relevant roles, personalize your profile headline, and respond quickly in messages.',
  },
];

const SeekerHelpCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#25324b]">Help Center</h1>
        <p className="text-sm text-[#7c8493] mt-1">
          Find quick answers for profile, applications, messages, and account support.
        </p>
      </div>

      <Card className="p-6 border border-[#d6ddeb]">
        <h2 className="text-lg font-semibold text-[#25324b] mb-4">Getting Started</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-[#e4e7ec] p-4 bg-white">
            <div className="flex items-center gap-2 mb-2 text-[#4640de]">
              <FileText className="w-4 h-4" />
              <p className="font-medium text-sm">Complete Your Profile</p>
            </div>
            <p className="text-sm text-[#515b6f]">
              Add your headline, skills, experience, and resume to improve visibility to companies.
            </p>
          </div>
          <div className="rounded-lg border border-[#e4e7ec] p-4 bg-white">
            <div className="flex items-center gap-2 mb-2 text-[#4640de]">
              <MessageSquare className="w-4 h-4" />
              <p className="font-medium text-sm">Use Messages Effectively</p>
            </div>
            <p className="text-sm text-[#515b6f]">
              Keep replies professional and quick to increase your chance of moving forward.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border border-[#d6ddeb]">
        <h2 className="text-lg font-semibold text-[#25324b] mb-4">Profile Improvement Checklist</h2>
        <div className="space-y-3 text-sm text-[#515b6f]">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4640de] mt-0.5" />
            <span>Use a clear headline with role, tech stack, and experience focus.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4640de] mt-0.5" />
            <span>Keep experience dates and responsibilities accurate and up to date.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4640de] mt-0.5" />
            <span>Add skills that match the jobs you apply for most frequently.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#4640de] mt-0.5" />
            <span>Check applications regularly and respond to recruiter messages quickly.</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 border border-[#d6ddeb]">
        <h2 className="text-lg font-semibold text-[#25324b] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {seekerFaqs.map((faq) => (
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
            <span>For account safety concerns, mention "Security" in your subject line.</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SeekerHelpCenter;
