import { ArrowRight, Sparkles, Clock, Calendar } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { AnimatedImage } from '../components/AnimatedImage';

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <div className="absolute inset-0">
          <AnimatedImage
            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
            alt="Hero background"
            wrapperClassName="absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Descubre Faciales en Juriquilla 1
            </h1>
            <p className="mt-6 text-xl text-white">
              Experimenta tratamientos faciales de lujo adaptados a las necesidades únicas de tu piel. Reserva tu
              cita hoy y comienza tu viaje hacia una piel radiante.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button as={Link} to="/services" size="lg" className="group w-full sm:w-auto px-8">
                Agendar Ahora
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button as={Link} to="/services" variant="outline" size="lg" className="bg-white/90 w-full sm:w-auto px-8">
                Ver Servicios
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">¿Por qué elegir ClínicaFacial?</h2>
            <p className="mt-4 text-lg text-neutral-600">
              Ofrecemos servicios excepcionales de cuidado de la piel con un enfoque en tu comodidad y resultados.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <Sparkles className="h-8 w-8 text-rose-300" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-900">Tratamientos Expertos</h3>
              <p className="mt-2 text-neutral-600">
                Nuestros profesionales utilizan técnicas avanzadas y productos premium para resultados óptimos.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <Calendar className="h-8 w-8 text-rose-300" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-900">Reserva Fácil</h3>
              <p className="mt-2 text-neutral-600">
                Reserva tus citas en línea en cualquier momento y lugar con nuestro conveniente sistema de programación.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
                <Clock className="h-8 w-8 text-rose-300" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-neutral-900">Horarios Flexibles</h3>
              <p className="mt-2 text-neutral-600">
                Ofrecemos horarios extendidos y citas los fines de semana para adaptarnos a tu agenda ocupada.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}