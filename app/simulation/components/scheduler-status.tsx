'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SchedulerStatus as SchedulerStatusType } from './types';

interface SchedulerStatusProps {
  schedulerStatus: SchedulerStatusType | null;
  isLoading: boolean;
}

export function SchedulerStatus({
  schedulerStatus,
  isLoading,
}: SchedulerStatusProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Gerenciamento de Agendamento
          </h3>
          <p className="mb-6 text-gray-600">
            Carregando status do scheduler...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Gerenciamento de Agendamento
        </h3>
        <p className="mb-6 text-gray-600">
          Use os botões no cabeçalho para gerenciar o scheduler e enviar
          notificações agendadas.
        </p>
      </div>

      {schedulerStatus && (
        <div className="rounded-lg bg-gray-50 p-6">
          <h4 className="mb-3 font-semibold text-gray-900">
            Status do Scheduler
          </h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <div className="mt-1">
                <Badge
                  variant={
                    schedulerStatus.scheduler.running ? 'default' : 'secondary'
                  }
                >
                  {schedulerStatus.scheduler.running ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Última verificação:</span>
              <p className="mt-1 font-mono text-sm text-gray-900">
                {new Date(schedulerStatus.timestamp).toLocaleString()}
              </p>
            </div>
            {schedulerStatus.scheduler.lastRun && (
              <div>
                <span className="text-sm text-gray-600">Última execução:</span>
                <p className="mt-1 font-mono text-sm text-gray-900">
                  {new Date(schedulerStatus.scheduler.lastRun).toLocaleString()}
                </p>
              </div>
            )}
            {schedulerStatus.scheduler.nextRun && (
              <div>
                <span className="text-sm text-gray-600">Próxima execução:</span>
                <p className="mt-1 font-mono text-sm text-gray-900">
                  {new Date(schedulerStatus.scheduler.nextRun).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h4 className="mb-2 font-semibold text-blue-900">
          Como usar o agendamento:
        </h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>
            1. Crie notificações com data/hora agendada na aba "Criar
            Notificação"
          </li>
          <li>2. Inicie o scheduler clicando em "Iniciar Scheduler"</li>
          <li>
            3. O scheduler verificará automaticamente notificações pendentes
          </li>
          <li>
            4. Use "Enviar Agendadas" para forçar o envio de notificações
            pendentes
          </li>
        </ul>
      </div>
    </div>
  );
}
