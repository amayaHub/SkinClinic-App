import { Clock, Loader2, ChevronRight, DollarSign } from 'lucide-react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { AnimatedImage } from '../components/AnimatedImage';
import { useServices } from '../hooks/useServices';
import { Dialog } from '../components/Dialog';
import { useState } from 'react';
import type { Service } from '../hooks/useServices';

export function Services() {
  const { services, loading, error } = useServices();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-rose-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
              Nuestros Tratamientos
            </h1>
            <p className="mt-4 text-xl text-neutral-600 max-w-2xl mx-auto">
              Descubre nuestra gama de tratamientos faciales profesionales, cada uno diseñado para atender tus necesidades específicas de cuidado de la piel.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border cursor-pointer transition-all hover:border-rose-200 hover:shadow-lg"
              onClick={() => setSelectedService(service)}
            >
              <div className="aspect-[3/2] relative overflow-hidden">
                <AnimatedImage
                  src={service.image}
                  alt={service.name}
                  className="absolute inset-0"
                  wrapperClassName="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-neutral-900">{service.name}</h2>
                <div className="mt-1 flex items-center gap-4 text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-5 w-5" />
                    <span>
                      {service.duration.replace('min', 'minutos')}
                    </span>
                    <span className="text-rose-300 font-medium ml-4">
                      ${service.price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-neutral-600 line-clamp-2">{service.description}</p>
                <div className="mt-4 flex items-center text-sm text-rose-300 group-hover:text-rose-400">
                  Ver detalles
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog
          open={selectedService !== null}
          onClose={() => setSelectedService(null)}
        >
          {selectedService && (
            <div className="flex flex-col max-h-[80vh]">
              <div className="p-6 flex-1 overflow-y-auto">
                <h2 className="text-2xl font-bold text-neutral-900">{selectedService.name}</h2>
                <div className="mt-2 flex items-center gap-4 text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-5 w-5" />
                    <span>{selectedService.duration.replace('min', 'minutos')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-400 font-medium">
                    <DollarSign className="h-5 w-5" />
                    <span>
                      {selectedService.price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-neutral-600">{selectedService.description}</p>
                <div className="mt-6">
                  <h3 className="font-semibold text-neutral-900">Beneficios:</h3>
                  <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                    {selectedService.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-neutral-600">
                        <div className="h-1.5 w-1.5 rounded-full bg-rose-200" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-4 border-t bg-white sticky bottom-0">
                <Button
                  as={Link}
                  to={`/book?service=${selectedService.id}`}
                  className="w-full sm:w-auto"
                >
                  Reservar Este Tratamiento
                </Button>
              </div>
            </div>
          )}
        </Dialog>
      </div>

      {/* CTA Section */}
      <div className="bg-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">
              ¿No estás seguro qué tratamiento es el adecuado para ti?
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Nuestros expertos en cuidado de la piel están aquí para ayudarte a elegir el tratamiento perfecto para tu tipo de piel y preocupaciones.
            </p>
            <Button
              as={Link}
              to="/contact"
              variant="outline"
              size="lg"
              className="mt-8"
            >
              Contáctanos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}