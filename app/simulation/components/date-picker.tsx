'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, ChevronDownIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DatePickerProps {
  shouldSchedule: 'yes' | 'no';
  scheduledDate: Date | undefined;
  onScheduleChange: (shouldSchedule: 'yes' | 'no') => void;
  onDateChange: (date: Date | undefined) => void;
}

export function DatePicker({
  shouldSchedule,
  scheduledDate,
  onScheduleChange,
  onDateChange,
}: DatePickerProps) {
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(scheduledDate);
  const [time, setTime] = useState<string>('01:00');

  // Sync internal date state with prop
  useEffect(() => {
    if (scheduledDate) {
      setDate(scheduledDate);
      // Extract time from the scheduled date if it exists
      const hours = scheduledDate.getHours().toString().padStart(2, '0');
      const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }
  }, [scheduledDate]);

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsDateOpen(false);
    
    if (selectedDate) {
      // Combine selected date with current time
      const [hours, minutes] = time.split(':').map(Number);
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hours, minutes, 0, 0);
      onDateChange(newDateTime);
    } else {
      onDateChange(undefined);
    }
  };

  // Handle time change
  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    
    if (date) {
      // Combine current date with new time
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes, 0, 0);
      onDateChange(newDateTime);
    }
  };

  return (
    <div>
      <Label className="mb-3 block text-sm font-medium">
        Agendar notificação
      </Label>
      <RadioGroup value={shouldSchedule} onValueChange={onScheduleChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="no" id="no-schedule" />
          <Label
            htmlFor="no-schedule"
            className="cursor-pointer text-sm font-medium"
          >
            Não, enviar agora
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="yes" id="yes-schedule" />
          <Label
            htmlFor="yes-schedule"
            className="cursor-pointer text-sm font-medium"
          >
            Sim, agendar para uma data específica
          </Label>
        </div>
      </RadioGroup>

      {shouldSchedule === 'yes' && (
        <div className="mt-4 flex gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="date-picker" className="px-1">
              Data
            </Label>
            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker"
                  className="w-48 justify-between font-normal"
                >
                  {date ? date.toLocaleDateString('pt-BR') : 'Selecionar data'}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={handleDateSelect}
                  disabled={date => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="time-picker" className="px-1">
              Hora
            </Label>
            <Input
              type="time"
              id="time-picker"
              step="60"
              value={time}
              onChange={e => handleTimeChange(e.target.value)}
              className="w-32 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}