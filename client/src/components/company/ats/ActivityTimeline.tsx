import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, User } from 'lucide-react';
import { ActivityType } from '@/constants/ats-stages';

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  performedByName: string;
  createdAt: string;
  stage?: string;
  subStage?: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  formatDateTime: (dateString: string) => string;
}


const getActivityTypeColor = (type: string): string => {
  
  if (type === ActivityType.STAGE_CHANGE || type === ActivityType.SUBSTAGE_CHANGE) {
    return '#3B82F6'; 
  }
  
  if (type === ActivityType.COMMENT_ADDED || type === ActivityType.NOTE_ADDED) {
    return '#6B7280'; 
  }
  
  if (
    type === ActivityType.INTERVIEW_SCHEDULED ||
    type === ActivityType.INTERVIEW_COMPLETED ||
    type === ActivityType.INTERVIEW_CANCELLED
  ) {
    return '#9333EA'; 
  }
  
  if (
    type === ActivityType.COMPENSATION_INITIATED ||
    type === ActivityType.COMPENSATION_UPDATED ||
    type === ActivityType.COMPENSATION_APPROVED ||
    type === ActivityType.COMPENSATION_MEETING_SCHEDULED
  ) {
    return '#10B981'; 
  }
  
  if (
    type === ActivityType.OFFER_SENT ||
    type === ActivityType.OFFER_ACCEPTED ||
    type === ActivityType.OFFER_DECLINED
  ) {
    return '#F97316'; 
  }
  
  if (
    type === ActivityType.TASK_ASSIGNED ||
    type === ActivityType.TASK_SUBMITTED ||
    type === ActivityType.TASK_COMPLETED
  ) {
    return '#6366F1'; 
  }
  
  return '#6B7280';
};


const formatDateForGrouping = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};


const formatDateHeader = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  }
  if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


const groupActivitiesByDate = (activities: Activity[]): Map<string, Activity[]> => {
  const grouped = new Map<string, Activity[]>();
  
  activities.forEach((activity) => {
    const dateKey = formatDateForGrouping(activity.createdAt);
    if (!grouped.has(dateKey)) {
      grouped.set(dateKey, []);
    }
    grouped.get(dateKey)!.push(activity);
  });

  return grouped;
};


const TimelineItem = memo(({ 
  activity, 
  isLast, 
  formatDateTime 
}: { 
  activity: Activity; 
  isLast: boolean; 
  formatDateTime: (dateString: string) => string;
}) => {
  const dotColor = getActivityTypeColor(activity.type);

  return (
    <div className="flex gap-4 relative">
      {}
      <div className="flex flex-col items-center flex-shrink-0">
        {}
        <div
          className="w-3 h-3 rounded-full border-2 border-white shadow-sm z-10"
          style={{ backgroundColor: dotColor }}
        />
        {}
        {!isLast && (
          <div
            className="w-0.5 flex-1 mt-1"
            style={{ backgroundColor: '#E5E7EB' }}
          />
        )}
      </div>

      {}
      <div className="flex-1 min-w-0 pb-6">
        <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                {activity.title || 'Activity'}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {activity.description || activity.type || 'No description'}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                {activity.performedByName && (
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {activity.performedByName}
                  </span>
                )}
                {activity.createdAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(activity.createdAt)}
                  </span>
                )}
                {activity.stage && (
                  <Badge variant="secondary" className="text-xs">
                    {activity.stage}
                  </Badge>
                )}
                {activity.subStage && (
                  <Badge variant="outline" className="text-xs">
                    {activity.subStage.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TimelineItem.displayName = 'TimelineItem';

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  onLoadMore,
  isLoadingMore = false,
  hasMore = false,
  formatDateTime,
}) => {
  
  const groupedActivities = groupActivitiesByDate(activities);
  
  
  const sortedDateKeys = Array.from(groupedActivities.keys()).sort();

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No activities found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDateKeys.map((dateKey, dateIndex) => {
        const dateActivities = groupedActivities.get(dateKey)!;
        const isLastDateGroup = dateIndex === sortedDateKeys.length - 1;

        return (
          <div key={dateKey} className="space-y-0">
            {}
            <div className="sticky top-0 bg-white z-10 py-2 mb-4">
              <h3 className="text-sm font-semibold text-gray-700">
                {formatDateHeader(dateKey)}
              </h3>
            </div>

            {}
            <div className="space-y-0">
              {dateActivities.map((activity, activityIndex) => {
                const isLastActivityInGroup = activityIndex === dateActivities.length - 1;
                
                const isLastActivityInTimeline = isLastDateGroup && isLastActivityInGroup;
                
                const shouldShowConnector = !isLastActivityInTimeline || hasMore;

                return (
                  <TimelineItem
                    key={activity.id || `${dateKey}-${activityIndex}`}
                    activity={activity}
                    isLast={!shouldShowConnector}
                    formatDateTime={formatDateTime}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="px-4 py-2 text-sm font-medium text-[#4640DE] bg-white border border-[#4640DE] rounded-lg hover:bg-[#4640DE]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-[#4640DE] border-t-transparent rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              'View More'
            )}
          </button>
        </div>
      )}

      {!hasMore && activities.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          End of activity log
        </div>
      )}
    </div>
  );
};

