import { MapPin, Phone, Mail, Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Button } from '../components/Button';

export function Contact() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/+524421234567?text=Hola,%20me%20gustaría%20obtener%20más%20información', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-neutral-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
              Contáctanos
            </h1>
            <p className="mt-4 text-xl text-neutral-600 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Contáctanos y descubre cómo podemos transformar tu experiencia de cuidado facial.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">
                  Información de Contacto
                </h2>
                <p className="mt-4 text-neutral-600">
                  Encuentra la manera más conveniente de contactarnos.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-rose-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">Ubicación</h3>
                    <p className="mt-2 text-neutral-600">
                      Av. Constituyentes 1001<br />
                      Col. Juriquilla, 76230<br />
                      Querétaro, QRO
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-rose-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">Teléfono</h3>
                    <a 
                      href="tel:+524421234567"
                      className="mt-2 text-neutral-600 hover:text-rose-500 transition-colors block"
                    >
                      +52 (442) 123 4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-rose-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-neutral-900">Email</h3>
                    <a 
                      href="mailto:contacto@clinicafacial.com"
                      className="mt-2 text-neutral-600 hover:text-rose-500 transition-colors block"
                    >
                      contacto@clinicafacial.com
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-neutral-900">Síguenos</h3>
                <div className="mt-4 flex gap-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center hover:bg-rose-100 transition-colors"
                  >
                    <Facebook className="w-5 h-5 text-rose-500" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center hover:bg-rose-100 transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-rose-500" />
                  </a>
                  <a
                    href="https://wa.me/+524421234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center hover:bg-rose-100 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-rose-500" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map and CTA */}
            <div className="space-y-8">
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-neutral-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734.873807847576!2d-100.4464138!3d20.6923046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d357597f718519%3A0x4d20fffd87030872!2sAv.%20Constituyentes%201001%2C%20Juriquilla%2C%2076230%20Santiago%20de%20Quer%C3%A9taro%2C%20Qro.!5e0!3m2!1ses!2smx!4v1647894532026!5m2!1ses!2smx"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>

              <div className="bg-rose-50 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-neutral-900">
                  ¿Tienes alguna pregunta?
                </h3>
                <p className="mt-2 text-neutral-600">
                  Escríbenos por WhatsApp y te responderemos a la brevedad.
                </p>
                <Button
                  onClick={handleWhatsAppClick}
                  size="lg"
                  className="mt-6 w-full sm:w-auto"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Escríbenos por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-neutral-900">
              Horario de Atención
            </h2>
            <div className="mt-8 inline-flex flex-col gap-2 text-neutral-600">
              <p>Lunes a Viernes: 9:00 AM - 7:00 PM</p>
              <p>Sábados: 9:00 AM - 2:00 PM</p>
              <p>Domingos: Cerrado</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}