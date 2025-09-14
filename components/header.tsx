import { Menu } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { useWindowSize } from 'usehooks-ts';
import { useMobileSidebar } from './sidebar-context';
import { useNotifications } from '@/lib/hooks/useNotifications';

const Header = ({ title }: { title: string }) => {
  const { width } = useWindowSize();
  const { toggleSidebar } = useMobileSidebar();

  // Match sidebar responsive breakpoints
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const shouldShowMenuButton = isMobile || isTablet;

  const { data: notificationsData } = useNotifications({
    userId: 'user1',
  });

  const unreadCount = notificationsData?.unreadCount || 0;

  return (
    <div className="mb-6 flex w-full items-center gap-3 md:mb-8">
      {shouldShowMenuButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="relative flex-shrink-0 hover:bg-neutral-800"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 md:h-6 md:w-6" />
          {unreadCount > 0 && (
            <span className="bg-primary absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      )}
      <h1 className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">
        {title}
      </h1>
    </div>
  );
};

export default Header;
