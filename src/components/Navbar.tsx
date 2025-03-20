import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Settings } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './Button';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const closeMenu = () => setIsMenuOpen(false);
  const closeProfileMenu = () => setIsProfileOpen(false);
  const isServicesPage = location.pathname === '/services';

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/');
      closeMenu();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [signOut, navigate]);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-semibold">
                <span className="text-rose-300">skin</span>
                <span className="text-rose-300">klinik</span>
                <span className="text-neutral-900"> Med.</span>
                <span className="text-rose-300">Spa</span>
              </span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-8">
            <Link to="/services" className="text-neutral-600 hover:text-rose-300">
              Servicios
            </Link>
            <Link to="/about" className="text-neutral-600 hover:text-rose-300">
              Nosotros
            </Link>
            <Link to="/contact" className="text-neutral-600 hover:text-rose-300">
              Contacto
            </Link>
            {user ? (
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                  Perfil
                </Button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                      {!isAdmin && (
                        <Button
                          as={Link}
                          to="/appointments"
                          variant="secondary"
                          className="w-full justify-start rounded-none px-4 py-2 text-left"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Calendar className="h-5 w-5 mr-2" />
                          Mis Citas
                        </Button>
                      )}
                      <Link
                        to="/profile"
                        className="w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="h-5 w-5" />
                        Mi Perfil
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="h-5 w-5" />
                          Panel Admin
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
                      >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button as={Link} to="/login" variant="outline">
                  Iniciar Sesión
                </Button>
                {!isServicesPage && (
                  <Button as={Link} to="/services" variant="primary">
                    Reservar Cita
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/services"
              onClick={closeMenu}
              className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-rose-300 hover:bg-neutral-100"
            >
              Servicios
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-rose-300 hover:bg-neutral-100"
            >
              Nosotros
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-rose-300 hover:bg-neutral-100"
            >
              Contacto
            </Link>
            {user ? (
              <>
                <div className="px-3 py-2 space-y-2">
                  {!isAdmin && (
                    <Button 
                      as={Link} 
                      to="/appointments" 
                      variant="primary" 
                      className="w-full"
                      onClick={closeMenu}
                    >
                      Mis Citas
                    </Button>
                  )}
                  {isAdmin && (
                    <Button 
                      as={Link} 
                      to="/admin" 
                      variant="primary" 
                      className="w-full"
                      onClick={closeMenu}
                    >
                      Panel Admin
                    </Button>
                  )}
                  <Button 
                    as={Link} 
                    to="/profile" 
                    variant="secondary" 
                    className="w-full mb-2"
                    onClick={closeMenu}
                  >
                    Mi Perfil
                  </Button>
                </div>
                <button
                  onClick={() => {
                    handleSignOut();
                    closeMenu();
                  }}
                  className="block w-full px-3 py-2 text-left text-neutral-600 hover:text-rose-300 hover:bg-neutral-100 flex items-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline"
                  className="w-full"
                  onClick={closeMenu}
                >
                  Iniciar Sesión
                </Button>
                {!isServicesPage && (
                  <Button
                    as={Link}
                    to="/services"
                    variant="primary"
                    className="w-full"
                    onClick={closeMenu}
                  >
                    Reservar Cita
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}