import { Heart, Star, Award, Users } from 'lucide-react';
import { AnimatedImage } from '../components/AnimatedImage';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-rose-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
              Expertos en Belleza y Cuidado Facial
            </h1>
            <p className="mt-4 text-xl text-neutral-600 max-w-2xl mx-auto">
              Con más de 10 años de experiencia, nos dedicamos a realzar tu belleza natural a través de tratamientos personalizados y tecnología de vanguardia.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Nuestra Misión</h2>
              <p className="mt-4 text-lg text-neutral-600">
                En ClínicaFacial, nos dedicamos a proporcionar servicios de belleza y cuidado facial de la más alta calidad. Nuestro compromiso es ayudarte a alcanzar y mantener una piel saludable y radiante, adaptando cada tratamiento a tus necesidades específicas.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Cuidado Personalizado</h3>
                    <p className="mt-2 text-neutral-600">
                      Cada tratamiento se adapta a las necesidades únicas de tu piel.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <Star className="w-5 h-5 text-rose-500" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Excelencia en Servicio</h3>
                    <p className="mt-2 text-neutral-600">
                      Nuestro equipo está comprometido con tu satisfacción y resultados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <AnimatedImage
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
                alt="Tratamiento facial"
                className="absolute inset-0 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <AnimatedImage
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
                alt="Visión de futuro"
                className="absolute inset-0 object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-neutral-900">Nuestra Visión</h2>
              <p className="mt-4 text-lg text-neutral-600">
                Aspiramos a ser líderes en la industria del cuidado facial, reconocidos por nuestra innovación, excelencia y compromiso con la satisfacción del cliente. Buscamos transformar vidas a través de tratamientos personalizados que realcen la belleza natural de cada persona.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center">
                      <Star className="w-5 h-5 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Innovación Constante</h3>
                    <p className="mt-2 text-neutral-600">
                      Manteniéndonos a la vanguardia con las últimas tecnologías y técnicas en cuidado facial.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900">Belleza Natural</h3>
                    <p className="mt-2 text-neutral-600">
                      Potenciando la belleza única de cada cliente con tratamientos personalizados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">Nuestra Tecnología</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Utilizamos equipos de última generación para garantizar los mejores resultados en todos nuestros tratamientos.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-[4/3] relative">
                <AnimatedImage
                  src="https://www.clinicasdh.com/wp-content/uploads/2019/11/laser-diodo-trio.jpg"
                  alt="Láser Diodo Trío"
                  className="absolute inset-0 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900">Láser Diodo Trío</h3>
                <p className="mt-4 text-sm text-neutral-600">
                  Tres tipos de onda láser actuando al mismo tiempo. Esto garantiza el resultado de la sesión. El aplicador tiene un recubrimiento de zafiro con enfriamiento para evitar dolor y daño en tu piel.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-[4/3] relative">
                <AnimatedImage
                  src="https://www.clinicasdh.com/wp-content/uploads/2019/11/s-shape.jpg"
                  alt="S-Shape"
                  className="absolute inset-0 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900">S-Shape</h3>
                <p className="mt-4 text-sm text-neutral-600">
                  Reduce tallas y reafirma tu piel. Máxima potencia en radiofrecuencia, cavitación, electroporación y succión.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-[4/3] relative">
                <AnimatedImage
                  src="https://www.clinicasdh.com/wp-content/uploads/2019/11/hydrafacial.jpg"
                  alt="Hydrafacial"
                  className="absolute inset-0 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900">Hydrafacial</h3>
                <p className="mt-4 text-sm text-neutral-600">
                  Único que combina limpieza profunda, hidratación y extracción de puntos negros a través de agua. Tu piel más clara y hermosa. El tratamiento es calmante y no invasivo.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-[4/3] relative">
                <AnimatedImage
                  src="https://www.clinicasdh.com/wp-content/uploads/2019/11/hifu.jpg"
                  alt="HIFU"
                  className="absolute inset-0 object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900">HIFU</h3>
                <p className="mt-4 text-sm text-neutral-600">
                  Ultrasonido focalizado de alta intensidad que estimula la producción natural de colágeno. Resultados visibles desde la primera sesión con efecto lifting sin cirugía.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mb-4">
                <Users className="w-6 h-6 text-rose-500" />
              </div>
              <div className="text-4xl font-bold text-neutral-900">5000+</div>
              <div className="mt-2 text-neutral-600">Clientes Satisfechos</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mb-4">
                <Star className="w-6 h-6 text-rose-500" />
              </div>
              <div className="text-4xl font-bold text-neutral-900">10+</div>
              <div className="mt-2 text-neutral-600">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mb-4">
                <Award className="w-6 h-6 text-rose-500" />
              </div>
              <div className="text-4xl font-bold text-neutral-900">15+</div>
              <div className="mt-2 text-neutral-600">Premios Recibidos</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 mb-4">
                <Heart className="w-6 h-6 text-rose-500" />
              </div>
              <div className="text-4xl font-bold text-neutral-900">98%</div>
              <div className="mt-2 text-neutral-600">Tasa de Satisfacción</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-rose-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-neutral-900">
            Comienza Tu Transformación Hoy
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Agenda una consulta con nuestros expertos y descubre cómo podemos ayudarte a alcanzar tus objetivos de belleza.
          </p>
          <Button
            as={Link}
            to="/book"
            size="lg"
            className="mt-8"
          >
            Reservar Cita
          </Button>
        </div>
      </section>
    </div>
  );
}