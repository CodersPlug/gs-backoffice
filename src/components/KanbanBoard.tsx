import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { useKanbanDrag } from "@/hooks/useKanbanDrag";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "./LoadingSpinner";

const KanbanBoard = () => {
  const { toast } = useToast();

  const { data: columns = [], isLoading } = useQuery({
    queryKey: ['kanban-columns'],
    queryFn: async () => {
      const { data: columnsData, error: columnsError } = await supabase
        .from('kanban_columns')
        .select('*')
        .order('order_index');

      if (columnsError) {
        toast({
          title: "Error loading columns",
          description: columnsError.message,
          variant: "destructive",
        });
        throw columnsError;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from('kanban_items')
        .select('*')
        .order('order_index');

      if (itemsError) {
        toast({
          title: "Error loading items",
          description: itemsError.message,
          variant: "destructive",
        });
        throw itemsError;
      }

      return columnsData.map(column => ({
        ...column,
        items: itemsData.filter(item => item.column_id === column.id) || []
      }));
    }
  });

  const {
    columns: managedColumns,
    activeId,
    activePinData,
    handleDragStart,
    handleDragEnd
  } = useKanbanDrag(columns);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 min-h-[calc(100vh-10rem)]">
        {managedColumns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
      <DragOverlayWrapper activeId={activeId} activePinData={activePinData} />
    </DndContext>
  );
};

export default KanbanBoard;