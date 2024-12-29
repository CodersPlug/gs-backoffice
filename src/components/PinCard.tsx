import { useState } from "react";
import { MessageCircle, FileText, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";

interface PinCardProps {
  image: string;
  title: string;
  description: string;
  author: string;
  id: UniqueIdentifier;
}

const PinCard = ({ image, title, description, id }: PinCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    cursor: 'move',
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group relative w-full rounded-lg overflow-hidden transform transition-all duration-200 
          ${isDragging ? 'shadow-lg scale-105 rotate-2' : 'hover:-translate-y-1'} 
          bg-white dark:bg-dark-background border border-gray-100 dark:border-dark-border shadow-sm`}
        onClick={(e) => {
          if (!isDragging) {
            setIsOpen(true);
          }
        }}
      >
        <div className="relative p-4">
          <div className="flex items-start space-x-3 mb-3">
            <div className="p-2 bg-gray-50 dark:bg-dark-muted rounded-lg">
              <FileText className="h-5 w-5 text-gray-600 dark:text-dark-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-dark-foreground mb-1 line-clamp-1">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-dark-foreground/80 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-dark-border">
            <div className="flex items-center justify-end">
              <Eye className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
};

export default PinCard;