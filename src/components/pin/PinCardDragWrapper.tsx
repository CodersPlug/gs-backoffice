import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import { ReactNode } from "react";

interface PinCardDragWrapperProps {
  id: UniqueIdentifier;
  children: ReactNode;
}

const PinCardDragWrapper = ({ id, children }: PinCardDragWrapperProps) => {
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
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative w-full rounded-lg overflow-hidden transform transition-all duration-200 
        ${isDragging ? 'shadow-lg scale-105 rotate-2' : 'hover:-translate-y-1'} 
        bg-white dark:bg-dark-background border border-gray-100 dark:border-dark-border shadow-sm`}
    >
      {children}
    </div>
  );
};

export default PinCardDragWrapper;