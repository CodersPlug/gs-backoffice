import { DragOverlay } from "@dnd-kit/core";
import PinCard from "./PinCard";
import { DraggablePin } from "@/types/kanban";
import { UniqueIdentifier } from "@dnd-kit/core";

interface DragOverlayWrapperProps {
  activeId: UniqueIdentifier | null;
  activePinData: DraggablePin | null;
}

const DragOverlayWrapper = ({ activeId, activePinData }: DragOverlayWrapperProps) => {
  if (!activeId || !activePinData) return null;

  return (
    <DragOverlay>
      <div className="opacity-80 rotate-3 scale-105 transition-transform">
        <PinCard {...activePinData} />
      </div>
    </DragOverlay>
  );
};

export default DragOverlayWrapper;