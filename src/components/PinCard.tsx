import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { UniqueIdentifier } from "@dnd-kit/core";
import PinCardContent from "./pin/PinCardContent";
import PinCardFooter from "./pin/PinCardFooter";
import PinCardDialog from "./pin/PinCardDialog";

interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

interface PinCardProps {
  id: UniqueIdentifier;
  image: string;
  title: string;
  description: string;
  author: string;
  icon?: string;
  content?: string;
  tags?: string[];
  dueDate?: string;
  assignedTo?: string;
  progress?: number;
  sourceInfo?: string;
  comments?: Comment[];
}

const PinCard = ({ 
  id,
  image,
  title, 
  description,
  icon,
  content,
  tags,
  dueDate,
  assignedTo,
  progress,
  sourceInfo,
  comments
}: PinCardProps) => {
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
      >
        <div className="relative p-4 pb-2">
          <PinCardContent 
            title={title}
            description={description}
            icon={icon}
            content={content}
            tags={tags}
            dueDate={dueDate}
            assignedTo={assignedTo}
            progress={progress}
            sourceInfo={sourceInfo}
          />
          <PinCardFooter onOpenDialog={() => setIsOpen(true)} />
        </div>
      </div>

      <PinCardDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={title}
        description={description}
        icon={icon}
        content={content}
        tags={tags}
        dueDate={dueDate}
        assignedTo={assignedTo}
        progress={progress}
        sourceInfo={sourceInfo}
        comments={comments}
      />
    </>
  );
};

export default PinCard;