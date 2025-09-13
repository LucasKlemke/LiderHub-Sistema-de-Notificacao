import { BellIcon } from "lucide-react";
import React from "react";
import { useNotifications } from "../lib/hooks/useNotifications";

interface NotificationIconProps {
    userId?: string;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ userId = 'user1' }) => {
    const { data: notificationsData, isLoading } = useNotifications({
        userId,
        page: 1,
        limit: 1, // We only need the unreadCount, so minimal data
    });

    const unreadCount = notificationsData?.unreadCount || 0;
    const hasUnreadNotifications = unreadCount > 0;

    if (isLoading) {
        return <BellIcon className="h-5 w-5 shrink-0 text-neutral-300" />;
    }

    if (hasUnreadNotifications) {
        return (
            <div className="relative text-primary-foreground">
                <BellIcon className="h-6 w-6 shrink-0 text-neutral-300" />
                <div className="bg-primary absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-xs font-medium text-primary-foreground rounded-full min-w-4">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </div>
            </div>
        );
    }

    return <BellIcon className="h-5 w-5 shrink-0 text-neutral-300" />;
};

export default NotificationIcon;
