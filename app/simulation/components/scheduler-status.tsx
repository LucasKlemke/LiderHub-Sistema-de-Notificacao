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
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h3 className="mb-4 text-lg font-semibold text-white sm:text-xl">
            Gerenciamento de Agendamento
          </h3>
          <p className="mb-6 text-sm text-neutral-300 sm:text-base">
            Carregando status do scheduler...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="mb-4 text-lg font-semibold text-white sm:text-xl">
          Gerenciamento de Agendamento
        </h3>
        <p className="mb-6 text-sm text-neutral-300 sm:text-base">
          Use os botões no cabeçalho para gerenciar o scheduler e enviar
          notificações agendadas.
        </p>
      </div>

      {schedulerStatus && (
        <div className="rounded-lg border border-neutral-700 bg-neutral-800 p-4 sm:p-6">
          <h4 className="mb-4 text-base font-semibold text-white sm:text-lg">
            Status do Scheduler
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm text-neutral-400">Status:</span>
              <div>
                <Badge
                  variant={
                    schedulerStatus.scheduler.running ? 'default' : 'secondary'
                  }
                  className={
                    schedulerStatus.scheduler.running
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-neutral-600 text-neutral-200 hover:bg-neutral-700'
                  }
                >
                  {schedulerStatus.scheduler.running ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-neutral-400">
                Última verificação:
              </span>
              <p className="font-mono text-sm text-white">
                {new Date(schedulerStatus.timestamp).toLocaleString('pt-BR')}
              </p>
            </div>
            {schedulerStatus.scheduler.lastRun && (
              <div className="space-y-2">
                <span className="text-sm text-neutral-400">
                  Última execução:
                </span>
                <p className="font-mono text-sm text-white">
                  {new Date(schedulerStatus.scheduler.lastRun).toLocaleString(
                    'pt-BR'
                  )}
                </p>
              </div>
            )}
            {schedulerStatus.scheduler.nextRun && (
              <div className="space-y-2">
                <span className="text-sm text-neutral-400">
                  Próxima execução:
                </span>
                <p className="font-mono text-sm text-white">
                  {new Date(schedulerStatus.scheduler.nextRun).toLocaleString(
                    'pt-BR'
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-blue-600/30 bg-blue-900/20 p-4 sm:p-6">
        <h4 className="mb-3 text-base font-semibold text-blue-300 sm:text-lg">
          Como usar o agendamento:
        </h4>
        <ul className="space-y-2 text-sm text-blue-200 sm:text-base">
          <li className="flex items-start">
            <span className="mr-2 font-semibold text-blue-400">1.</span>
            <span>
              Crie notificações com data/hora agendada na aba "Criar
              Notificação"
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 font-semibold text-blue-400">2.</span>
            <span>Inicie o scheduler clicando em "Iniciar Scheduler"</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 font-semibold text-blue-400">3.</span>
            <span>
              O scheduler verificará automaticamente notificações pendentes
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 font-semibold text-blue-400">4.</span>
            <span>
              Use "Enviar Agendadas" para forçar o envio de notificações
              pendentes
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
