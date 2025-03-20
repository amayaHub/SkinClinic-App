import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { format, isEqual } from 'date-fns';
import { useAdmin } from './useAdmin';
import { useAuth } from '../contexts/AuthContext';

export type Appointment = Database['public']['Tables']['appointments']['Row'];

export function useAppointments(date?: Date) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAdmin();
  const { user } = useAuth();

  const fetchAppointments = useCallback(async () => {
    try {
      if (!user) return;

      let query = supabase
        .from('appointments')
        .select('*');

      if (date) {
        // Convert date to YYYY-MM-DD format for comparison
        const dateStr = format(date, 'yyyy-MM-dd');
        query = query.gte('scheduled_for', `${dateStr}T00:00:00`)
                    .lte('scheduled_for', `${dateStr}T23:59:59`);
      }

      // Regular users can only see their own appointments
      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  }, [date, isAdmin, user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refresh: fetchAppointments };
}