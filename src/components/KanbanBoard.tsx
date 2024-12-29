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
import { supabase } from "@/integrations/supabase/client";
import { Column } from "@/types/kanban";
import { useQuery } from "@tanstack/react-query";

const KanbanBoard = () => {
  const fetchData = async () => {
    console.log("Fetching kanban data...");
    
    let { data: columns, error: columnsError } = await supabase
      .from('kanban_columns')
      .select('*')
      .order('order_index');

    if (columnsError) {
      console.error('Error fetching columns:', columnsError);
      throw columnsError;
    }

    if (!columns || columns.length === 0) {
      const defaultColumns = [
        { title: 'Bloqueado', order_index: 0 },
        { title: 'Para Hacer', order_index: 1 },
        { title: 'Haciendo', order_index: 2 },
        { title: 'Hecho', order_index: 3 }
      ];

      for (const column of defaultColumns) {
        await supabase
          .from('kanban_columns')
          .insert(column);
      }

      const { data: newColumns, error: newColumnsError } = await supabase
        .from('kanban_columns')
        .select('*')
        .order('order_index');

      if (newColumnsError) throw newColumnsError;
      columns = newColumns;
    }

    const { data: items, error: itemsError } = await supabase
      .from('kanban_items')
      .select('*')
      .order('order_index');

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
      throw itemsError;
    }

    console.log("Fetched columns:", columns);
    console.log("Fetched items:", items);

    const columnsWithItems = columns.map(column => ({
      id: column.id,
      title: column.title,
      items: items
        .filter(item => item.column_id === column.id)
        .map(item => ({
          id: item.id,
          image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
          title: item.title,
          description: item.description || '',
          author: item.author || '',
          icon: item.icon,
          content: item.content,
          tags: item.tags,
          dueDate: item.due_date,
          assignedTo: item.assigned_to,
          progress: item.progress,
          sourceInfo: item.source_info,
          comments: item.comments || []
        }))
    }));

    console.log("Processed columns with items:", columnsWithItems);
    return columnsWithItems;
  };

  const { data: columns = [], isLoading, error } = useQuery({
    queryKey: ['kanban'],
    queryFn: fetchData
  });

  const {
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
    return <div className="flex justify-center items-center h-full">
      <p className="text-dark-foreground">Loading kanban board...</p>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-full">
      <p className="text-red-500">Error loading kanban board. Please try again later.</p>
    </div>;
  }

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