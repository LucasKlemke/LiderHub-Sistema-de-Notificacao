'use client';

import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User } from './types';
import { Label } from '@/components/ui/label';

interface UserSelectorProps {
  targetType: 'all' | 'specific';
  targetUserId: string;
  onTargetTypeChange: (type: 'all' | 'specific') => void;
  onUserChange: (userId: string) => void;
}

export function UserSelector({
  targetType,
  targetUserId,
  onTargetTypeChange,
  onUserChange,
}: UserSelectorProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar usuários
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-neutral-200 sm:text-base">
        Destinatário *
      </Label>
      <RadioGroup
        value={targetType}
        onValueChange={onTargetTypeChange}
        className="space-y-3"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem
            value="all"
            id="all-users"
            className="border-neutral-600 text-blue-500 focus:ring-blue-500"
          />
          <Label
            htmlFor="all-users"
            className="cursor-pointer text-sm font-medium text-neutral-200 sm:text-base"
          >
            Todos os usuários
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem
            value="specific"
            id="specific-user"
            className="border-neutral-600 text-blue-500 focus:ring-blue-500"
          />
          <Label
            htmlFor="specific-user"
            className="cursor-pointer text-sm font-medium text-neutral-200 sm:text-base"
          >
            Usuário específico
          </Label>
        </div>
      </RadioGroup>

      {targetType === 'specific' && (
        <div className="mt-4 space-y-2">
          <Label className="text-sm font-medium text-neutral-200">
            Selecionar usuário
          </Label>
          <Select
            value={targetUserId.trim() === '' ? undefined : targetUserId}
            onValueChange={onUserChange}
            disabled={isLoading}
          >
            <SelectTrigger className="h-10 w-full border-neutral-600 bg-neutral-800 text-white focus:border-blue-500 focus:ring-blue-500 sm:h-11">
              <SelectValue
                placeholder={
                  isLoading ? 'Carregando usuários...' : 'Selecionar usuário...'
                }
              />
            </SelectTrigger>
            <SelectContent className="border-neutral-600 bg-neutral-800">
              {users.length === 0 ? (
                <SelectItem value="" disabled className="text-neutral-400">
                  {isLoading ? 'Carregando...' : 'Nenhum usuário encontrado'}
                </SelectItem>
              ) : (
                users.map(user => (
                  <SelectItem
                    key={user.id}
                    value={user.id}
                    className="text-white hover:bg-neutral-700 focus:bg-neutral-700"
                  >
                    {user.email}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
