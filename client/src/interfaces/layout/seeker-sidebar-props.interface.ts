type Page = 'dashboard' | 'profile' | 'applications' | 'settings' | 'messages';

export interface SeekerSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}
