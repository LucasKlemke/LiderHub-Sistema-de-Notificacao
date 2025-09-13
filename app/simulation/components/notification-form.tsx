'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NotificationForm as NotificationFormType } from './types';
import { UserSelector } from './user-selector';
import { DatePicker } from './date-picker';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useWindowSize } from 'usehooks-ts';

interface NotificationFormProps {
  form: NotificationFormType;
  onFormChange: (form: NotificationFormType) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export function NotificationForm({
  form,
  onFormChange,
  onSubmit,
  isLoading,
}: NotificationFormProps) {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const [currentStep, setCurrentStep] = useState(1);

  const updateForm = (updates: Partial<NotificationFormType>) => {
    onFormChange({ ...form, ...updates });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  // Step validation functions
  const isStep1Valid = () => {
    return (
      form.title.trim() !== '' && form.description.trim() !== '' && form.type
    );
  };

  const isStep2Valid = () => {
    return (
      form.targetType === 'all' ||
      (form.targetType === 'specific' && form.targetUserId !== '')
    );
  };

  const canProceedToStep = (step: number) => {
    if (step === 2) return isStep1Valid();
    if (step === 3) return isStep1Valid() && isStep2Valid();
    return true;
  };

  const nextStep = () => {
    if (currentStep < 3 && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isMobile && currentStep < 3) {
      nextStep();
    } else {
      await onSubmit(e);
    }
  };

  // Mobile Multi-Step Form
  if (isMobile) {
    return (
      <div className="mx-auto max-w-2xl">
        {/* Step Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step < currentStep
                      ? 'bg-blue-600 text-white'
                      : step === currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  {step < currentStep ? <Check className="h-4 w-4" /> : step}
                </div>
                {step < 3 && (
                  <div
                    className={`h-0.5 w-16 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-neutral-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-center">
            <span className="text-sm text-neutral-400">
              Passo {currentStep} de 3
            </span>
          </div>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-white">
                  Informações Básicas
                </h3>
                <p className="text-sm text-neutral-400">
                  Digite o título, descrição e tipo da notificação
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-200">
                  Título *
                </Label>
                <Input
                  type="text"
                  value={form.title}
                  onChange={e => updateForm({ title: e.target.value })}
                  placeholder="Digite o título da notificação"
                  className="h-12 border-neutral-600 bg-neutral-800 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-200">
                  Descrição *
                </Label>
                <Textarea
                  value={form.description}
                  onChange={e => updateForm({ description: e.target.value })}
                  rows={4}
                  placeholder="Digite a mensagem da notificação"
                  className="min-h-[100px] border-neutral-600 bg-neutral-800 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-200">
                  Tipo *
                </Label>
                <Select
                  value={form.type}
                  onValueChange={value => updateForm({ type: value as any })}
                >
                  <SelectTrigger className="h-12 border-neutral-600 bg-neutral-800 text-white focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-600 bg-neutral-800">
                    <SelectItem
                      value="SUPPORT"
                      className="text-white hover:bg-neutral-700"
                    >
                      Suporte
                    </SelectItem>
                    <SelectItem
                      value="MENTION"
                      className="text-white hover:bg-neutral-700"
                    >
                      Menção
                    </SelectItem>
                    <SelectItem
                      value="PLAN_EXPIRY"
                      className="text-white hover:bg-neutral-700"
                    >
                      Expiração de Plano
                    </SelectItem>
                    <SelectItem
                      value="SYSTEM"
                      className="text-white hover:bg-neutral-700"
                    >
                      Sistema
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 2: Target & Schedule */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-white">
                  Destinatário e Agendamento
                </h3>
                <p className="text-sm text-neutral-400">
                  Escolha quem receberá a notificação e quando
                </p>
              </div>

              <UserSelector
                targetType={form.targetType}
                targetUserId={form.targetUserId}
                onTargetTypeChange={type => updateForm({ targetType: type })}
                onUserChange={userId => updateForm({ targetUserId: userId })}
              />

              <DatePicker
                shouldSchedule={form.shouldSchedule}
                scheduledDate={form.scheduledDate}
                onScheduleChange={shouldSchedule =>
                  updateForm({ shouldSchedule })
                }
                onDateChange={scheduledDate => updateForm({ scheduledDate })}
              />
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-semibold text-white">
                  Confirmar Dados
                </h3>
                <p className="text-sm text-neutral-400">
                  Revise as informações antes de criar a notificação
                </p>
              </div>

              <div className="space-y-3 rounded-lg border border-neutral-700 bg-neutral-800 p-4">
                <div>
                  <span className="text-sm text-neutral-400">Título:</span>
                  <p className="font-medium text-white">{form.title}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-400">Descrição:</span>
                  <p className="text-white">{form.description}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-400">Tipo:</span>
                  <p className="text-white">{form.type}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-400">
                    Destinatário:
                  </span>
                  <p className="text-white">
                    {form.targetType === 'all'
                      ? 'Todos os usuários'
                      : 'Usuário específico'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-neutral-400">Agendamento:</span>
                  <p className="text-white">
                    {form.shouldSchedule === 'yes' && form.scheduledDate
                      ? `Agendada para ${form.scheduledDate.toLocaleString('pt-BR')}`
                      : 'Enviar agora'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="h-12 flex-1 border-neutral-600 bg-transparent text-white hover:bg-neutral-800"
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Voltar
              </Button>
            )}

            <Button
              type="submit"
              disabled={
                (currentStep === 1 && !isStep1Valid()) ||
                (currentStep === 2 && !isStep2Valid()) ||
                (currentStep === 3 && isLoading)
              }
              className="h-12 flex-1 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-neutral-700 disabled:text-neutral-400"
            >
              {currentStep === 3 ? (
                isLoading ? (
                  'Criando...'
                ) : (
                  'Criar Notificação'
                )
              ) : (
                <>
                  Próximo
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Desktop Single-Step Form (unchanged)
  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Form Grid - Responsive Layout */}
        <div className="grid gap-4 sm:gap-6">
          {/* Título */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-neutral-200 sm:text-base">
              Título *
            </Label>
            <Input
              type="text"
              value={form.title}
              onChange={e => updateForm({ title: e.target.value })}
              placeholder="Digite o título da notificação"
              className="h-10 border-neutral-600 bg-neutral-800 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500 sm:h-11"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-neutral-200 sm:text-base">
              Descrição *
            </Label>
            <Textarea
              value={form.description}
              onChange={e => updateForm({ description: e.target.value })}
              rows={3}
              placeholder="Digite a mensagem da notificação"
              className="min-h-[80px] border-neutral-600 bg-neutral-800 text-white placeholder:text-neutral-400 focus:border-blue-500 focus:ring-blue-500 sm:min-h-[90px]"
              required
            />
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-neutral-200 sm:text-base">
              Tipo *
            </Label>
            <Select
              value={form.type}
              onValueChange={value => updateForm({ type: value as any })}
            >
              <SelectTrigger className="h-10 border-neutral-600 bg-neutral-800 text-white focus:border-blue-500 focus:ring-blue-500 sm:h-11">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="border-neutral-600 bg-neutral-800">
                <SelectItem
                  value="SUPPORT"
                  className="text-white hover:bg-neutral-700"
                >
                  Suporte
                </SelectItem>
                <SelectItem
                  value="MENTION"
                  className="text-white hover:bg-neutral-700"
                >
                  Menção
                </SelectItem>
                <SelectItem
                  value="PLAN_EXPIRY"
                  className="text-white hover:bg-neutral-700"
                >
                  Expiração de Plano
                </SelectItem>
                <SelectItem
                  value="SYSTEM"
                  className="text-white hover:bg-neutral-700"
                >
                  Sistema
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seletor de Usuário */}
          <UserSelector
            targetType={form.targetType}
            targetUserId={form.targetUserId}
            onTargetTypeChange={type => updateForm({ targetType: type })}
            onUserChange={userId => updateForm({ targetUserId: userId })}
          />

          {/* Seletor de Data */}
          <DatePicker
            shouldSchedule={form.shouldSchedule}
            scheduledDate={form.scheduledDate}
            onScheduleChange={shouldSchedule => updateForm({ shouldSchedule })}
            onDateChange={scheduledDate => updateForm({ scheduledDate })}
          />
        </div>

        {/* Botão Submit - Responsive */}
        <div className="pt-4 sm:pt-6">
          <Button
            type="submit"
            disabled={
              isLoading ||
              (form.targetType === 'specific' && !form.targetUserId)
            }
            className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-neutral-700 disabled:text-neutral-400 sm:h-12"
            size="lg"
          >
            {isLoading ? 'Criando...' : 'Criar Notificação'}
          </Button>
        </div>
      </form>
    </div>
  );
}
