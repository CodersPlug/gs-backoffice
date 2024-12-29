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

    // Find the active item in all columns
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

    // Find the source and destination columns
    let sourceColumn: Column | undefined;
    let destinationColumn: Column | undefined;
    let activeItemIndex = -1;
    let overItemIndex = -1;

    // Find source column and item index
    for (const column of columns) {
      const itemIndex = column.items.findIndex(item => item.id === active.id);
      if (itemIndex !== -1) {
        sourceColumn = column;
        activeItemIndex = itemIndex;
        break;
      }
    }

    // Find destination column and item index
    for (const column of columns) {
      if (over.id === column.id) {
        // Dropped directly on a column
        destinationColumn = column;
        overItemIndex = column.items.length;
      } else {
        // Dropped on an item
        const itemIndex = column.items.findIndex(item => item.id === over.id);
        if (itemIndex !== -1) {
          destinationColumn = column;
          overItemIndex = itemIndex;
          break;
        }
      }
    }

    if (!sourceColumn || !destinationColumn || activeItemIndex === -1) {
      setActiveId(null);
      setActivePinData(null);
      return;
    }

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const sourceColumnIndex = newColumns.findIndex(col => col.id === sourceColumn!.id);
      const destinationColumnIndex = newColumns.findIndex(col => col.id === destinationColumn!.id);
      
      const sourceItems = [...newColumns[sourceColumnIndex].items];
      const [movedItem] = sourceItems.splice(activeItemIndex, 1);
      
      const destinationItems = [...newColumns[destinationColumnIndex].items];
      destinationItems.splice(overItemIndex, 0, movedItem);

      newColumns[sourceColumnIndex] = {
        ...newColumns[sourceColumnIndex],
        items: sourceItems
      };
      
      newColumns[destinationColumnIndex] = {
        ...newColumns[destinationColumnIndex],
        items: destinationItems
      };

      // Update the database
      supabase
        .from('kanban_items')
        .update({
          column_id: destinationColumn!.id,
          order_index: overItemIndex
        })
        .eq('id', movedItem.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error updating item:', error);
          }
        });

      return newColumns;
    });

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