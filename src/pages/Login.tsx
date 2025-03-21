import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Mail, Lock, Loader2, Chrome, CheckCircle } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const showConfirmation = location.state?.showConfirmation;

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Correo o contraseña inválidos');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (err) {
      setError('Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError('Error al iniciar sesión con Google');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {showConfirmation && (
          <div className="mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-6">
              <CheckCircle className="w-8 h-8 text-rose-400" />
            </div>
            <h1 className="text-3xl font-medium text-neutral-900 mb-3">
              Revisa tu correo
            </h1>
            <p className="text-neutral-600 text-lg leading-relaxed">
              Te hemos enviado un email para confirmar tu cuenta. Una vez confirmada, podrás agendar tu cita.
            </p>
          </div>
        )}

        <div className="text-center">
          <h2 className="text-3xl font-bold text-neutral-900">Bienvenido de nuevo</h2>
          <p className="mt-2 text-neutral-600">
            Inicia sesión para gestionar tus citas
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                  Contraseña
                </label>
                <button
                  onClick={handlePasswordReset}
                  className="text-sm font-medium text-rose-300 hover:text-rose-400"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
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
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          {resetEmailSent && (
            <div className="text-sm text-emerald-600">
              Te hemos enviado un correo con las instrucciones para restablecer tu contraseña
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
                'Iniciar Sesión'
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neutral-50 text-neutral-500">
                  O continúa con
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
            ¿No tienes una cuenta?{' '}
            <Link to="/signup" className="font-medium text-rose-300 hover:text-rose-400">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}