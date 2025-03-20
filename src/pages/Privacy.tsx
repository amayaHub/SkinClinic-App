import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function Privacy() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900">Aviso de Privacidad</h1>
          <p className="mt-4 text-lg text-neutral-600">
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Responsable del Tratamiento de Datos</h2>
            <p className="text-neutral-600 mb-4">
              skinklinik Med.Spa, con domicilio en Av. Constituyentes 1001, Col. Juriquilla, 76230, Querétaro, QRO, es responsable del tratamiento de sus datos personales.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. Datos Personales que Recopilamos</h2>
            <p className="text-neutral-600 mb-4">
              Para proporcionarle nuestros servicios, podemos recopilar los siguientes datos personales:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Nombre completo</li>
              <li>Información de contacto (teléfono, correo electrónico, dirección)</li>
              <li>Fecha de nacimiento</li>
              <li>Historial médico relevante</li>
              <li>Información sobre tratamientos previos</li>
              <li>Fotografías relacionadas con los tratamientos (con su consentimiento)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. Finalidades del Tratamiento de Datos</h2>
            <p className="text-neutral-600 mb-4">
              Sus datos personales serán utilizados para las siguientes finalidades:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Prestación de servicios estéticos y médicos</li>
              <li>Seguimiento de tratamientos</li>
              <li>Gestión de citas y recordatorios</li>
              <li>Facturación y cobro</li>
              <li>Envío de promociones y novedades (con su consentimiento)</li>
              <li>Mejora de nuestros servicios</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Transferencia de Datos</h2>
            <p className="text-neutral-600 mb-4">
              Sus datos personales pueden ser transferidos y tratados dentro y fuera del país por personas distintas a skinklinik Med.Spa. En ese sentido, su información puede ser compartida con:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Profesionales médicos asociados</li>
              <li>Proveedores de servicios que nos ayudan a operar</li>
              <li>Autoridades cuando sea requerido por ley</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Derechos ARCO</h2>
            <p className="text-neutral-600 mb-4">
              Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la normativa (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Medidas de Seguridad</h2>
            <p className="text-neutral-600 mb-4">
              Implementamos diversas medidas de seguridad para mantener la confidencialidad de su información personal:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Protocolos de seguridad en nuestros sistemas informáticos</li>
              <li>Acceso restringido a información personal</li>
              <li>Acuerdos de confidencialidad con nuestro personal</li>
              <li>Monitoreo continuo de nuestras medidas de seguridad</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">7. Cambios al Aviso de Privacidad</h2>
            <p className="text-neutral-600 mb-4">
              Nos reservamos el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad. Estas modificaciones estarán disponibles a través de los siguientes medios:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Anuncios visibles en nuestros establecimientos</li>
              <li>En nuestra página web</li>
              <li>Por correo electrónico a los clientes que lo hayan proporcionado</li>
            </ul>
          </section>

          <div className="mt-16 text-center">
            <p className="text-neutral-600 mb-8">
              Para ejercer sus derechos ARCO o si tiene alguna pregunta sobre nuestro aviso de privacidad, puede contactarnos:
            </p>
            <Button as={Link} to="/contact" variant="outline" size="lg">
              Contactar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}