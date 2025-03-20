import { useState, useEffect } from 'react';
import { format, isPast, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { useAppointments } from '../hooks/useAppointments';
import { useServices } from '../hooks/useServices';
import { supabase } from '../lib/supabase';

export function Appointments() {
  const navigate = useNavigate();
  const { appointments, loading: loadingAppointments, refresh } = useAppointments();
  const { services } = useServices();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const upcomingAppointments = appointments.filter(
    app => !isPast(new Date(app.scheduled_for)) || isToday(new Date(app.scheduled_for))
  ).sort((a, b) => 
    new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()
  );

  const pastAppointments = appointments.filter(
    app => isPast(new Date(app.scheduled_for)) && !isToday(new Date(app.scheduled_for))
  ).sort((a, b) => 
    new Date(b.scheduled_for).getTime() - new Date(a.scheduled_for).getTime()
  );

  const handleCancel = async (appointmentId: string) => {
    try {
      setCancellingId(appointmentId);
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (error) throw error;
      await refresh();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
    } finally {
      setCancellingId(null);
    }
  };

  const handleReschedule = (serviceId: number) => {
    navigate(`/book?service=${serviceId}`);
  };

  const getServiceName = (serviceId: number) => {
    return services.find(s => s.id === serviceId)?.name || 'Servicio no encontrado';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Por confirmar';
      case 'confirmed':
        return 'Confirmada';
      case 'completed':
        return 'Completada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loadingAppointments) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-8">Mis Citas</h1>

          {/* Próximas citas */}
          <section className="mb-12">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Próximas Citas</h2>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 rounded-lg">
                <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No tienes citas programadas</p>
                <Button
                  as="a"
                  href="/services"
                  variant="outline"
                  className="mt-4"
                >
                  Reservar una cita
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-neutral-900">
                        {getServiceName(appointment.service_id)}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(appointment.scheduled_for), "EEEE d 'de' MMMM", { locale: es })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(appointment.scheduled_for), 'HH:mm')}
                        </div>
                      </div>
                      <div className={`mt-2 inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full border ${getStatusStyle(appointment.status)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full bg-current opacity-70`} />
                        {getStatusText(appointment.status)}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleReschedule(appointment.service_id)}
                        className="sm:w-auto justify-center"
                      >
                        Reprogramar
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCancel(appointment.id)}
                        disabled={cancellingId === appointment.id}
                        className="sm:w-auto justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        {cancellingId === appointment.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Cancelar'
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Historial de citas */}
          <section>
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Historial de Citas</h2>
            {pastAppointments.length === 0 ? (
              <div className="text-center py-8 bg-neutral-50 rounded-lg">
                <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No hay historial de citas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pastAppointments.map(appointment => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 bg-neutral-50"
                  >
                    <h3 className="font-medium text-neutral-900">
                      {getServiceName(appointment.service_id)}
                    </h3>
                    <div className="mt-1 flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(appointment.scheduled_for), "EEEE d 'de' MMMM", { locale: es })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(appointment.scheduled_for), 'HH:mm')}
                      </div>
                    </div>
                    <div className={`mt-2 inline-flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-full border opacity-75 ${getStatusStyle(appointment.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                      {getStatusText(appointment.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}