import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle } from "lucide-react";
import { Pin } from "@/types/kanban";

interface PinCardDialogProps extends Pin {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const PinCardDialog = ({ title, description, isOpen, setIsOpen }: PinCardDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] animate-in zoom-in-90 duration-700 ease-in-out dark:bg-dark-background">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-dark-foreground">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-dark-foreground/80">{description}</p>
            <div className="flex justify-end">
              <button 
                className="p-2 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
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