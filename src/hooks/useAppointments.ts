import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import { format, isEqual } from 'date-fns';
import { useAdmin } from './useAdmin';
import { useAuth } from '../contexts/AuthContext';

export type Appointment = Database['public']['Tables']['appointments']['Row'];

export function useAppointments(date?: Date, filterByUser: boolean = true) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin, loading: loadingAdmin } = useAdmin();
  const { user } = useAuth();

  const fetchAppointments = useCallback(async () => {
    try {
      console.log('Estado inicial:', {
        filterByUser,
        isAdmin,
        loadingAdmin,
        userId: user?.id,
        date: date?.toISOString()
      });

      // Si necesitamos filtrar por usuario pero no hay usuario, retornamos un arreglo vacío
      if (filterByUser && !user) {
        console.log('No hay usuario y filterByUser es true, retornando arreglo vacío');
        setAppointments([]);
        return;
      }

      // Si estamos cargando el estado de admin, esperamos
      if (loadingAdmin) {
        console.log('Esperando a que se cargue el estado de admin...');
        return;
      }

      let query = supabase
        .from('appointments')
        .select('*');

      if (date) {
        // Convert local date to UTC for comparison
        const localDate = new Date(date);
        const dateStr = format(localDate, 'yyyy-MM-dd');
        
        // Cuando es 00:00 en México (GMT-6), es 06:00 UTC del mismo día
        const startTime = `${dateStr}T06:00:00.000Z`;
        
        // Cuando es 23:59 en México, es 05:59:59 UTC del día siguiente
        const nextDay = new Date(localDate);
        nextDay.setDate(nextDay.getDate() + 1);
        const nextDayStr = format(nextDay, 'yyyy-MM-dd');
        const endTime = `${nextDayStr}T05:59:59.999Z`;
        
        console.log('Buscando citas entre:', startTime, 'y', endTime);
        console.log('Fecha local seleccionada:', format(localDate, 'yyyy-MM-dd'));
        
        query = query
          .gte('scheduled_for', startTime)
          .lt('scheduled_for', endTime)
          .in('status', ['pending', 'confirmed']);
      }

      // Solo filtrar por usuario si filterByUser es true y hay un usuario
      if (filterByUser && user && !isAdmin) {
        console.log('Aplicando filtro por usuario:', user.id);
        query = query.eq('user_id', user.id);
      } else {
        console.log('No se aplica filtro por usuario:', {
          filterByUser,
          hasUser: !!user,
          isAdmin,
          loadingAdmin
        });
      }

      // Debug: mostrar la consulta SQL que se va a ejecutar
      console.log('Query a ejecutar:', query.toSQL?.());

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      
      console.log('Citas encontradas:', data?.length || 0, 'citas');
      if (data) {
        data.forEach(apt => {
          const utcDate = new Date(apt.scheduled_for);
          // Obtener la hora local usando toLocaleTimeString
          const localTime = utcDate.toLocaleTimeString('es-MX', {
            timeZone: 'America/Mexico_City',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
          
          console.log('Cita:', {
            id: apt.id,
            utc: apt.scheduled_for,
            estado: apt.status,
            hora_local: localTime,
            fecha_local: format(utcDate, 'yyyy-MM-dd'),
            usuario: apt.user_id
          });
        });
      }
      
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Error al cargar las citas');
      // En caso de error, asegurarnos de que appointments sea un arreglo vacío
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [date, isAdmin, loadingAdmin, user, filterByUser]);

  useEffect(() => {
    setLoading(true);
    fetchAppointments();
  }, [fetchAppointments, date]);

  return { appointments, loading: loading || loadingAdmin, error, refresh: fetchAppointments };
}