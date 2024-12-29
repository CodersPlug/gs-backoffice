import { Search } from "lucide-react";
import { Input } from "./ui/input";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-background border-b border-dark-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-dark-foreground">
          La Posta BackOffice
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="relative max-w-md w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-dark-foreground/60" />
            <Input 
              type="search"
              placeholder="Buscar..."
              className="w-full pl-10 bg-dark-muted border-dark-border text-dark-foreground placeholder:text-dark-foreground/60"
            />
          </div>
          <button className="p-2 hover:bg-dark-muted rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-foreground">
              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;