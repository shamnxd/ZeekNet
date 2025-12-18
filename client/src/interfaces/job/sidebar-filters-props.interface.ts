import type { JobPostingQuery } from "@/interfaces/job/job-posting-query.interface";

export interface SidebarFiltersProps {
  onSearch: (query: JobPostingQuery) => void;
  loading?: boolean;
}
