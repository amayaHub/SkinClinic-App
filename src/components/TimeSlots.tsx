import { format, isToday, isBefore, getDay } from 'date-fns';
import { Button } from './Button';
import { cn } from '../lib/utils';
import { useAppointments, type Appointment } from '../hooks/useAppointments';

interface TimeSlotsProps {
  selectedDate: Date;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export function TimeSlots({ selectedDate, selectedTime, onTimeSelect }: TimeSlotsProps) {
  console.log('TimeSlots - Inicializando con fecha:', selectedDate);
  const { appointments, loading } = useAppointments(selectedDate, false);
  const now = new Date();
  const dayOfWeek = getDay(selectedDate);
  
  console.log('TimeSlots - Estado:', {
    fecha: selectedDate,
    horaSeleccionada: selectedTime,
    citasEncontradas: appointments.length,
    cargando: loading,
    diaDeLaSemana: dayOfWeek
  });
  
  const isTimeSlotBooked = (time: string) => {
    console.log('Verificando horario:', time);
    console.log('Citas disponibles:', appointments.map(apt => ({
      id: apt.id,
      hora_utc: apt.scheduled_for,
      estado: apt.status,
      usuario: apt.user_id
    })));
    
    return appointments.some(appointment => {
      const utcDate = new Date(appointment.scheduled_for);
      const appointmentLocalTime = utcDate.toLocaleTimeString('es-MX', {
        timeZone: 'America/Mexico_City',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      
      const isBooked = (
        appointmentLocalTime === time && 
        (appointment.status === 'pending' || appointment.status === 'confirmed')
      );
      
      console.log('Comparando cita:', {
        id: appointment.id,
        hora_cita_utc: appointment.scheduled_for,
        hora_cita_local: appointmentLocalTime,
        hora_a_verificar: time,
        estado: appointment.status,
        coincide_hora: appointmentLocalTime === time,
        estado_valido: appointment.status === 'pending' || appointment.status === 'confirmed',
        bloqueado: isBooked
      });
      
      return isBooked;
    });
  };
  
  const isTimeSlotPassed = (time: string) => {
    if (!isToday(selectedDate)) return false;
    
    const [hours, minutes] = time.split(':');
    const timeSlotDate = new Date(selectedDate);
    timeSlotDate.setHours(parseInt(hours, 10));
    timeSlotDate.setMinutes(parseInt(minutes, 10));
    timeSlotDate.setSeconds(0);
    timeSlotDate.setMilliseconds(0);
    
    return isBefore(timeSlotDate, now);
  };

  // Generar slots de tiempo según el día de la semana
  const generateTimeSlots = () => {
    // Para sábados (6), solo hasta las 5 PM
    if (dayOfWeek === 6) {
      return Array.from({ length: 8 }, (_, i) => {
        const hour = i + 9;
        return `${hour.toString().padStart(2, '0')}:00`;
      });
    }
    
    // Para días de semana (1-5), de 9 AM a 6 PM
    return Array.from({ length: 9 }, (_, i) => {
      const hour = i + 9;
      return `${hour.toString().padStart(2, '0')}:00`;
    });
  };

  const timeSlots = generateTimeSlots();

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
        const isPassed = isTimeSlotPassed(time);
        const isSelected = selectedTime === time;
        const isDisabled = isBooked || isPassed;

        return (
          <Button
            key={time}
            variant={isSelected ? 'primary' : 'outline'}
            onClick={() => !isDisabled && onTimeSelect(time)}
            disabled={isDisabled}
            className={cn(
              'py-2',
              isDisabled && 'opacity-50 cursor-not-allowed bg-neutral-100',
              isPassed && 'text-neutral-400'
            )}
          >
            {formatTimeSlot(time)}
            {isPassed && <span className="text-xs block">Pasado</span>}
          </Button>
        );
      })}
    </div>
  );
}