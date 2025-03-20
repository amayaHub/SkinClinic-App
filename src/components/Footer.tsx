import { Link } from 'react-router-dom';
import { Facebook, Instagram, Phone, Mail, MessageCircle } from 'lucide-react';
import { BrandTiktok } from '../icons/BrandTiktok';

export function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Icons Top */}
        <div className="flex justify-center gap-6 mb-12">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition-colors">
            <Facebook className="h-6 w-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition-colors">
            <Instagram className="h-6 w-6" />
          </a>
          <a href="https://wa.me/+528112286916" target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition-colors">
            <MessageCircle className="h-6 w-6" />
          </a>
          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition-colors">
            <BrandTiktok className="h-6 w-6" />
          </a>
        </div>

        {/* Logo */}
        <div className="text-center mb-16">
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-bold">
              <span className="text-white">skin</span>
              <span className="text-rose-300">klinik</span>
              <span className="text-white"> Med.</span>
              <span className="text-rose-300">Spa</span>
            </h2>
          </Link>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-300">CLIENTES</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="block hover:text-rose-300 transition-colors">Tienda</Link></li>
              <li><Link to="/contact" className="block hover:text-rose-300 transition-colors">Contacto</Link></li>
              <li><Link to="/about" className="block hover:text-rose-300 transition-colors">Bolsa de Trabajo</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-300">INFORMACIÓN</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="block hover:text-rose-300 transition-colors">Aviso de Privacidad</Link></li>
              <li><Link to="/terms" className="block hover:text-rose-300 transition-colors">Términos & Condiciones</Link></li>
              <li><Link to="/billing" className="block hover:text-rose-300 transition-colors">Facturación</Link></li>
              <li><Link to="/doctors" className="block hover:text-rose-300 transition-colors">Nuestros Doctores</Link></li>
              <li><Link to="/subscribe" className="block hover:text-rose-300 transition-colors">Suscríbete</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-300">COMPARTE</h3>
            <ul className="space-y-2">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition-colors">Facebook</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition-colors">Instagram</a></li>
              <li><a href="https://wa.me/+528112286916" target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition-colors">WhatsApp</a></li>
              <li><a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-rose-300 transition-colors">TikTok</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-300">SUCURSALES</h3>
            <p className="text-neutral-400">Horarios:</p>
            <p className="mb-2">Lun - Vie: 8 am a 8 pm</p>
            <p className="mb-4">Sábados: 9 am a 4 pm</p>
            <Link to="/locations" className="text-rose-300 hover:text-rose-400 transition-colors">
              Ubica nuestras sucursales aquí
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-rose-300">CONTACTO</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:hola@skinklinik.com.mx" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  hola@skinklinik.com.mx
                </a>
              </li>
              <li>
                <a href="tel:+528112341737" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono: (81) 1234 1737
                </a>
              </li>
              <li>
                <a href="https://wa.me/+528112286916" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Whatsapp: (81) 1228 6916
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex justify-center gap-4 mb-8">
          <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/cc-badges-ppmcvdam.png" alt="Payment Methods" className="h-8" />
        </div>
      </div>
    </footer>
  );
}