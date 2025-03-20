import React from 'https://esm.sh/react@18.2.0'

interface Appointment {
  patient_email: string;
  patient_name: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
}

interface AppointmentConfirmationEmailProps {
  appointment: Appointment;
}

const AppointmentConfirmationEmail: React.FC<AppointmentConfirmationEmailProps> = ({ appointment }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: '#333' }}>¡Hola {appointment.patient_name}!</h2>
      <p>Tu cita ha sido confirmada exitosamente.</p>
      <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
        <p style={{ margin: '0' }}><strong>Detalles de la cita:</strong></p>
        <p style={{ margin: '10px 0' }}>Servicio: {appointment.service_name}</p>
        <p style={{ margin: '10px 0' }}>Fecha: {appointment.appointment_date}</p>
        <p style={{ margin: '10px 0' }}>Hora: {appointment.appointment_time}</p>
      </div>
      <p>Por favor, asegúrate de llegar 10 minutos antes de tu cita.</p>
      <p>Si necesitas cancelar o reprogramar tu cita, por favor contáctanos con anticipación.</p>
      <p style={{ color: '#666', fontSize: '14px' }}>Este es un correo automático, por favor no responder.</p>
    </div>
  );
};

export default AppointmentConfirmationEmail; 