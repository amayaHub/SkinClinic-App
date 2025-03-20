import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, Loader2, Search, User, Phone, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import { useAppointments } from '../../hooks/useAppointments';
import { useServices } from '../../hooks/useServices';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import { AdminCalendar } from '../../components/AdminCalendar';
import { Dialog } from '../../components/Dialog';
import type { Appointment } from '../../hooks/useAppointments';
import { sendAppointmentConfirmationEmail } from '../../lib/email';

interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  email: string | null;
}

export function AdminAppointments() {
  const { appointments, loading, error, refresh } = useAppointments();
  const { services } = useServices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  // Fetch user profiles for appointments
  const fetchProfiles = async () => {
    try {
      setLoadingProfiles(true);
      const userIds = [...new Set(appointments.map(a => a.user_id))];
      
      if (userIds.length === 0) {
        setProfiles({});
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, phone, email')
        .in('id', userIds);

      if (error) throw error;

      const profileMap = (data || []).reduce((acc, profile) => ({
        ...acc,
        [profile.id]: profile
      }), {});

      setProfiles(profileMap);
    } catch (err) {
      console.error('Error fetching profiles:', err);
      alert('Error al cargar los perfiles de usuarios');
    } finally {
      setLoadingProfiles(false);
    }
  };

  // Fetch profiles when appointments change
  useEffect(() => {
    fetchProfiles();
  }, [appointments]);

  const getServiceName = (serviceId: number) => {
    return services.find(s => s.id === serviceId)?.name || 'Servicio no encontrado';
  };

  const handleStatusChange = async () => {
    if (!selectedAppointment || !newStatus) return;

    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedAppointment.id);

      if (error) throw error;

      // Si el estado cambia a confirmed, enviar correo de confirmación
      if (newStatus === 'confirmed') {
        const profile = profiles[selectedAppointment.user_id];
        const serviceName = getServiceName(selectedAppointment.service_id);
        const appointmentDate = format(new Date(selectedAppointment.scheduled_for), "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });

        if (profile?.email && profile?.full_name) {
          try {
            await sendAppointmentConfirmationEmail({
              to: profile.email,
              appointmentDate,
              serviceName,
              clientName: profile.full_name
            });
          } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // No lanzamos el error para no interrumpir el flujo principal
          }
        }
      }

      await refresh();
      setShowStatusDialog(false);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Error al actualizar el estado de la cita');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Por Confirmar';
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

  const filteredAppointments = appointments
    .filter(appointment => {
      const profile = profiles[appointment.user_id];
      const searchString = `${profile?.full_name || ''} ${profile?.email || ''} ${profile?.phone || ''} ${services[appointment.service_id] || ''}`.toLowerCase();
      const matchesSearch = !searchTerm || searchString.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesDate = !selectedDate || isSameDay(new Date(appointment.scheduled_for), selectedDate);
      return matchesSearch && matchesStatus && matchesDate;
    })
    .sort((a, b) => new Date(b.scheduled_for).getTime() - new Date(a.scheduled_for).getTime());

  if (loading || loadingProfiles) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-8">
          <Button
            as={Link}
            to="/admin"
            variant="outline"
            size="sm"
            className="bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:text-rose-700 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Panel Admin
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-neutral-900">Todas las Citas</h1>
            <p className="mt-2 text-neutral-600">
              Vista general de las citas y su estado
            </p>
          </div>

          <div className="mb-8">
            <AdminCalendar
              appointments={appointments}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Por Confirmar</option>
              <option value="confirmed">Confirmada</option>
              <option value="cancelled">Cancelada</option>
            </select>
            {(selectedDate || statusFilter !== 'all' || searchTerm) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDate(null);
                  setStatusFilter('all');
                  setSearchTerm('');
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {filteredAppointments.map(appointment => {
              const profile = profiles[appointment.user_id] || {};
              return (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-neutral-900 font-medium">
                        <User className="h-5 w-5 text-neutral-400" />
                        {profile?.full_name || 'Sin nombre'}
                      </div>
                      <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(appointment.scheduled_for), "EEEE d 'de' MMMM", { locale: es })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(appointment.scheduled_for), 'HH:mm')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {profile?.phone || 'No disponible'}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-neutral-700">Servicio: </span>
                        <span className="text-sm text-neutral-600">{getServiceName(appointment.service_id)}</span>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.closed ? 'bg-green-100 text-green-800' : 'bg-neutral-100 text-neutral-600'}`}>
                            {appointment.closed ? 'Cerrado' : 'No Cerrado'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (appointment.status === 'cancelled') return;
                          setSelectedAppointment(appointment);
                          setNewStatus(appointment.status);
                          setShowStatusDialog(true);
                        }}
                        className={cn(
                          "text-sm",
                          appointment.status === 'cancelled' && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={appointment.status === 'cancelled'}
                      >
                        Cambiar Estado
                      </Button>
                      <select
                        value={appointment.closed ? 'true' : 'false'}
                        onChange={async (e) => {
                          if (appointment.status === 'cancelled') return;
                          try {
                            const { error } = await supabase
                              .from('appointments')
                              .update({
                                closed: e.target.value === 'true',
                                updated_at: new Date().toISOString()
                              })
                              .eq('id', appointment.id);

                            if (error) throw error;
                            await refresh();
                          } catch (err) {
                            console.error('Error updating appointment closed status:', err);
                            alert('Error al actualizar el estado de asistencia');
                          }
                        }}
                        className={cn(
                          "px-3 py-1.5 border border-neutral-300 rounded-md bg-white text-sm ml-2",
                          appointment.status === 'cancelled' && "opacity-50 cursor-not-allowed"
                        )}
                        disabled={appointment.status === 'cancelled'}
                      >
                        <option value="false">No Cerrado</option>
                        <option value="true">Cerrado</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAppointments.length === 0 && (
              <div className="text-center py-8 bg-neutral-50 rounded-lg">
                <Calendar className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No se encontraron citas</p>
              </div>
            )}
          </div>
        </div>

        <Dialog
          open={showStatusDialog}
          onClose={() => setShowStatusDialog(false)}
          className="max-w-md"
        >
          <div className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Cambiar Estado de la Cita
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                {['pending', 'confirmed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => selectedAppointment?.status !== 'cancelled' && setNewStatus(status)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      newStatus === status
                        ? 'border-rose-200 bg-rose-50'
                        : selectedAppointment?.status === 'cancelled'
                          ? 'border-neutral-200 opacity-50 cursor-not-allowed'
                          : 'border-neutral-200 hover:border-rose-200 hover:bg-rose-50'
                    }`}
                    disabled={selectedAppointment?.status === 'cancelled'}
                  >
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {getStatusText(status)}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowStatusDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleStatusChange}
                  disabled={!newStatus || newStatus === selectedAppointment?.status}
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
}