import React from 'react';

interface ScoreBadgeProps {
  score?: number;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  if (score === -1) {
    return (
      <div className="flex w-fit items-center gap-2 border border-blue-200 rounded-full px-3 py-1 text-sm text-blue-600 bg-blue-50 animate-pulse">
        <span className="font-semibold">Processing...</span>
      </div>
    );
  }

  if (score === undefined || score === null) {
    return (
      <div className="flex w-fit items-center gap-2 border border-gray-200 rounded-full px-3 py-1 text-sm text-gray-600 bg-gray-50">
          <span className="font-semibold">0%</span>
      </div>
    );
  }

  let bgColor = '';
  let textColor = '';
  let borderColor = '';
  let dotColor = '';

  if (score >= 80) {
    bgColor = 'bg-green-50';
    textColor = 'text-green-600';
    borderColor = 'border-green-200';
    dotColor = 'bg-green-500';
  } else if (score >= 60) {
    bgColor = 'bg-blue-50';
    textColor = 'text-blue-600';
    borderColor = 'border-blue-200';
    dotColor = 'bg-blue-500';
  } else if (score >= 40) {
    bgColor = 'bg-yellow-50';
    textColor = 'text-yellow-600';
    borderColor = 'border-yellow-200';
    dotColor = 'bg-yellow-500';
  } else {
    bgColor = 'bg-orange-50';
    textColor = 'text-orange-600';
    borderColor = 'border-orange-200';
    dotColor = 'bg-orange-500';
  }

  return (
    <div className={`flex w-fit items-center gap-2 border ${borderColor} rounded-full px-3 py-1 text-sm ${textColor} ${bgColor}`}>
      <div className={`w-2 h-2 rounded-full ${dotColor}`} />
      <span className="font-semibold">{score}%</span>
    </div>
  );
};
