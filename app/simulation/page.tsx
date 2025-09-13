'use client';
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { useCreateNotificationMutation } from '@/lib/hooks/useNotifications';
import {
  NotificationForm,
  SchedulerControls,
  SchedulerStatus,
  type SchedulerStatusType,
  type NotificationFormType,
} from './components';

const NotificationSimulator = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [schedulerStatus, setSchedulerStatus] =
    useState<SchedulerStatusType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // React Query mutation for creating notifications
  const createNotificationMutation = useCreateNotificationMutation();

  // Estado do formulário unificado
  const [form, setForm] = useState<NotificationFormType>({
    title: '',
    description: '',
    type: 'MENTION',
    targetType: 'all' as 'all' | 'specific',
    targetUserId: '',
    shouldSchedule: 'no' as 'yes' | 'no',
    scheduledDate: undefined as Date | undefined,
  });

  // Verificar status do scheduler
  const checkSchedulerStatus = async () => {
    try {
      const response = await fetch('/api/scheduler/status');
      const data = await response.json();
      setSchedulerStatus(data);
    } catch (error) {
      console.error('Erro ao verificar status do scheduler:', error);
    }
  };

  useEffect(() => {
    checkSchedulerStatus();
  }, []);

  // Função simplificada para enviar notificação - agora usa mutation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Payload unificado para todos os tipos de notificação
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        targetType: form.targetType,
        userId: form.targetType === 'specific' ? form.targetUserId : undefined,
        scheduledDate:
          form.shouldSchedule === 'yes' && form.scheduledDate
            ? form.scheduledDate.toISOString()
            : undefined,
      };

      // Use the mutation instead of manual fetch
      const data = await createNotificationMutation.mutateAsync(payload);

      // Usar a mensagem retornada pelo servidor que já inclui informação sobre agendamento
      setMessage(
        data.message ||
          `Notificação ${getNotificationTypeName(form.type)} criada com sucesso!`
      );

      // Reset form
      setForm({
        title: '',
        description: '',
        type: 'MENTION',
        targetType: 'all',
        targetUserId: '',
        shouldSchedule: 'no',
        scheduledDate: undefined,
      });
      
    } catch (error) {
      setMessage(`Erro: ${error instanceof Error ? error.message : 'Erro ao criar notificação'}`);
      console.error('Error creating notification:', error);
    }

    setIsLoading(false);
  };

  // Helper function para nomes dos tipos
  const getNotificationTypeName = (type: string) => {
    switch (type) {
      case 'CAMPAIGN':
        return 'de campanha';
      case 'MENTION':
        return 'de menção';
      case 'PLAN_EXPIRY':
        return 'de expiração de plano';
      case 'TICKET':
        return 'de ticket';
      default:
        return '';
    }
  };

  // Função para iniciar o scheduler
  const handleStartScheduler = async () => {
    try {
      const response = await fetch('/api/scheduler/start', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Scheduler iniciado com sucesso!');
        checkSchedulerStatus();
      } else {
        setMessage(`Erro: ${data.error}`);
      }
    } catch (error) {
      setMessage('Erro ao iniciar scheduler');
    }
  };

  // Função para enviar notificações agendadas
  const handleSendScheduled = async () => {
    try {
      const response = await fetch('/api/notifications/scheduled', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`${data.count} notificações agendadas enviadas!`);
      } else {
        setMessage(`Erro: ${data.error}`);
      }
    } catch (error) {
      setMessage('Erro ao enviar notificações agendadas');
    }
  };

  const tabs = [
    { key: 'create', label: 'Criar Notificação' },
    { key: 'schedule', label: 'Agendamento' },
  ];

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-semibold ">Simular Notificações</h1>
            {schedulerStatus && (
              <Badge
                variant={
                  schedulerStatus.scheduler.running ? 'default' : 'secondary'
                }
              >
                Scheduler:{' '}
                {schedulerStatus.scheduler.running ? 'Ativo' : 'Inativo'}
              </Badge>
            )}
          </div>
          <SchedulerControls
            onStartScheduler={handleStartScheduler}
            onSendScheduled={handleSendScheduled}
            isLoading={isLoading}
          />
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-blue-800">{message}</p>
          </div>
        )}

        {/* Tabs */}

        <div className="mb-8  border-b">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`cursor-pointer border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === key
                    ? 'border-primary text-primary'
                    : 'text-muted-foreground hover:text-muted-foreground/80 border-transparent'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className=" rounded-lg border shadow-sm">
          {activeTab === 'create' && (
            <div className="p-6">
              <NotificationForm
                form={form}
                onFormChange={setForm}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="p-6">
              <SchedulerStatus
                schedulerStatus={schedulerStatus}
                isLoading={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSimulator;
