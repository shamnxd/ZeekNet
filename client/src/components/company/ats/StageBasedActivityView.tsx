import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, User, CheckCircle2 } from 'lucide-react';
import { ATSStage, ATSStageDisplayNames, SubStageDisplayNames, STAGE_SUB_STAGES } from '@/constants/ats-stages';
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

interface StageBasedActivityViewProps {
  activities: Activity[];
  currentStage?: string;
  enabledStages?: string[];
  onLoadMore?: (stage?: string) => Promise<void>;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  formatDateTime: (dateString: string) => string;
  applicationId?: string; // For per-stage pagination
}

// Pipeline order of stages
const STAGE_ORDER: string[] = [
  ATSStage.IN_REVIEW,
  ATSStage.SHORTLISTED,
  ATSStage.INTERVIEW,
  ATSStage.TECHNICAL_TASK,
  ATSStage.COMPENSATION,
  ATSStage.OFFER,
];


// Group activities by stage
const groupActivitiesByStage = (activities: Activity[]): Map<string, Activity[]> => {
  const grouped = new Map<string, Activity[]>();
  
  activities.forEach((activity) => {
    // Use the activity's stage field, or infer from activity type
    const stage = activity.stage || inferStageFromActivity(activity);
    if (!grouped.has(stage)) {
      grouped.set(stage, []);
    }
    grouped.get(stage)!.push(activity);
  });

  // Sort activities within each stage by createdAt ascending
  grouped.forEach((stageActivities) => {
    stageActivities.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
  });

  return grouped;
};

// Group activities by subStage within a stage
const groupActivitiesBySubStage = (activities: Activity[], stage: string): Map<string, Activity[]> => {
  const grouped = new Map<string, Activity[]>();
  
  // Get the expected sub-stages for this stage to maintain order
  const expectedSubStages = getSubStagesForStage(stage);
  
  activities.forEach((activity) => {
    // Use the activity's subStage field, or infer from activity type/context
    let subStage = activity.subStage;
    
    if (!subStage) {
      // Try to infer sub-stage from activity type
      const type = activity.type;
      if (type === ActivityType.SUBSTAGE_CHANGE) {
        // Try to extract from description or use first sub-stage
        subStage = expectedSubStages.length > 0 ? expectedSubStages[0].key : 'UNKNOWN';
      } else if (type.includes('INTERVIEW')) {
        // For interview activities, try to match to interview sub-stages
        if (type === ActivityType.INTERVIEW_SCHEDULED) {
          subStage = 'SCHEDULED';
        } else if (type === ActivityType.INTERVIEW_COMPLETED) {
          subStage = 'COMPLETED';
        } else {
          subStage = expectedSubStages.length > 0 ? expectedSubStages[0].key : 'UNKNOWN';
        }
      } else if (type.includes('TASK')) {
        // For task activities, try to match to task sub-stages
        if (type === ActivityType.TASK_ASSIGNED) {
          subStage = 'ASSIGNED';
        } else if (type === ActivityType.TASK_SUBMITTED) {
          subStage = 'SUBMITTED';
        } else if (type === ActivityType.TASK_COMPLETED) {
          subStage = 'COMPLETED';
        } else {
          subStage = expectedSubStages.length > 0 ? expectedSubStages[0].key : 'UNKNOWN';
        }
      } else {
        // Default to first sub-stage for the stage
        subStage = expectedSubStages.length > 0 ? expectedSubStages[0].key : 'UNKNOWN';
      }
    }
    
    if (!grouped.has(subStage)) {
      grouped.set(subStage, []);
    }
    grouped.get(subStage)!.push(activity);
  });

  // Sort activities within each sub-stage by createdAt ascending
  grouped.forEach((subStageActivities) => {
    subStageActivities.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    });
  });

  return grouped;
};

// Get sub-stages for a given stage (for ordering)
const getSubStagesForStage = (stage: string): Array<{ key: string; label: string }> => {
  return STAGE_SUB_STAGES[stage as ATSStage] || [];
};

// Infer stage from activity type if stage is not explicitly set
const inferStageFromActivity = (activity: Activity): string => {
  const type = activity.type;
  if (type.includes('INTERVIEW')) return ATSStage.INTERVIEW;
  if (type.includes('TASK')) return ATSStage.TECHNICAL_TASK;
  if (type.includes('COMPENSATION')) return ATSStage.COMPENSATION;
  if (type.includes('OFFER')) return ATSStage.OFFER;
  if (type === ActivityType.STAGE_CHANGE || type === ActivityType.SUBSTAGE_CHANGE) {
    // Try to extract from description or metadata
    return ATSStage.IN_REVIEW; // Default fallback
  }
  return ATSStage.IN_REVIEW; // Default
};

// Activity Item Component (indented under sub-stage, no timeline rail)
const ActivityItem = ({ 
  activity, 
  formatDateTime 
}: { 
  activity: Activity; 
  formatDateTime: (dateString: string) => string;
}) => {
  return (
    <div className="ml-4 mb-3">
      <div className="p-3 border-l-2 border-gray-200 pl-4 hover:bg-gray-50 transition-colors bg-white rounded">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 mb-1">
              {activity.description || activity.title || activity.type || 'No description'}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-Stage Milestone Component (indented under stage)
const SubStageMilestone = ({
  subStage,
  subStageLabel,
  activities,
  isLast,
  formatDateTime,
}: {
  subStage: string;
  subStageLabel: string;
  activities: Activity[];
  isLast: boolean;
  formatDateTime: (dateString: string) => string;
}) => {
  return (
    <div className="flex gap-4 relative ml-6">
      {/* Timeline rail - indented */}
      <div className="flex flex-col items-start flex-shrink-0">
        {/* Sub-stage dot - smaller, indented */}
        <div className="w-3 h-3 rounded-full bg-[#4640DE] border-2 border-white shadow-sm z-10" />
        {/* Vertical line - only show if not last sub-stage */}
        {!isLast && (
          <div
            className="w-0.5 flex-1 mt-1 ml-[2px]"
            style={{ backgroundColor: '#4640DE', minHeight: '20px' }}
          />
        )}
      </div>

      {/* Sub-stage content */}
      <div className="flex-1 min-w-0 pb-4">
        {/* Sub-stage header */}
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-1">
            {subStageLabel}
          </h4>
          {activities.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
            </Badge>
          )}
        </div>

        {/* Activities under this sub-stage */}
        <div className="space-y-0">
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id || `${subStage}-${index}`}
              activity={activity}
              formatDateTime={formatDateTime}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Sub-Stage Timeline Component (renders sub-stages as milestones with activities)
const SubStageTimeline = ({
  stage,
  activities,
  formatDateTime,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: {
  stage: string;
  activities: Activity[];
  formatDateTime: (dateString: string) => string;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}) => {
  // Group activities by sub-stage
  const groupedBySubStage = useMemo(() => groupActivitiesBySubStage(activities, stage), [activities, stage]);
  
  // Get expected sub-stages for ordering
  const expectedSubStages = getSubStagesForStage(stage);
  
  // Create ordered list of sub-stages that have activities, maintaining expected order
  const orderedSubStages = useMemo(() => {
    const subStagesWithActivities: Array<{ key: string; label: string }> = [];
    
    // First, add sub-stages in expected order that have activities
    expectedSubStages.forEach((subStage) => {
      if (groupedBySubStage.has(subStage.key)) {
        subStagesWithActivities.push(subStage);
      }
    });
    
    // Then, add any sub-stages with activities that aren't in the expected list
    groupedBySubStage.forEach((_, subStageKey) => {
      if (!expectedSubStages.find(s => s.key === subStageKey)) {
        subStagesWithActivities.push({
          key: subStageKey,
          label: SubStageDisplayNames[subStageKey] || subStageKey.replace(/_/g, ' '),
        });
      }
    });
    
    return subStagesWithActivities;
  }, [groupedBySubStage, expectedSubStages]);

  if (orderedSubStages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No sub-stage activities found</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {orderedSubStages.map((subStage, index) => {
        const subStageActivities = groupedBySubStage.get(subStage.key) || [];
        const isLastSubStage = index === orderedSubStages.length - 1;

        return (
          <SubStageMilestone
            key={subStage.key}
            subStage={subStage.key}
            subStageLabel={subStage.label}
            activities={subStageActivities}
            isLast={isLastSubStage}
            formatDateTime={formatDateTime}
          />
        );
      })}
      
      {/* "View More" button for this stage */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-4 ml-8">
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
    </div>
  );
};

// Stage Milestone Component (replaces collapsible cards)
const StageMilestone = ({
  stage,
  activities,
  isExpanded,
  onToggle,
  formatDateTime,
  isCompleted,
  isCurrent,
  sectionRef,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: {
  stage: string;
  activities: Activity[];
  isExpanded: boolean;
  onToggle: () => void;
  formatDateTime: (dateString: string) => string;
  isCompleted: boolean;
  isCurrent: boolean;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}) => {
  const hasActivities = activities.length > 0;
  // isLoadingMore is passed to SubStageTimeline component, so it's intentionally kept
  void isLoadingMore;
  
  return (
    <div ref={sectionRef} className="flex gap-4 relative">
      {/* Timeline rail */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Stage dot - clickable */}
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded-full border-2 border-white shadow-md z-10 transition-all ${
            isCompleted
              ? 'bg-green-500 hover:bg-green-600'
              : isCurrent
              ? 'bg-[#4640DE] hover:bg-[#3730A3]'
              : 'bg-gray-300 hover:bg-gray-400'
          }`}
          aria-label={`${ATSStageDisplayNames[stage] || stage} stage`}
        >
          {isCompleted && (
            <div className="w-full h-full flex items-center justify-center">
              <CheckCircle2 className="h-3 w-3 text-white" />
            </div>
          )}
        </button>
        {/* Vertical line - only show if not last stage */}
        {/* This will be handled by parent component */}
      </div>

      {/* Stage content */}
      <div className="flex-1 min-w-0 pb-6">
        {/* Stage header - clickable */}
        <button
          onClick={onToggle}
          className="w-full text-left mb-2 hover:opacity-80 transition-opacity"
        >
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`text-base font-semibold ${
              isCompleted ? 'text-green-700' : isCurrent ? 'text-[#4640DE]' : 'text-gray-600'
            }`}>
              {ATSStageDisplayNames[stage] || stage}
            </h3>
            {hasActivities && (
              <Badge variant="secondary" className="text-xs">
                {activities.length}
              </Badge>
            )}
          </div>
        </button>

        {/* Expanded content - Sub-stages and activities */}
        {isExpanded && (
          <div className="mt-4">
            {activities.length === 0 ? (
              <div className="text-sm text-gray-500 py-4">
                No activities in this stage
              </div>
            ) : (
              <SubStageTimeline
                stage={stage}
                activities={activities}
                formatDateTime={formatDateTime}
                hasMore={hasMore}
                onLoadMore={onLoadMore}
                isLoadingMore={isLoadingMore}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const StageBasedActivityView: React.FC<StageBasedActivityViewProps> = ({
  activities,
  currentStage,
  enabledStages,
  onLoadMore,
  isLoadingMore = false,
  hasMore = false,
  formatDateTime,
}: StageBasedActivityViewProps) => {
  // isLoadingMore is passed to SubStageTimeline component, so it's intentionally kept
  void isLoadingMore;
  // Track which stage is currently loading more activities
  const [loadingStage, setLoadingStage] = useState<string | null>(null);
  
  // Group activities by stage
  const groupedActivities = useMemo(() => groupActivitiesByStage(activities), [activities]);

  // Find the stage with the oldest activity (this is where "View More" should appear)
  const stageWithOldestActivity = useMemo(() => {
    if (activities.length === 0 || !hasMore) return null;
    
    // Find the oldest activity across all activities
    let oldestActivity: Activity | null = null;
    let oldestDate = new Date();
    
    for (const activity of activities) {
      const activityDate = new Date(activity.createdAt);
      if (activityDate < oldestDate) {
        oldestDate = activityDate;
        oldestActivity = activity;
      }
    }
    
    if (!oldestActivity) return null;
    
    // Determine which stage this oldest activity belongs to
    const activityStage = oldestActivity.stage || inferStageFromActivity(oldestActivity);
    return activityStage;
  }, [activities, hasMore]);

  // Determine which stages to show (use enabledStages or all stages)
  // Reorder so current stage appears first, then others in reverse order
  const visibleStages = useMemo(() => {
    const stages = enabledStages || STAGE_ORDER;
    const allStages = STAGE_ORDER.filter(stage => stages.includes(stage));
    
    // Reorder: current stage first, then rest in reverse order (newest to oldest)
    if (currentStage && allStages.includes(currentStage)) {
      const currentIndex = allStages.indexOf(currentStage);
      const beforeCurrent = allStages.slice(0, currentIndex);
      const afterCurrent = allStages.slice(currentIndex + 1);
      // Return: [currentStage, ...afterCurrent.reverse(), ...beforeCurrent.reverse()]
      // This puts current first, then stages after it (in reverse), then stages before it (in reverse)
      return [
        currentStage,
        ...afterCurrent.reverse(),
        ...beforeCurrent.reverse()
      ];
    }
    
    // If no current stage, just return in reverse order (newest first)
    return allStages.reverse();
  }, [enabledStages, currentStage]);

  // Determine stage status (completed, current, upcoming)
  const getStageStatus = (stage: string): 'completed' | 'current' | 'upcoming' => {
    if (!currentStage) return 'upcoming';
    const currentIndex = STAGE_ORDER.indexOf(currentStage);
    const stageIndex = STAGE_ORDER.indexOf(stage);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  // Expanded state for each stage section
  const [expandedStages, setExpandedStages] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (currentStage) {
      initial.add(currentStage);
    }
    return initial;
  });

  // Refs for scrolling to sections
  const sectionRefs = useRef<Map<string, React.RefObject<HTMLDivElement | null>>>(new Map());
  const hasAutoExpanded = useRef(false);

  // Initialize refs
  useEffect(() => {
    visibleStages.forEach((stage) => {
      if (!sectionRefs.current.has(stage)) {
        sectionRefs.current.set(stage, React.createRef<HTMLDivElement | null>());
      }
    });
  }, [visibleStages]);

  // Auto-expand current stage on initial load (only once when activities are first loaded)
  useEffect(() => {
    if (currentStage && !hasAutoExpanded.current && activities.length > 0) {
      setExpandedStages((prev) => {
        const next = new Set(prev);
        next.add(currentStage);
        return next;
      });
      hasAutoExpanded.current = true;
    }
  }, [currentStage, activities.length]);

  // Auto-scroll removed - user doesn't want automatic scrolling when expanding stages

  // Handle per-stage "View More"
  const handleLoadMoreForStage = async (stage: string) => {
    if (loadingStage || !onLoadMore) return;
    
    setLoadingStage(stage);
    
    try {
      await onLoadMore(stage);
    } finally {
      setLoadingStage(null);
    }
  };

  const toggleStage = (stage: string) => {
    setExpandedStages((prev) => {
      const next = new Set(prev);
      if (next.has(stage)) {
        next.delete(stage);
      } else {
        next.add(stage);
      }
      return next;
    });
  };


  // Global load more - loads more activities which will be grouped by stage

  return (
    <div className="space-y-0 bg-white p-6 rounded-lg border border-gray-200">
      {/* Vertical Progress Timeline */}
      <div className="relative">
        {/* Stage Milestones with connecting lines */}
        <div className="space-y-0">
          {visibleStages.map((stage, index) => {
            const stageActivities = groupedActivities.get(stage) || [];
            const isExpanded = expandedStages.has(stage);
            const status = getStageStatus(stage);
            const isCompleted = status === 'completed';
            const isCurrent = status === 'current';
            const isLastStage = index === visibleStages.length - 1;
            const prevStatus = index > 0 ? getStageStatus(visibleStages[index - 1]) : null;
            const prevIsCompleted = prevStatus === 'completed';
            
            // Get or create ref for this stage
            let ref = sectionRefs.current.get(stage);
            if (!ref) {
              ref = React.createRef<HTMLDivElement | null>();
              sectionRefs.current.set(stage, ref);
            }
            
            // Show "View More" only on the stage that has the oldest activity in the loaded batch
            // This indicates we might have more older activities to load for that stage
            const stageHasMore = hasMore && isExpanded && stage === stageWithOldestActivity;
            const isStageLoading = loadingStage === stage;
            
            return (
              <div key={stage} className="relative">
                {/* Connector line from previous stage - only if not first */}
                {index > 0 && (
                  <div
                    className="absolute left-[10px] w-0.5 z-0"
                    style={{
                      top: '-24px',
                      height: '24px',
                      backgroundColor: prevIsCompleted ? '#10B981' : '#E5E7EB',
                    }}
                  />
                )}
                
                <StageMilestone
                  stage={stage}
                  activities={stageActivities}
                  isExpanded={isExpanded}
                  onToggle={() => toggleStage(stage)}
                  formatDateTime={formatDateTime}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  sectionRef={ref}
                  hasMore={stageHasMore}
                  onLoadMore={stageHasMore && isExpanded ? () => handleLoadMoreForStage(stage) : undefined}
                  isLoadingMore={isStageLoading}
                />
                
                {/* Connector line to next stage - only if not last */}
                {!isLastStage && (
                  <div
                    className="absolute left-[10px] w-0.5 z-0"
                    style={{
                      top: '20px',
                      bottom: '-24px',
                      backgroundColor: isCompleted ? '#10B981' : '#E5E7EB',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

