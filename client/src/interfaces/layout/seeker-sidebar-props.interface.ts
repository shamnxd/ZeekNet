type Page = 'dashboard' | 'profile' | 'applications' | 'settings' | 'messages' | 'help-center';

export interface SeekerSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

