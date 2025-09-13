'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface SchedulerControlsProps {
  onStartScheduler: () => Promise<void>;
  onSendScheduled: () => Promise<void>;
  isLoading: boolean;
}

export function SchedulerControls({
  onStartScheduler,
  onSendScheduled,
  isLoading,
}: SchedulerControlsProps) {
  const [actionLoading, setActionLoading] = useState<'start' | 'send' | null>(
    null
  );

  const handleStartScheduler = async () => {
    setActionLoading('start');
    try {
      await onStartScheduler();
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendScheduled = async () => {
    setActionLoading('send');
    try {
      await onSendScheduled();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleStartScheduler}
        disabled={isLoading || actionLoading === 'start'}
        variant="outline"
      >
        {actionLoading === 'start' ? 'Iniciando...' : 'Iniciar Scheduler'}
      </Button>
      <Button
        onClick={handleSendScheduled}
        disabled={isLoading || actionLoading === 'send'}
      >
        {actionLoading === 'send' ? 'Enviando...' : 'Enviar Agendadas'}
      </Button>
    </div>
  );
}
