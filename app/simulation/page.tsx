'use client';
import React, { useState } from 'react';
import { useCreateNotificationMutation } from '@/lib/hooks/useNotifications';
import {
  NotificationForm,
  type NotificationFormType,
} from './components';
import Header from '@/components/header';

const NotificationSimulator = () => {
  const [activeTab, setActiveTab] = useState('create');
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
      setMessage(
        `Erro: ${error instanceof Error ? error.message : 'Erro ao criar notificação'}`
      );
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

  const tabs = [{ key: 'create', label: 'Criar Notificação' }];

  return (
    <div className="min-h-screen bg-[#1a1b23]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header - Responsive */}
        <div className="mb-6 lg:mb-8">
          <Header title="Simular Notificações" />
        </div>

        {/* Message - Responsive */}
        {message && (
          <div className="mb-4 rounded-lg border border-blue-200/20 bg-blue-900/20 p-3 sm:mb-6 sm:p-4">
            <p className="text-sm text-blue-200 sm:text-base">{message}</p>
          </div>
        )}

        {/* Tabs - Mobile Responsive */}
        <div className="mb-6 border-b border-neutral-700 lg:mb-8">
          <nav className="-mb-px flex">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`
                  flex-1 border-b-2 px-3 py-3 text-center text-sm font-medium transition-colors
                  sm:flex-none sm:px-6 sm:text-base
                  ${
                    activeTab === key
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-neutral-400 hover:border-neutral-600 hover:text-neutral-300'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content - Responsive Container */}

        {activeTab === 'create' && (
          <div className="p-4 sm:p-6 lg:p-8">
            <NotificationForm
              form={form}
              onFormChange={setForm}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSimulator;
