type Page = 'dashboard' | 'profile' | 'applications' | 'settings';

export interface SeekerSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}
