import React from 'react';
import { Maximize2 } from 'lucide-react';

interface PinCardFooterProps {
  onOpenDialog: () => void;
}

const PinCardFooter = ({ onOpenDialog }: PinCardFooterProps) => {
  return (
    <div className="mt-4 pt-2 border-t border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-end">
        <button 
          className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDialog();
          }}
        >
          <Maximize2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
        </button>
      </div>
    </div>
  );
};

export default PinCardFooter;