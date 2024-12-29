import { useState, useEffect } from "react";
import { DragStartEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, Pin } from "@/types/kanban";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useKanbanDrag = (initialColumns: Column[]) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activePinData, setActivePinData] = useState<Pin | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);

    const activeColumnId = String(active.id).split('-')[0];
    const activeItemIndex = parseInt(String(active.id).split('-')[1]);
    const activeColumn = columns.find(col => col.id === activeColumnId);
    if (activeColumn) {
      setActivePinData(activeColumn.items[activeItemIndex]);
    }
  };

  const updateItemInDatabase = async (item: Pin, newColumnId: string, newOrderIndex: number) => {
    const { error } = await supabase
      .from('kanban_items')
      .update({ 
        column_id: newColumnId,
        order_index: newOrderIndex
      })
      .eq('id', item.id);

    if (error) {
      toast({
        title: "Error updating item",
        description: error.message,
        variant: "destructive",
      });
      throw error;
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
    
    // Handle dropping on a column (empty column case)
    if (!String(over.id).includes('-')) {
      const destinationColumnId = String(over.id);
      const sourceColumn = columns.find(col => col.id === activeColumnId);
      const destinationColumn = columns.find(col => col.id === destinationColumnId);
      
      if (sourceColumn && destinationColumn) {
        const [movedItem] = sourceColumn.items.splice(activeItemIndex, 1);
        const newOrderIndex = destinationColumn.items.length;
        
        try {
          await updateItemInDatabase(movedItem, destinationColumnId, newOrderIndex);
          
          setColumns(prevColumns => {
            const newColumns = [...prevColumns];
            const sourceColumnIndex = newColumns.findIndex(col => col.id === activeColumnId);
            const destinationColumnIndex = newColumns.findIndex(col => col.id === destinationColumnId);
            
            newColumns[sourceColumnIndex] = {
              ...sourceColumn,
              items: sourceColumn.items
            };
            
            newColumns[destinationColumnIndex] = {
              ...destinationColumn,
              items: [...destinationColumn.items, movedItem]
            };
            
            return newColumns;
          });
        } catch (error) {
          console.error('Failed to update item:', error);
        }
      }
    } else {
      const overColumnId = String(over.id).split('-')[0];
      const overItemIndex = parseInt(String(over.id).split('-')[1]);
      
      try {
        if (activeColumnId === overColumnId) {
          // Same column drag
          const columnIndex = columns.findIndex(col => col.id === activeColumnId);
          const column = columns[columnIndex];
          const items = arrayMove(column.items, activeItemIndex, overItemIndex);
          
          // Update order indexes in database
          await Promise.all(items.map((item, index) => 
            updateItemInDatabase(item, activeColumnId, index)
          ));
          
          setColumns(prevColumns =>
            prevColumns.map((col, index) =>
              index === columnIndex ? { ...col, items } : col
            )
          );
        } else {
          // Different column drag
          const sourceColumnIndex = columns.findIndex(col => col.id === activeColumnId);
          const destinationColumnIndex = columns.findIndex(col => col.id === overColumnId);
          
          const newColumns = [...columns];
          const sourceItems = [...newColumns[sourceColumnIndex].items];
          const [movedItem] = sourceItems.splice(activeItemIndex, 1);
          const destinationItems = [...newColumns[destinationColumnIndex].items];
          
          destinationItems.splice(overItemIndex, 0, movedItem);
          
          // Update order indexes in database
          await Promise.all([
            ...sourceItems.map((item, index) => 
              updateItemInDatabase(item, activeColumnId, index)
            ),
            ...destinationItems.map((item, index) => 
              updateItemInDatabase(item, overColumnId, index)
            )
          ]);
          
          newColumns[sourceColumnIndex] = {
            ...newColumns[sourceColumnIndex],
            items: sourceItems
          };
          newColumns[destinationColumnIndex] = {
            ...newColumns[destinationColumnIndex],
            items: destinationItems
          };
          
          setColumns(newColumns);
        }
      } catch (error) {
        console.error('Failed to update items:', error);
      }
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