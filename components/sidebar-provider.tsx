'use client';
import React, { useState, useEffect } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { IconChevronDown } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Menu, TestTube2, X } from 'lucide-react';
import NotificationIcon from './notification-icon';
import { useWindowSize } from 'usehooks-ts';
import { Button } from './ui/button';
import { useMobileSidebar } from './sidebar-context';

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const { open, setOpen } = useMobileSidebar();
  const { width } = useWindowSize();

  // Responsive breakpoints
  const isMobile = width < 768; // Mobile: < 768px
  const isTablet = width >= 768 && width < 1024; // Tablet: 768px - 1024px
  const isDesktop = width >= 1024; // Desktop: >= 1024px

  // Determine sidebar behavior based on screen size
  const shouldUseMobileSidebar = isMobile || isTablet;

  const links = [
    {
      label: 'Notificações',
      href: '/notifications',
      icon: <NotificationIcon />,
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
      {/* Mobile/Tablet backdrop overlay with animation */}
      {shouldUseMobileSidebar && open && (
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm',
            'animate-in fade-in-0 duration-300',
            // On mobile, only cover right side to allow partial sidebar
            isMobile && 'left-1/2'
          )}
          onClick={() => setOpen(false)}
        />
      )}

      {shouldUseMobileSidebar ? (
        /* Custom Mobile/Tablet Sidebar with Animations */
        <>
          {/* Mobile/Tablet Sidebar Panel with slide animation */}
          <div
            className={cn(
              'fixed inset-y-0 left-0 z-50 bg-[#1a1b23] shadow-2xl transition-transform duration-300 ease-in-out',
              // Responsive width
              isMobile ? 'w-4/5 max-w-sm' : 'w-80', // Mobile: 80% width, Tablet: fixed 320px
              // Animation states
              open ? 'translate-x-0' : '-translate-x-full',
              // Padding responsive to screen size
              isMobile ? 'p-4' : 'p-6'
            )}
          >
            {/* Close button with better positioning and animation */}
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setOpen(false)}
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  'bg-neutral-800 text-neutral-200 transition-colors duration-200',
                  'hover:bg-neutral-700 hover:text-white',
                  'focus:outline-none focus:ring-2 focus:ring-neutral-600'
                )}
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sidebar Content with better spacing */}
            <div className="flex h-full flex-col justify-between pt-12">
              <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                {/* Logo with responsive sizing */}
                <div className="mb-8">
                  <Logo open={true} />
                </div>

                {/* Navigation links with improved touch targets */}
                <nav className="flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-3',
                        'text-neutral-200 transition-all duration-200',
                        'hover:bg-neutral-800 hover:text-white',
                        'focus:bg-neutral-800 focus:text-white focus:outline-none',
                        // Better touch targets for mobile
                        'min-h-[44px] touch-manipulation'
                      )}
                    >
                      <span className="flex-shrink-0">{link.icon}</span>
                      <span
                        className={cn(
                          'font-medium',
                          isMobile ? 'text-sm' : 'text-base'
                        )}
                      >
                        {link.label}
                      </span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Bottom section with user profiles - responsive */}
              <div className="mt-auto space-y-3 border-t border-neutral-700 pt-4">
                {/* Recruitment profile */}
                <div className="flex items-center gap-3 rounded-lg border border-neutral-700 p-3 transition-colors hover:bg-neutral-800">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-neutral-600 text-xs font-medium text-white">
                    📋
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <span
                      className={cn(
                        'truncate text-neutral-300',
                        isMobile
                          ? 'max-w-[120px] text-xs'
                          : 'max-w-[180px] text-sm'
                      )}
                    >
                      Caio Recrutamento
                    </span>
                    <IconChevronDown className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                  </div>
                </div>

                {/* User profile */}
                <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-800">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-orange-500 text-sm font-medium text-white">
                    P
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between">
                    <div className="min-w-0">
                      <div
                        className={cn(
                          'truncate text-white',
                          isMobile ? 'text-xs' : 'text-sm'
                        )}
                      >
                        pedroelias...
                      </div>
                      <div className="text-xs text-green-400">Online</div>
                    </div>
                    <IconChevronDown className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                  </div>
                </div>

                {/* Version info */}
                <div className="flex items-center gap-2 pt-2 text-xs text-neutral-500">
                  <div className="h-3 w-3 rounded bg-neutral-600" />
                  <span>LiderHub v1.0</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Desktop Sidebar */
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
      )}
      <div
        className={cn(
          'w-full transition-all duration-300 ease-in-out',
          // Add responsive margin adjustments
          shouldUseMobileSidebar && open && 'pointer-events-none'
        )}
      >
        {children}
      </div>
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
