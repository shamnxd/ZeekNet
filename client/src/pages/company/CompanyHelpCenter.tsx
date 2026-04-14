import React, { useMemo, useState } from 'react';
import CompanyLayout from '@/components/layouts/CompanyLayout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return companyFaqs;
    return companyFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  return (
    <CompanyLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#25324b]">Help Center</h1>
          <p className="text-sm text-[#7c8493] mt-1">
            Quick help for hiring, applications, ATS pipeline, billing, and account support.
          </p>
        </div>

        <div className="">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7c8493]" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search FAQs..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="">
          <h2 className="text-lg font-semibold text-[#25324b] mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <details key={faq.question} className="group rounded-lg border border-[#e4e7ec] bg-white">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-[#25324b] flex items-center justify-between">
                  {faq.question}
                  <span className="text-[#7c8493] transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                </summary>
                <p className="px-4 pb-4 text-sm text-[#515b6f]">{faq.answer}</p>
              </details>
            ))}
            {filteredFaqs.length === 0 && (
              <p className="text-sm text-[#7c8493]">No FAQs found for your search.</p>
            )}
          </div>
        </div>
      </div>
    </CompanyLayout>
  );
};

export default CompanyHelpCenter;
