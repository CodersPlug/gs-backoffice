import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PinCardFooterProps {
  onOpenDialog: () => void;
}

const PinCardFooter = ({ onOpenDialog }: PinCardFooterProps) => {
  const [isEyeHovered, setIsEyeHovered] = useState(false);

  return (
    <div className="mt-4 pt-2 border-t border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-end">
        <button 
          className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDialog();
          }}
          onMouseEnter={() => setIsEyeHovered(true)}
          onMouseLeave={() => setIsEyeHovered(false)}
        >
          {isEyeHovered ? (
            <EyeOff className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
          ) : (
            <Eye className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PinCardFooter;