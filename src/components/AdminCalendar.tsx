import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../lib/utils';
import type { Appointment } from '../hooks/useAppointments';

interface AdminCalendarProps {
  appointments: Appointment[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
}

export function AdminCalendar({ appointments, onDateSelect, selectedDate }: AdminCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  
  const days = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.scheduled_for), date)
    );
  };

  const getDayStatus = (date: Date) => {
    const dayAppointments = getAppointmentsForDay(date);
    if (dayAppointments.length === 0) return null;

    const hasPending = dayAppointments.some(app => app.status === 'pending');
    const hasConfirmed = dayAppointments.some(app => app.status === 'confirmed');
    const hasCancelled = dayAppointments.some(app => app.status === 'cancelled');
    const hasCompleted = dayAppointments.some(app => app.status === 'completed');

    if (hasPending) return 'pending';
    if (hasConfirmed) return 'confirmed';
    if (hasCancelled) return 'cancelled';
    if (hasCompleted) return 'completed';
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale: es })}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
        {['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'].map(day => (
          <div key={day} className="py-2 font-medium text-neutral-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfMonth.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="h-24 bg-neutral-50 rounded-lg" />
        ))}

        {days.map(day => {
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const dayIsToday = isToday(day);
          const status = getDayStatus(day);
          const appointmentsCount = getAppointmentsForDay(day).length;

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={cn(
                'h-24 p-2 rounded-lg text-left relative transition-colors',
                isCurrentMonth ? 'bg-white hover:bg-neutral-50' : 'bg-neutral-50',
                isSelected && 'ring-2 ring-rose-200',
                status === 'pending' && 'bg-yellow-50 hover:bg-yellow-100',
                status === 'confirmed' && 'bg-green-50 hover:bg-green-100',
                status === 'cancelled' && 'bg-red-50 hover:bg-red-100'
              )}
            >
              <time
                dateTime={format(day, 'yyyy-MM-dd')}
                className={cn(
                  'font-medium text-sm',
                  !isCurrentMonth && 'text-neutral-300',
                  dayIsToday && 'text-rose-600'
                )}
              >
                {format(day, 'd')}
              </time>
              {appointmentsCount > 0 && (
                <div className="mt-1">
                  <span className="text-xs font-medium text-neutral-600">
                    {appointmentsCount} cita{appointmentsCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-100 rounded" />
          <span>Por Confirmar</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 rounded" />
          <span>Confirmadas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 rounded" />
          <span>Canceladas</span>
        </div>
      </div>
    </div>
  );
}