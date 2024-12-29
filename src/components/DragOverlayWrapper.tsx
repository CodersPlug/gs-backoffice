import { DragOverlay } from "@dnd-kit/core";
import PinCard from "./PinCard";
import { Pin } from "@/types/kanban";
import { UniqueIdentifier } from "@dnd-kit/core";

interface DragOverlayWrapperProps {
  activeId: UniqueIdentifier | null;
  activePinData: Pin | null;
}

const DragOverlayWrapper = ({ activeId, activePinData }: DragOverlayWrapperProps) => {
  if (!activeId || !activePinData) return null;

  return (
    <DragOverlay>
      <div className="opacity-80 rotate-3 scale-105 transition-transform">
        <PinCard {...activePinData} id={activeId} />
      </div>
    </DragOverlay>
  );
};

export default DragOverlayWrapper;