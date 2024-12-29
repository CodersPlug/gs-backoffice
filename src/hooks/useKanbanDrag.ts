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

    const activeColumnId = String(active.id).split('-')[0];
    const activeItemIndex = parseInt(String(active.id).split('-')[1]);
    const activeColumn = columns.find(col => col.id === activeColumnId);
    
    if (activeColumn && activeColumn.items[activeItemIndex]) {
      setActivePinData(activeColumn.items[activeItemIndex]);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActivePinData(null);
      return;
    }

    const activeColumnId = String(active.id).split('-')[0];
    const activeItemIndex = parseInt(String(active.id).split('-')[1]);
    
    // Handle dropping on a column or item
    const overColumnId = String(over.id).includes('-') 
      ? String(over.id).split('-')[0]
      : String(over.id);
    
    const overItemIndex = String(over.id).includes('-')
      ? parseInt(String(over.id).split('-')[1])
      : -1;

    if (activeColumnId !== overColumnId || activeItemIndex !== overItemIndex) {
      setColumns(prevColumns => {
        const sourceColumnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
        const destinationColumnIndex = prevColumns.findIndex(col => col.id === overColumnId);
        
        if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return prevColumns;

        const newColumns = [...prevColumns];
        const sourceItems = [...newColumns[sourceColumnIndex].items];
        const [movedItem] = sourceItems.splice(activeItemIndex, 1);
        
        if (!movedItem) return prevColumns;

        const destinationItems = [...newColumns[destinationColumnIndex].items];
        
        if (overItemIndex === -1) {
          // Dropped directly on a column
          destinationItems.push(movedItem);
        } else {
          // Dropped on an item
          destinationItems.splice(overItemIndex, 0, movedItem);
        }

        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          items: sourceItems
        };
        
        newColumns[destinationColumnIndex] = {
          ...newColumns[destinationColumnIndex],
          items: destinationItems
        };

        // Update the database
        const itemId = active.id.toString().split('-')[2];
        if (itemId) {
          supabase
            .from('kanban_items')
            .update({
              column_id: overColumnId,
              order_index: overItemIndex === -1 ? destinationItems.length - 1 : overItemIndex
            })
            .eq('id', itemId)
            .then(({ error }) => {
              if (error) {
                console.error('Error updating item:', error);
              }
            });
        }

        return newColumns;
      });
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