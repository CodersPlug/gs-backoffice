import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Pinspiration</h1>
            <nav className="hidden md:flex space-x-4">
              <Button variant="ghost">Inicio</Button>
              <Button variant="ghost">Explorar</Button>
              <Button variant="ghost">Crear</Button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-64 px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <Button className="bg-primary hover:bg-primary/90">Ingresar</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;