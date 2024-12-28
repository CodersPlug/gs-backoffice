import { Github, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Acerca de</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Nuestra Historia</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Trabajá con Nosotros</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Prensa</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Soporte</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Centro de Ayuda</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Centro de Seguridad</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Comunidad</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Términos del Servicio</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Política de Cookies</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Seguinos</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">© 2024 Pinspiration. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;