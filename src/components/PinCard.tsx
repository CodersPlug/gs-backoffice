import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import PinCardContent from "./pin/PinCardContent";
import PinDialogContent from "./pin/PinDialogContent";

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
    cursor: 'move',
    opacity: 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const handleDialogClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
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
        <PinCardContent title={title} description={description} />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <PinDialogContent 
          title={title} 
          description={description} 
          onClose={handleDialogClose}
        />
      </Dialog>
    </>
  );
};

export default PinCard;