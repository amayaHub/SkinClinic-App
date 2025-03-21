import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../lib/supabase';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Restablecer contraseña</h2>
          <p className="mt-2 text-neutral-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Nueva contraseña
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700">
                Confirmar contraseña
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
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-emerald-600">
              Contraseña actualizada correctamente. Serás redirigido al inicio de sesión...
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Restablecer contraseña'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 