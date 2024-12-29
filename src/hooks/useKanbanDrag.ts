import { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useKanbanDragState } from "./useKanbanDragState";
import { useKanbanDatabase } from "./useKanbanDatabase";
import { Column } from "@/types/kanban";

export const useKanbanDrag = (initialColumns: Column[]) => {
  const {
    columns,
    setColumns,
    activeId,
    setActiveId,
    activePinData,
    setActivePinData,
    findColumnAndIndex,
    updateColumnsOptimistically
  } = useKanbanDragState(initialColumns);

  const { updateItemPosition, updateOrderIndices } = useKanbanDatabase();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);

    for (const column of columns) {
      const activeItem = column.items.find(item => item.id === active.id);
      if (activeItem) {
        setActivePinData(activeItem);
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActivePinData(null);
      return;
    }

    const sourceLocation = findColumnAndIndex(active.id);
    let destinationColumnId: string;
    let destinationIndex: number;

    // Determine drop target (column or item)
    const isColumn = columns.some(col => col.id === over.id);
    if (isColumn) {
      destinationColumnId = over.id as string;
      const destColumn = columns.find(col => col.id === destinationColumnId);
      destinationIndex = destColumn?.items.length || 0;
    } else {
      const destLocation = findColumnAndIndex(over.id);
      if (!destLocation) {
        setActiveId(null);
        setActivePinData(null);
        return;
      }
      destinationColumnId = destLocation.columnId;
      destinationIndex = destLocation.index;
    }

    if (!sourceLocation) {
      setActiveId(null);
      setActivePinData(null);
      return;
    }

    // Optimistically update UI
    updateColumnsOptimistically(
      sourceLocation.columnId,
      sourceLocation.index,
      destinationColumnId,
      destinationIndex
    );

    // Update database
    try {
      await updateItemPosition(active.id.toString(), destinationColumnId, destinationIndex);
      
      // Update order indices in the background
      const destColumn = columns.find(col => col.id === destinationColumnId);
      if (destColumn) {
        await updateOrderIndices(destinationColumnId, destColumn.items);
      }
    } catch (error) {
      console.error('Error in drag end handler:', error);
      // Revert optimistic update on error
      setColumns(initialColumns);
    }

    setActiveId(null);
    setActivePinData(null);
  };

  return {
    columns,
    activeId,
    activePinData,
    handleDragStart,
    handleDragEnd
  };
};