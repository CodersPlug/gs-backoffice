import { useState, useEffect } from "react";
import { DragStartEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, Pin } from "@/types/kanban";
import { supabase } from "@/integrations/supabase/client";

export const useKanbanDrag = (initialColumns: Column[]) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activePinData, setActivePinData] = useState<Pin | null>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

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

    let sourceColumnId: string | undefined;
    let destinationColumnId: string | undefined;
    let sourceIndex = -1;
    let destinationIndex = -1;

    // Find source column and index
    columns.forEach(column => {
      const itemIndex = column.items.findIndex(item => item.id === active.id);
      if (itemIndex !== -1) {
        sourceColumnId = column.id;
        sourceIndex = itemIndex;
      }
    });

    // Find destination column and index
    columns.forEach(column => {
      if (over.id === column.id) {
        // Dropped directly on a column
        destinationColumnId = column.id;
        destinationIndex = column.items.length;
      } else {
        // Dropped on an item
        const itemIndex = column.items.findIndex(item => item.id === over.id);
        if (itemIndex !== -1) {
          destinationColumnId = column.id;
          destinationIndex = itemIndex;
        }
      }
    });

    if (!sourceColumnId || !destinationColumnId || sourceIndex === -1) {
      setActiveId(null);
      setActivePinData(null);
      return;
    }

    // Optimistically update the UI first
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
      const destColumn = newColumns.find(col => col.id === destinationColumnId);

      if (!sourceColumn || !destColumn) return prevColumns;

      const [movedItem] = sourceColumn.items.splice(sourceIndex, 1);
      destColumn.items.splice(destinationIndex, 0, movedItem);

      return newColumns;
    });

    // Then update the database
    try {
      const { error: updateError } = await supabase
        .from('kanban_items')
        .update({
          column_id: destinationColumnId,
          order_index: destinationIndex
        })
        .eq('id', active.id);

      if (updateError) {
        console.error('Error updating item:', updateError);
        // Revert the optimistic update on error
        setColumns(initialColumns);
        return;
      }

      // Update order indices in the background
      const destColumn = columns.find(col => col.id === destinationColumnId);
      if (destColumn) {
        const updatedItems = [...destColumn.items];
        for (let i = 0; i < updatedItems.length; i++) {
          const { error: orderError } = await supabase
            .from('kanban_items')
            .update({ order_index: i })
            .eq('id', updatedItems[i].id);

          if (orderError) {
            console.error('Error updating order index:', orderError);
          }
        }
      }
    } catch (error) {
      console.error('Error in drag end handler:', error);
      // Revert the optimistic update on error
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