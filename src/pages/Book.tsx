import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar } from '../components/Calendar';
import { TimeSlots } from '../components/TimeSlots';
import { Button } from '../components/Button';
import { useServices } from '../hooks/useServices';
import { useAuth } from '../contexts/AuthContext';
import { Dialog } from '../components/Dialog';
import { supabase } from '../lib/supabase';
import { useAppointments } from '../hooks/useAppointments'; 
import { CheckCircle } from 'lucide-react';

export function Book() {
  const [searchParams] = useSearchParams();
  const serviceId = parseInt(searchParams.get('service') || '1', 10);
  const { services, loading: loadingServices } = useServices();
  const { appointments } = useAppointments();
  const service = services.find(s => s.id === serviceId);
  const [showSuccess, setShowSuccess] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!user || !selectedDate || !selectedTime) return;

    setLoading(true);
    setError(null);

    try {
      const [hours, minutes] = selectedTime.split(':');
      const scheduledFor = new Date(selectedDate);
      scheduledFor.setHours(parseInt(hours, 10));
      scheduledFor.setMinutes(parseInt(minutes, 10));

      // Validate appointment time is not already booked
      const appointmentDateTime = new Date(scheduledFor);
      const isTimeBooked = appointments.some(appointment => {
        const bookedTime = new Date(appointment.scheduled_for);
        return bookedTime.getTime() === appointmentDateTime.getTime();
      });

      if (isTimeBooked) {
        throw new Error('Este horario ya está reservado. Por favor, elige otro horario.');
      }

      const { error: bookingError } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          service_id: serviceId,
          scheduled_for: scheduledFor.toISOString(),
          status: 'pending',
          closed: false
        });

      if (bookingError) throw bookingError;

      setShowSuccess(true);
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-neutral-600">Service not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {loadingServices ? (
          <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
          </div>
        ) : !service ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <p className="text-neutral-600">Service not found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">Book Appointment</h1>
            <p className="mt-2 text-neutral-600">
              Selected service: <span className="font-medium">{service.name}</span>
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Select Date
              </h2>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            {selectedDate && (
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                  Select Time
                </h2>
                <TimeSlots
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || loading}
                className="w-full sm:w-auto"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>

          <Dialog
            open={showSuccess}
            onClose={() => navigate('/appointments')}
            className="max-w-md"
          >
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                ¡Cita registrada con éxito!
              </h3>
              <p className="text-neutral-600 mb-6">
                Te enviaremos un correo electrónico con la confirmación de tu cita. 
                Puedes ver el estado de tu cita en la sección "Mis Citas".
              </p>
              <Button
                onClick={() => navigate('/appointments')}
                className="w-full"
              >
                Ver Mis Citas
              </Button>
            </div>
          </Dialog>
        </div>
        )}
      </div>
    </div>
  );
}