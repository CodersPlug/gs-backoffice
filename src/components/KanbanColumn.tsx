import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import PinCard from "./PinCard";
import { Column } from "@/types/kanban";

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn = ({ column }: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column.id
  });

  return (
    <div 
      ref={setNodeRef}
      className="flex-1 min-w-[300px] bg-dark-muted/50 rounded-lg p-4 transition-colors duration-200 hover:bg-dark-muted/60"
    >
      <h2 className="text-lg font-semibold mb-4 text-dark-foreground">
        {column.title}
      </h2>
      <SortableContext
        items={column.items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {column.items.map((pin) => (
            <PinCard 
              key={pin.id}
              {...pin} 
              id={pin.id}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;