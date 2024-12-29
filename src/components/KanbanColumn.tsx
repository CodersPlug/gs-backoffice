import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import PinCard from "./PinCard";
import { Column } from "@/types/kanban";
import { Separator } from "./ui/separator";

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-dark-foreground">
          {column.title}
        </h2>
        <span className="text-sm px-2 py-0.5 bg-dark-muted rounded text-dark-foreground">
          {column.items.length}
        </span>
      </div>
      
      <Separator className="mb-4 bg-dark-border/30" />
      
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