import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return seekerFaqs;
    return seekerFaqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#25324b]">Help Center</h1>
        <p className="text-sm text-[#7c8493] mt-1">
          Find quick answers for profile, applications, messages, and account support.
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
  );
};

export default SeekerHelpCenter;
