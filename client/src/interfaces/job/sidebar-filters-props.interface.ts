import type { JobPostingQuery } from './job-posting-query.interface';

export interface SidebarFiltersProps {
  filters: JobPostingQuery;
  onFilterChange: (filters: JobPostingQuery) => void;
  onClearFilters: () => void;
}
