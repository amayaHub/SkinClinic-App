import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { useServices } from '../../hooks/useServices';
import { supabase } from '../../lib/supabase';
import type { Service } from '../../hooks/useServices';

export function AdminServices() {
  const { services, loading, error, refresh } = useServices();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    image: '',
    benefits: ['']
  });

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      image: service.image,
      benefits: service.benefits
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setFormData({
      name: '',
      description: '',
      duration: '',
      image: '',
      benefits: ['']
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await refresh();
    } catch (err) {
      console.error('Error deleting service:', err);
      alert('Error al eliminar el servicio');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (selectedService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            name: formData.name,
            description: formData.description,
            duration: formData.duration,
            image: formData.image,
            benefits: formData.benefits.filter(b => b.trim() !== ''),
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedService.id);

        if (error) throw error;
      } else {
        // Create new service
        const { error } = await supabase
          .from('services')
          .insert({
            name: formData.name,
            description: formData.description,
            duration: formData.duration,
            image: formData.image,
            benefits: formData.benefits.filter(b => b.trim() !== '')
          });

        if (error) throw error;
      }

      await refresh();
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving service:', err);
      alert('Error al guardar el servicio');
    } finally {
      setIsSaving(false);
    }
  };

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }));
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => i === index ? value : b)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-rose-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-8">
          <Button
            as={Link}
            to="/admin"
            variant="outline"
            size="sm"
            className="bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:text-rose-700 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Panel Admin
          </Button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">Gestionar Servicios</h1>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nuevo Servicio
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {services.map(service => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-neutral-900">{service.name}</h2>
                  <p className="mt-2 text-neutral-600">{service.description}</p>
                  <p className="mt-2 text-sm text-neutral-500">Duración: {service.duration}</p>
                  <div className="mt-4">
                    <h3 className="font-medium text-neutral-900">Beneficios:</h3>
                    <ul className="mt-2 grid grid-cols-2 gap-2">
                      {service.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-neutral-600">
                          <div className="h-1.5 w-1.5 rounded-full bg-rose-200" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(service)}
                    className="flex items-center gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(service.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">
              {selectedService ? 'Editar Servicio' : 'Nuevo Servicio'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-neutral-700">
                  Duración
                </label>
                <input
                  type="text"
                  id="duration"
                  value={formData.duration}
                  onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                  placeholder="60 min"
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-neutral-700">
                  URL de la imagen
                </label>
                <input
                  type="url"
                  id="image"
                  value={formData.image}
                  onChange={e => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-neutral-300 px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">
                  Beneficios
                </label>
                <div className="mt-2 space-y-2">
                  {formData.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={benefit}
                        onChange={e => updateBenefit(index, e.target.value)}
                        className="flex-1 rounded-md border border-neutral-300 px-3 py-2"
                        placeholder="Beneficio del tratamiento"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBenefit}
                    className="w-full justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Beneficio
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </Dialog>
      </div>
    </div>
  );
}