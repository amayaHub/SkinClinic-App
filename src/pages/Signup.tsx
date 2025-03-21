import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Mail, Lock, Loader2, Chrome } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Error al registrarse con Google');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;
      if (!user?.id) throw new Error('No user ID returned after signup');

      navigate('/login', { 
        state: { showConfirmation: true }
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError('Error al crear la cuenta. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Crear una cuenta</h2>
          <p className="mt-2 text-neutral-600">
            Únete para comenzar a reservar tus tratamientos de belleza
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                Contraseña
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
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full flex justify-center"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Crear cuenta'
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neutral-50 text-neutral-500">
                  O regístrate con
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full flex justify-center items-center gap-2"
            >
              {googleLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Chrome className="h-5 w-5" />
                  Google
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-neutral-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="font-medium text-rose-300 hover:text-rose-400">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}