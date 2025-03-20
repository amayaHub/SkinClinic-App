import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Search, Save, X, AlertCircle, Calendar, Clock, ArrowLeft, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { ClientForm } from '../../components/ClientForm';
import { cn } from '../../lib/utils';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  age: number | null;
  appointments: {
    id: string;
    scheduled_for: string;
    service_id: number;
    status: string;
  }[];
}

export function Clients() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: servicesData } = await supabase
          .from('services')
          .select('id, name');
        
        if (servicesData) {
          const servicesMap = servicesData.reduce((acc, service) => ({
            ...acc,
            [service.id]: service.name
          }), {});
          setServices(servicesMap);
        }

        const { data: profilesData, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        const appointmentsPromises = profilesData?.map(async (profile) => {
          const { data: appointments } = await supabase
            .from('appointments')
            .select('*')
            .eq('user_id', profile.id)
            .order('scheduled_for', { ascending: false });
          
          return {
            ...profile,
            appointments: appointments || []
          };
        }) || [];

        const profilesWithAppointments = await Promise.all(appointmentsPromises);
        setProfiles(profilesWithAppointments);
      } catch (err) {
        console.error('Error loading clients:', err);
        setError('Error al cargar los clientes. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleEdit = (profile: Profile, field: string) => {
    setEditingCell({ id: profile.id, field });
    setEditValue(profile[field as keyof Profile]?.toString() || '');
  };

  const handleSave = async () => {
    if (!editingCell) return;
    
    setSaving(true);
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          [editingCell.field]: editValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingCell.id);

      if (updateError) throw updateError;

      setProfiles(prev => prev.map(profile => {
        if (profile.id === editingCell.id) {
          return {
            ...profile,
            [editingCell.field]: editValue
          };
        }
        return profile;
      }));

      setEditingCell(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const searchString = `${profile.full_name || ''} ${profile.email || ''} ${profile.phone || ''}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
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
          <Button
            onClick={() => setShowNewClientModal(true)}
            size="sm"
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <>
                <Plus className="h-5 w-5 mr-2" />
                Nuevo Cliente
              </>
            )}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-600">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-2" size="sm">Reintentar</Button>
              </div>
            </div>
          )}

          <div className="p-6 border-b"><h1 className="text-2xl font-bold text-neutral-900">Clientes</h1></div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-y">
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-900">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-900">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-900">Teléfono</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-900">Edad</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-900">Cliente desde</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-900">Citas</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProfiles.map(profile => (
                  <tr key={profile.id} className="group hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      {editingCell?.id === profile.id && editingCell.field === 'full_name' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded"
                            autoFocus
                          />
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingCell(null)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(profile, 'full_name')}
                          className="w-full text-left hover:text-rose-600"
                        >
                          {profile.full_name || 'Sin nombre'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingCell?.id === profile.id && editingCell.field === 'email' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="email"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded"
                            autoFocus
                          />
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingCell(null)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(profile, 'email')}
                          className="w-full text-left hover:text-rose-600"
                        >
                          {profile.email || 'No especificado'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingCell?.id === profile.id && editingCell.field === 'phone' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="tel"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded"
                            autoFocus
                          />
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingCell(null)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(profile, 'phone')}
                          className="w-full text-left hover:text-rose-600"
                        >
                          {profile.phone || 'No especificado'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editingCell?.id === profile.id && editingCell.field === 'age' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="18"
                            max="120"
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            className="flex-1 px-2 py-1 border rounded w-20"
                            autoFocus
                          />
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="p-1 text-green-600 hover:text-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingCell(null)}
                            className="p-1 text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(profile, 'age')}
                          className="w-full text-left hover:text-rose-600"
                        >
                          {profile.age || 'No especificado'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {format(new Date(profile.created_at), 'MMMM yyyy', { locale: es })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedProfile(profile)}
                        className="text-rose-600 hover:text-rose-700 font-medium"
                      >
                        {profile.appointments?.length || 0} cita{profile.appointments?.length !== 1 ? 's' : ''}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredProfiles.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-neutral-600">
                      {searchTerm ? 'No se encontraron clientes que coincidan con tu búsqueda' :
                       'No hay clientes registrados en el sistema'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t text-sm text-neutral-600">
            {filteredProfiles.length} cliente{filteredProfiles.length === 1 ? '' : 's'} encontrado{filteredProfiles.length === 1 ? '' : 's'}
            {searchTerm && ` para "${searchTerm}"`}
          </div>
        </div>

        <Dialog
          open={selectedProfile !== null}
          onClose={() => setSelectedProfile(null)}
        >
          {selectedProfile && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">
                Citas de {selectedProfile.full_name || 'Cliente'}
              </h2>
              
              {selectedProfile.appointments && selectedProfile.appointments.length > 0 ? (
                <div className="space-y-4">
                  {selectedProfile.appointments
                    .sort((a, b) => new Date(b.scheduled_for).getTime() - new Date(a.scheduled_for).getTime())
                    .map(appointment => (
                      <div
                        key={appointment.id}
                        className="flex flex-col gap-2 p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-2 text-neutral-900 font-medium">
                          <Calendar className="h-5 w-5 text-neutral-400" />
                          {format(new Date(appointment.scheduled_for), "EEEE d 'de' MMMM", { locale: es })}
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <Clock className="h-5 w-5 text-neutral-400" />
                          {format(new Date(appointment.scheduled_for), 'HH:mm')}
                        </div>
                        <div className="text-neutral-900">
                          {services[appointment.service_id]}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            appointment.status === 'completed' && "bg-green-100 text-green-800",
                            appointment.status === 'cancelled' && "bg-red-100 text-red-800",
                            appointment.status === 'confirmed' && "bg-green-100 text-green-800",
                            appointment.status === 'pending' && "bg-yellow-100 text-yellow-800"
                          )}>
                            {appointment.status === 'completed' && 'Completada'}
                            {appointment.status === 'cancelled' && 'Cancelada'}
                            {appointment.status === 'confirmed' && 'Confirmada'}
                            {appointment.status === 'pending' && 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-neutral-600">
                  Este cliente no tiene citas registradas.
                </p>
              )}
            </div>
          )}
        </Dialog>
      </div>

      <Dialog
        open={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        title="Registrar Nuevo Cliente"
      >
        <ClientForm
          onClose={() => setShowNewClientModal(false)}
          onSuccess={() => {
            // Recargar la lista de clientes
            window.location.reload();
          }}
        />
      </Dialog>
    </div>
  );
}