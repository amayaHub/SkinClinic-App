import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './Button';
import { Loader2, Mail, Phone, User, Lock, CheckCircle } from 'lucide-react';

interface ClientFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ClientForm({ onClose, onSuccess }: ClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      
      if (signUpError) throw signUpError;
      if (!user?.id) throw new Error('No se pudo crear el usuario');
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          full_name: formData.full_name,
          phone: formData.phone,
          age: formData.age ? parseInt(formData.age) : null
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setShowSuccess(true);
    } catch (err: any) {
      console.error('Error creating client:', err);
      setError(err.message || 'Error al crear el cliente. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 mb-3">
          <CheckCircle className="w-8 h-8 text-rose-400" />
        </div>
        <h3 className="text-xl font-medium text-neutral-900 mb-2">
          ¡Cliente registrado con éxito!
        </h3>
        <p className="text-neutral-600 text-sm mb-6">
          Te enviaremos un correo electrónico con la confirmación de tu cuenta. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para activar tu cuenta.
        </p>
        <Button
          type="button"
          onClick={onClose}
          className="w-full justify-center"
        >
          Aceptar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="text-center mb-3">
        <h2 className="text-xl font-bold text-neutral-900">Nuevo Cliente</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Ingresa los datos del nuevo cliente
        </p>
      </div>

      <div className="space-y-2">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-neutral-700">
            Nombre completo
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="text"
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="block w-full pl-10 pr-3 py-1.5 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent text-sm"
              placeholder="Nombre completo"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="block w-full pl-10 pr-3 py-1.5 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent text-sm"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="block w-full pl-10 pr-3 py-1.5 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent text-sm"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">
            Teléfono
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="block w-full pl-10 pr-3 py-1.5 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent text-sm"
              placeholder="Número de teléfono"
            />
          </div>
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium text-neutral-700">
            Edad
          </label>
          <div>
            <input
              type="number"
              id="age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="block w-full px-3 py-1.5 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-transparent text-sm"
              placeholder="Edad"
              min="18"
              max="120"
            />
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">Debes ser mayor de 18 años</p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-1.5 pt-1">
        <Button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-1.5 h-auto text-sm"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            'Registrar Cliente'
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="w-full py-1.5 h-auto text-sm"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}