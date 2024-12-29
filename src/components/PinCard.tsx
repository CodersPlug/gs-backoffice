import { useState } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import PinCardContent from "./pin/PinCardContent";
import { PinCardFooter } from "./pin/PinCardFooter";
import PinCardDialog from "./pin/PinCardDialog";
import PinCardDragWrapper from "./pin/PinCardDragWrapper";

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

  return (
    <>
      <PinCardDragWrapper id={id}>
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
            image={image}
          />
          <PinCardFooter 
            onMaximize={() => setIsOpen(true)} 
            id={id.toString()}
          />
        </div>
      </PinCardDragWrapper>

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