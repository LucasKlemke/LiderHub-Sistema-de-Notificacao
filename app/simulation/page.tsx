'use client';
import React, { useState } from 'react';
import { useCreateNotificationMutation } from '@/lib/hooks/useNotifications';
import { NotificationForm, type NotificationFormType } from './components';
import Header from '@/components/header';
import { SharedTabs, type Tab } from '@/components/shared-tabs';
import { Button } from '@/components/ui/button';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const NotificationSimulator = () => {
  const [activeTab, setActiveTab] = useState('create');
  const tabs: Tab[] = [{ key: 'create', label: 'Criar Notificação' }];

  const createNotification = useMutation(api.notifications.createNotification);

  return (
    <div className="min-h-screen bg-[#1a1b23]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header - Responsive */}
        <div className="mb-6 lg:mb-8">
          <Header title="Simular Notificações" />
        </div>

        {/* Tabs - Mobile Responsive */}
        <SharedTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showCounts={false}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Button onClick={() => createNotification({ text: 'Novo Like' })}>
            Novo Like
          </Button>

          <Button onClick={() => createNotification({ text: 'Novo Vídeo' })}>
            Novo Vídeo
          </Button>

          <Button
            onClick={() => createNotification({ text: 'Novo Comentário' })}
          >
            Novo Comentário
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSimulator;
