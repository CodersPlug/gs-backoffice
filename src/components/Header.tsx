import { Search, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AICopilot from "./AICopilot";

const Header = () => {
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-background/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-dark-foreground">La Posta BackOffice</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-64 px-4 py-2 rounded-full bg-gray-100 dark:bg-dark-muted dark:text-dark-foreground dark:placeholder:text-dark-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-dark-foreground/60" />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-black dark:text-dark-foreground hover:bg-primary/10 dark:hover:bg-dark-muted p-2"
              onClick={() => setIsAICopilotOpen(true)}
              aria-label="Abrir Asistente AI"
            >
              <Sparkle className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>

      <AICopilot 
        isOpen={isAICopilotOpen} 
        onClose={() => setIsAICopilotOpen(false)} 
      />
    </header>
  );
};

export default Header;