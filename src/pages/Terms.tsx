import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function Terms() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900">Términos y Condiciones</h1>
          <p className="mt-4 text-lg text-neutral-600">
            Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">1. Aceptación de los Términos</h2>
            <p className="text-neutral-600 mb-4">
              Al acceder y utilizar los servicios de skinklinik Med.Spa, usted acepta estos términos y condiciones en su totalidad. Si no está de acuerdo con estos términos, por favor no utilice nuestros servicios.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">2. Servicios</h2>
            <p className="text-neutral-600 mb-4">
              skinklinik Med.Spa ofrece servicios de tratamientos faciales y estéticos. Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto de nuestros servicios en cualquier momento.
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Todos los tratamientos son realizados por profesionales certificados</li>
              <li>Los resultados pueden variar según el individuo</li>
              <li>Se requiere una consulta previa para ciertos tratamientos</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">3. Citas y Cancelaciones</h2>
            <p className="text-neutral-600 mb-4">
              Para garantizar la calidad de nuestro servicio, seguimos una política estricta de citas y cancelaciones:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Las citas deben programarse con al menos 24 horas de anticipación</li>
              <li>Las cancelaciones deben realizarse con un mínimo de 12 horas de anticipación</li>
              <li>No presentarse a una cita sin previo aviso puede resultar en cargos adicionales</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">4. Pagos y Reembolsos</h2>
            <p className="text-neutral-600 mb-4">
              Aceptamos diversos métodos de pago y nuestra política de reembolsos es la siguiente:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>Los pagos deben realizarse al momento de recibir el servicio</li>
              <li>Los paquetes y promociones no son reembolsables</li>
              <li>Los reembolsos por servicios no satisfactorios se evaluarán caso por caso</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Responsabilidad</h2>
            <p className="text-neutral-600 mb-4">
              skinklinik Med.Spa se compromete a proporcionar servicios de la más alta calidad, sin embargo:
            </p>
            <ul className="list-disc pl-6 text-neutral-600 mb-4">
              <li>No nos hacemos responsables por reacciones alérgicas no reportadas previamente</li>
              <li>Los clientes deben informar sobre condiciones médicas relevantes</li>
              <li>Nos reservamos el derecho de rechazar el servicio por razones de seguridad</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-4">6. Privacidad</h2>
            <p className="text-neutral-600 mb-4">
              Protegemos su privacidad y datos personales de acuerdo con nuestra política de privacidad. Para más información, consulte nuestro{' '}
              <Link to="/privacy" className="text-rose-300 hover:text-rose-400">
                Aviso de Privacidad
              </Link>.
            </p>
          </section>

          <div className="mt-16 text-center">
            <p className="text-neutral-600 mb-8">
              Si tiene alguna pregunta sobre nuestros términos y condiciones, no dude en contactarnos.
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