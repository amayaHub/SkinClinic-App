import { supabase } from './supabase';

interface AppointmentConfirmationEmailProps {
  to: string;
  appointmentDate: string;
  serviceName: string;
  clientName: string;
}

export async function sendAppointmentConfirmationEmail({
  to,
  appointmentDate,
  serviceName,
  clientName,
}: AppointmentConfirmationEmailProps) {
  try {
    console.log('Iniciando envío de correo...');
    
    const appointmentData = {
      patient_email: to,
      patient_name: clientName,
      service_name: serviceName,
      appointment_date: appointmentDate,
      appointment_time: appointmentDate.split('a las')[1]?.trim() || ''
    };
    
    console.log('Datos de la cita:', appointmentData);

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No hay sesión activa');
    }

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: JSON.stringify({
        appointment: appointmentData
      }),
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });

    if (error) {
      console.error('Error detallado:', error);
      throw error;
    }

    console.log('Correo enviado exitosamente:', data);
    return data;
  } catch (error) {
    console.error('Error completo en sendAppointmentConfirmationEmail:', error);
    throw error;
  }
} 