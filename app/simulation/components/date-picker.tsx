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
    if (newTime === '') {
      setTime('00:00');
      return;
    }
    setTime(newTime);

    if (date) {
      const [hours, minutes] = newTime.split(':').map(Number);
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes, 0, 0);
      onDateChange(newDateTime);
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-neutral-200 sm:text-base">
        Agendar notificação
      </Label>
      <RadioGroup
        value={shouldSchedule}
        onValueChange={onScheduleChange}
        className="space-y-3"
      >
        <div className="flex items-center space-x-3">
          <RadioGroupItem
            value="no"
            id="no-schedule"
            className="border-neutral-600 text-blue-500 focus:ring-blue-500"
          />
          <Label
            htmlFor="no-schedule"
            className="cursor-pointer text-sm font-medium text-neutral-200 sm:text-base"
          >
            Não, enviar agora
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <RadioGroupItem
            value="yes"
            id="yes-schedule"
            className="border-neutral-600 text-blue-500 focus:ring-blue-500"
          />
          <Label
            htmlFor="yes-schedule"
            className="cursor-pointer text-sm font-medium text-neutral-200 sm:text-base"
          >
            Sim, agendar para uma data específica
          </Label>
        </div>
      </RadioGroup>

      {shouldSchedule === 'yes' && (
        <div className="mt-4 space-y-4 sm:flex sm:gap-4 sm:space-y-0">
          <div className="flex-1 space-y-2">
            <Label
              htmlFor="date-picker"
              className="text-sm font-medium text-neutral-200"
            >
              Data
            </Label>
            <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker"
                  className="h-10 w-full justify-between border-neutral-600 bg-neutral-800 text-white hover:bg-neutral-700 focus:border-blue-500 focus:ring-blue-500 sm:h-11 sm:w-48"
                >
                  {date ? date.toLocaleDateString('pt-BR') : 'Selecionar data'}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden border-neutral-600 bg-neutral-800 p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={handleDateSelect}
                  className="bg-neutral-800 text-white"
                  disabled={date => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex-1 space-y-2 sm:w-32 sm:flex-none">
            <Label
              htmlFor="time-picker"
              className="text-sm font-medium text-neutral-200"
            >
              Hora
            </Label>
            <Input
              min="00:00"
              max="23:59"
              type="time"
              id="time-picker"
              step="60"
              value={time}
              onChange={e => handleTimeChange(e.target.value)}
              className="h-10 w-full border-neutral-600 bg-neutral-800 text-white focus:border-blue-500 focus:ring-blue-500 sm:h-11 sm:w-32 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
