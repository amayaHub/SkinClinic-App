import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Loader2, User, Phone, Mail, Edit2 } from 'lucide-react';
import type { Database } from '../lib/database.types';
import { useNavigate } from 'react-router-dom';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        if (!user?.id) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setFullName(data.full_name || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setAge(data.age?.toString() || '');
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          email,
          age: parseInt(age),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      if (error) throw error;

      // Update local state
      setProfile(prev => ({
        ...prev!,
        full_name: fullName,
        phone,
        email,
        updated_at: new Date().toISOString()
      }));

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-neutral-900">Mi Perfil</h1>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar Perfil
                </Button>
              )}
            </div>
            <p className="mt-2 text-neutral-600">
              {isEditing ? 'Actualiza tu información personal' : 'Tu información personal'}
            </p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700">
                  Nombre completo
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Correo electrónico
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
                  Teléfono
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                    placeholder="Tu número de teléfono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-neutral-700">
                  Edad
                </label>
                <div className="mt-1">
                  <input
                    id="age"
                    type="number"
                    min="18"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="block w-full px-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                    placeholder="Tu edad"
                  />
                </div>
                <p className="mt-1 text-sm text-neutral-500">
                  Debes ser mayor de 18 años
                </p>
              </div>

              {error && (
                <div className="text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFullName(profile?.full_name || '');
                    setPhone(profile?.phone || '');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-700">Nombre completo</h3>
                <div className="mt-2 flex items-center gap-2 text-neutral-900">
                  <User className="h-5 w-5 text-neutral-400" />
                  {profile?.full_name || 'No especificado'}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-700">Teléfono</h3>
                <div className="mt-2 flex items-center gap-2 text-neutral-900">
                  <Phone className="h-5 w-5 text-neutral-400" />
                  {profile?.phone || 'No especificado'}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-700">Correo electrónico</h3>
                <div className="mt-2 flex items-center gap-2 text-neutral-900">
                  <Mail className="h-5 w-5 text-neutral-400" />
                  {profile?.email || 'No especificado'}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-700">Edad</h3>
                <p className="mt-2 text-neutral-900">
                  {profile?.age || 'No especificado'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-neutral-700">Correo electrónico</h3>
                <div className="mt-2 flex items-center gap-2 text-neutral-900">
                  <Mail className="h-5 w-5 text-neutral-400" />
                  {profile?.email || 'No especificado'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}