'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
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
    <div>
      <Label className="mb-3 block text-sm font-medium">Destinatário *</Label>
      <RadioGroup value={targetType} onValueChange={onTargetTypeChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="all" id="all-users" />
          <Label
            htmlFor="all-users"
            className="cursor-pointer text-sm font-medium"
          >
            Todos os usuários
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="specific" id="specific-user" />
          <Label
            htmlFor="specific-user"
            className="cursor-pointer text-sm font-medium"
          >
            Usuário específico
          </Label>
        </div>
      </RadioGroup>

      {targetType === 'specific' && (
        <div className="mt-3">
          <Select
            value={targetUserId.trim() === '' ? undefined  : targetUserId}
            onValueChange={onUserChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  isLoading
                    ? 'Carregando usuários...'
                    : 'Selecionar usuário...'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {users.length === 0 ? (
                <SelectItem value="" disabled>
                  {isLoading ? 'Carregando...' : 'Nenhum usuário encontrado'}
                </SelectItem>
              ) : (
                users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
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
