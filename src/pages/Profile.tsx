import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Button } from '../components/Button';
import { Loader2, User, Phone, Mail, Edit2, Lock } from 'lucide-react';
import type { Database } from '../lib/database.types';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { calculateAge } from '../lib/utils';

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
  const [birthDate, setBirthDate] = useState('');
  
  // Estados para el cambio de contraseña
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

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
        setBirthDate(data.birth_date || '');
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
          age: birthDate ? calculateAge(birthDate) : null,
          birth_date: birthDate || null,
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSaving(true);

    try {
      // Primero verificamos la contraseña actual
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        throw new Error('La contraseña actual es incorrecta');
      }

      // Si la contraseña actual es correcta, actualizamos a la nueva
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setPasswordError(err.message);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">Mi Perfil</h1>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </Button>
          </div>

          <p className="mt-2 text-neutral-600 mb-8">
            {isEditing ? 'Actualiza tu información personal' : 'Tu información personal'}
          </p>

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

              <div className="space-y-4">
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-neutral-700">
                    Fecha de nacimiento
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      id="birthDate"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-neutral-900">
                      {profile?.birth_date ? format(new Date(profile.birth_date), 'dd/MM/yyyy') : 'No especificada'}
                      {profile?.birth_date && 
                        ` (${calculateAge(profile.birth_date)} años)`
                      }
                    </p>
                  )}
                </div>
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
                <h3 className="text-sm font-medium text-neutral-700">Fecha de nacimiento</h3>
                <p className="mt-2 text-neutral-900">
                  {profile?.birth_date ? format(new Date(profile.birth_date), 'dd/MM/yyyy') : 'No especificada'}
                  {profile?.birth_date && 
                    ` (${calculateAge(profile.birth_date)} años)`
                  }
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Cambiar Contraseña</h2>
              <Button
                variant="outline"
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="flex items-center gap-2"
              >
                <Lock className="h-4 w-4" />
                {isChangingPassword ? 'Cancelar' : 'Cambiar'}
              </Button>
            </div>

            {isChangingPassword && (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-neutral-700">
                    Contraseña Actual
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="current-password"
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-neutral-700">
                    Nueva Contraseña
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="new-password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700">
                    Confirmar Nueva Contraseña
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="text-sm text-red-600">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="text-sm text-emerald-600">
                    Contraseña actualizada correctamente
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full flex justify-center"
                >
                  {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Actualizar Contraseña'
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}