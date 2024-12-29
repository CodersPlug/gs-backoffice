import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import PinCard from "./PinCard";
import { Column } from "@/types/kanban";

interface KanbanColumnProps {
  column: Column;
}

const KanbanColumn = ({ column }: KanbanColumnProps) => {
  return (
    <div className="flex-1 min-w-[300px] bg-dark-muted/50 rounded-lg p-4 transition-colors duration-200 hover:bg-dark-muted/60">
      <h2 className="text-lg font-semibold mb-4 text-dark-foreground">
        {column.title}
      </h2>
      <SortableContext
        items={column.items.map((_, index) => `${column.id}-${index}`)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {column.items.map((pin, index) => (
            <div
              key={`${column.id}-${index}`}
              className="animate-fade-in"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                display: 'block'
              }}
            >
              <PinCard {...pin} id={`${column.id}-${index}`} />
            </div>
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;