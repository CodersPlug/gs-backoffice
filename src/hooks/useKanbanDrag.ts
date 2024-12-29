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
    if (initialColumns) {
      setColumns(initialColumns);
    }
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

    if (!over || !active) {
      setActiveId(null);
      setActivePinData(null);
      return;
    }

    const activeColumnId = String(active.id).split('-')[0];
    const activeItemIndex = parseInt(String(active.id).split('-')[1]);
    
    const sourceColumn = columns.find(col => col.id === activeColumnId);
    if (!sourceColumn || !sourceColumn.items[activeItemIndex]) {
      setActiveId(null);
      setActivePinData(null);
      return;
    }

    const movedItem = sourceColumn.items[activeItemIndex];

    try {
      // Handle dropping on a column (empty column case)
      if (!String(over.id).includes('-')) {
        const destinationColumnId = String(over.id);
        const destinationColumn = columns.find(col => col.id === destinationColumnId);
        
        if (destinationColumn) {
          // Update local state first
          setColumns(prevColumns => {
            const newColumns = [...prevColumns];
            const sourceColumnIndex = newColumns.findIndex(col => col.id === activeColumnId);
            const destinationColumnIndex = newColumns.findIndex(col => col.id === destinationColumnId);
            
            if (sourceColumnIndex !== -1 && destinationColumnIndex !== -1) {
              // Remove from source
              newColumns[sourceColumnIndex] = {
                ...sourceColumn,
                items: sourceColumn.items.filter((_, index) => index !== activeItemIndex)
              };
              
              // Add to destination
              newColumns[destinationColumnIndex] = {
                ...destinationColumn,
                items: [...destinationColumn.items, movedItem]
              };
            }
            
            return newColumns;
          });

          // Then sync with database
          const newOrderIndex = destinationColumn.items.length;
          await updateItemInDatabase(movedItem, destinationColumnId, newOrderIndex);
        }
      } else {
        const overColumnId = String(over.id).split('-')[0];
        const overItemIndex = parseInt(String(over.id).split('-')[1]);
        
        const destinationColumn = columns.find(col => col.id === overColumnId);
        if (!destinationColumn) {
          setActiveId(null);
          setActivePinData(null);
          return;
        }

        if (activeColumnId === overColumnId) {
          // Same column drag - Update local state first
          const items = arrayMove(sourceColumn.items, activeItemIndex, overItemIndex);
          setColumns(prevColumns =>
            prevColumns.map(col =>
              col.id === activeColumnId ? { ...col, items } : col
            )
          );
          
          // Then sync with database
          await Promise.all(items.map((item, index) => 
            updateItemInDatabase(item, activeColumnId, index)
          ));
        } else {
          // Different column drag - Update local state first
          setColumns(prevColumns => {
            const newColumns = [...prevColumns];
            const sourceColumnIndex = newColumns.findIndex(col => col.id === activeColumnId);
            const destinationColumnIndex = newColumns.findIndex(col => col.id === overColumnId);
            
            if (sourceColumnIndex !== -1 && destinationColumnIndex !== -1) {
              const newSourceItems = [...sourceColumn.items];
              newSourceItems.splice(activeItemIndex, 1);
              
              const newDestinationItems = [...destinationColumn.items];
              newDestinationItems.splice(overItemIndex, 0, movedItem);
              
              newColumns[sourceColumnIndex] = {
                ...sourceColumn,
                items: newSourceItems
              };
              
              newColumns[destinationColumnIndex] = {
                ...destinationColumn,
                items: newDestinationItems
              };
            }
            
            return newColumns;
          });
          
          // Then sync with database
          const newSourceItems = sourceColumn.items.filter((_, index) => index !== activeItemIndex);
          const newDestinationItems = [
            ...destinationColumn.items.slice(0, overItemIndex),
            movedItem,
            ...destinationColumn.items.slice(overItemIndex)
          ];
          
          await Promise.all([
            ...newSourceItems.map((item, index) => 
              updateItemInDatabase(item, activeColumnId, index)
            ),
            ...newDestinationItems.map((item, index) => 
              updateItemInDatabase(item, overColumnId, index)
            )
          ]);
        }
      }
    } catch (error) {
      console.error('Failed to update items:', error);
      toast({
        title: "Error",
        description: "Failed to update items positions",
        variant: "destructive",
      });
      
      // Revert to initial columns state on error
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