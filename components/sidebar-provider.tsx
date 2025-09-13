'use client';
import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconChevronDown } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { BellIcon, TestTube2 } from 'lucide-react';
import NotificationIcon from './notification-icon';

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: 'Notificações',
      href: '/notifications',
      icon: <NotificationIcon  />,
    },
    {
      label: 'Simulação',
      href: '/simulation',
      icon: <TestTube2 className="h-5 w-5 shrink-0 text-neutral-300" />,
    },
  ];
  return (
    <div
      className={cn(
        'relative w-full flex-1 overflow-hidden bg-[#1a1b23]',
        'h-screen'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-[#1a1b23]">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <Logo open={open} />
            <div className="mt-8 flex flex-col gap-1">
              {links.map((link, idx) => (
                <div key={idx}>
                  <SidebarLink key={idx} link={link} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom section with user profiles */}

          <div className="space-y-3">
            {/* Recruitment profile */}
            {open ? (
              <div className="flex items-center gap-3 rounded-md border border-neutral-700 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-600 text-xs font-medium text-white">
                  📋
                </div>
                {open && (
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-sm text-neutral-300">
                      Caio Recrutame...
                    </span>
                    <IconChevronDown className="h-4 w-4 text-neutral-400" />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-600 text-xs font-medium text-white">
                📋
              </div>
            )}

            {/* User profile */}
            {open ? (
              <div className="flex items-center gap-3 p-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-medium text-white">
                  P
                </div>

                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <div className="text-sm text-white">pedroelias...</div>
                    <div className="text-xs text-green-400">Online</div>
                  </div>
                  <IconChevronDown className="h-4 w-4 text-neutral-400" />
                </div>
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-medium text-white">
                P
              </div>
            )}

            {/* Version info */}
            {open && (
              <div className="border-t border-neutral-700 pt-3">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <div className="h-4 w-4 rounded bg-neutral-600" />
                  <span>LiderHub v1.0</span>
                </div>
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="w-full">{children}</div>
    </div>
  );
}
export const Logo = ({ open }: { open: boolean }) => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      {!open ? (
        /* When its closed */
        <img
          src="https://liderhub.ai/wp-content/uploads/2025/06/ico.svg"
          alt="LiderHubIcon"
        />
      ) : (
        <div className="flex flex-col gap-2">
          <img
            src="https://liderhub.ai/wp-content/uploads/2025/06/lider-white.svg"
            alt="LiderHub"
            className="h-8 shrink-0"
          />
          <span className="text-muted-foreground text-xs">Backed by YC</span>
        </div>
      )}
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a href="#" className="relative z-20 flex items-center justify-center py-1">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
        <div className="h-4 w-4 rotate-45 transform rounded-sm bg-white" />
      </div>
    </a>
  );
};
