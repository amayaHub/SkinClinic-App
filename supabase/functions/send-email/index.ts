import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'https://esm.sh/resend@2.0.0'
import { render } from 'https://esm.sh/@react-email/render@0.0.7'
import AppointmentConfirmationEmail from './templates/AppointmentConfirmationEmail.tsx'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configuración de Resend para Deno
const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://skinclinic.vercel.app',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Content-Type': 'application/json'
}

serve(async (req) => {
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return new Response(null, { 
      status: 204,
      headers: corsHeaders 
    })
  }

  try {
    // Verificar autorización
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing authorization header',
          message: 'Se requiere un token de autorización válido para acceder a este endpoint'
        }),
        { 
          status: 401,
          headers: corsHeaders
        }
      )
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token length:', token.length);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    console.log('Auth check result:', authError ? 'Error' : 'Success');
    console.log('User:', user ? 'Present' : 'Missing');

    if (authError || !user) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid authorization token',
          message: 'El token de autorización no es válido o ha expirado'
        }),
        { 
          status: 401,
          headers: corsHeaders
        }
      )
    }

    let bodyText;
    try {
      bodyText = await req.text();
      console.log('Raw request body:', bodyText);
      const body = JSON.parse(bodyText);
      console.log('Parsed request body:', body);
      
      if (!body || !body.appointment) {
        return new Response(
          JSON.stringify({ 
            error: 'Missing appointment data',
            message: 'Se requiere la información de la cita',
            receivedBody: bodyText
          }),
          { 
            status: 400,
            headers: corsHeaders
          }
        )
      }

      const { appointment } = body;
      console.log('Appointment data:', appointment);

      console.log('Attempting to send email to:', appointment.patient_email);
      const { data, error } = await resend.emails.send({
        from: 'SkinClinic <onboarding@resend.dev>',
        to: appointment.patient_email,
        subject: 'Confirmación de Cita - SkinClinic',
        html: render(AppointmentConfirmationEmail({ appointment })),
        text: render(AppointmentConfirmationEmail({ appointment }), {
          plainText: true,
        }),
      });

      if (error) {
        console.error('Resend error:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Email sending failed',
            message: error.message
          }),
          { 
            status: 400,
            headers: corsHeaders
          }
        )
      }

      console.log('Email sent successfully:', data);
      return new Response(
        JSON.stringify({ 
          success: true,
          data,
          message: 'Correo enviado exitosamente'
        }),
        { 
          headers: corsHeaders,
          status: 200,
        },
      )
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body',
          message: 'Error al procesar el cuerpo de la solicitud',
          receivedBody: bodyText
        }),
        { 
          status: 400,
          headers: corsHeaders
        }
      )
    }
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message
      }),
      { 
        status: 500,
        headers: corsHeaders
      }
    )
  }
}) 