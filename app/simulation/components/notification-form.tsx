'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NotificationType } from '@prisma/client';
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
  const updateForm = (updates: Partial<NotificationFormType>) => {
    onFormChange({ ...form, ...updates });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      {/* Título */}
      <div>
        <Label className="mb-2 block text-sm  font-medium">Título *</Label>
        <Input
          type="text"
          value={form.title}
          onChange={e => updateForm({ title: e.target.value })}
          placeholder="Digite o título da notificação"
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <Label className="mb-2 block text-sm  font-medium">Descrição *</Label>
        <Textarea
          value={form.description}
          onChange={e => updateForm({ description: e.target.value })}
          rows={3}
          placeholder="Digite a mensagem da notificação"
          required
        />
      </div>

      {/* Tipo */}
      <div>
        <Label className="mb-2 block text-sm  font-medium">Tipo *</Label>
        <Select
          value={form.type}
          onValueChange={value =>
            updateForm({ type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>

            <SelectItem value="SUPPORT">Suporte</SelectItem>
            <SelectItem value="MENTION">Menção</SelectItem>
            <SelectItem value="PLAN_EXPIRY">Expiração de Plano</SelectItem>
            <SelectItem value="SYSTEM">Sistema</SelectItem>
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

      {/* Botão Submit */}
      <div className="pt-6">
        <Button
          type="submit"
          disabled={
            isLoading || (form.targetType === 'specific' && !form.targetUserId)
          }
          className="w-full"
          size="lg"
        >
          {isLoading ? 'Criando...' : 'Criar Notificação'}
        </Button>
      </div>
    </form>
  );
}
