import { format } from 'date-fns';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { useAppointments, type Appointment } from '../hooks/useAppointments';

interface TimeSlotsProps {
  selectedDate: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export function TimeSlots({ selectedDate, selectedTime, onTimeSelect }: TimeSlotsProps) {
  const { appointments } = useAppointments(selectedDate);
  
  const isTimeSlotBooked = (time: string) => {
    return appointments.some(appointment => {
      const appointmentTime = format(new Date(appointment.scheduled_for), 'HH:mm');
      return appointmentTime === time;
    });
  };

  // Generate time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minutes = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  });

  const formatTimeSlot = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {timeSlots.map(time => {
        const isBooked = isTimeSlotBooked(time);
        const isSelected = selectedTime === time;

        return (
          <Button
            key={time}
            variant={isSelected ? 'primary' : 'outline'}
            onClick={() => onTimeSelect(time)}
            disabled={isBooked}
            className={cn(
              'py-2',
              isBooked && 'opacity-50 cursor-not-allowed bg-neutral-100'
            )}
          >
            {formatTimeSlot(time)}
          </Button>
        );
      })}
    </div>
  );
}