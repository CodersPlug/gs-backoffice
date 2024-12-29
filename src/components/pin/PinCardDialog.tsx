import React from 'react';
import { MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PinCardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}

const PinCardDialog = ({ isOpen, onOpenChange, title, description }: PinCardDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] animate-in zoom-in-90 duration-700 ease-in-out dark:bg-dark-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-dark-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-dark-foreground/80">
              {description}
            </p>
            <div className="flex justify-end">
              <button 
                className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenChange(false);
                }}
              >
                <MessageCircle className="h-4 w-4 text-gray-500 dark:text-dark-foreground/60" />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PinCardDialog;