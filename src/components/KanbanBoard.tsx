import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { useKanbanDrag } from "@/hooks/useKanbanDrag";
import { supabase } from "@/integrations/supabase/client";
import { Column } from "@/types/kanban";

const KanbanBoard = () => {
  const [initialColumns, setInitialColumns] = useState<Column[]>([
    { id: 'blocked', title: 'Bloqueado', items: [] },
    { id: 'todo', title: 'Para Hacer', items: [] },
    { id: 'doing', title: 'Haciendo', items: [] },
    { id: 'done', title: 'Hecho', items: [] }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: columns, error: columnsError } = await supabase
        .from('kanban_columns')
        .select('*')
        .order('order_index');

      if (columnsError) {
        console.error('Error fetching columns:', columnsError);
        return;
      }

      const { data: items, error: itemsError } = await supabase
        .from('kanban_items')
        .select('*')
        .order('order_index');

      if (itemsError) {
        console.error('Error fetching items:', itemsError);
        return;
      }

      const columnsWithItems = columns.map(column => ({
        id: column.id,
        title: column.title,
        items: items.filter(item => item.column_id === column.id).map(item => ({
          image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
          title: item.title,
          description: item.description,
          author: item.author
        }))
      }));

      setInitialColumns(columnsWithItems);
    };

    fetchData();
  }, []);

  const {
    columns,
    activeId,
    activePinData,
    handleDragStart,
    handleDragEnd
  } = useKanbanDrag(initialColumns);

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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 min-h-[calc(100vh-10rem)]">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
      <DragOverlayWrapper activeId={activeId} activePinData={activePinData} />
    </DndContext>
  );
};

export default KanbanBoard;