import { useState, useEffect } from "react";
import { DragStartEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, Pin } from "@/types/kanban";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = 'kanban-board-state';

export const useKanbanDrag = (initialColumns: Column[]) => {
  const { toast } = useToast();
  // Load initial state from localStorage or use provided initialColumns
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : initialColumns;
  });
  
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activePinData, setActivePinData] = useState<Pin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load from Supabase
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
        // Fetch columns with their items
        const { data: columnsData, error: columnsError } = await supabase
          .from('kanban_columns')
          .select('*')
          .order('order_index');

        if (columnsError) throw columnsError;

        const { data: itemsData, error: itemsError } = await supabase
          .from('kanban_items')
          .select('*')
          .order('order_index');

        if (itemsError) throw itemsError;

        // Transform the data to match our Column type
        const transformedColumns = columnsData.map(column => ({
          id: column.id,
          title: column.title,
          items: itemsData
            .filter(item => item.column_id === column.id)
            .map(item => ({
              image: '', // Add default image if needed
              title: item.title,
              description: item.description || '',
              author: item.author || ''
            }))
        }));

        setColumns(transformedColumns);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transformedColumns));
      } catch (error) {
        console.error('Error loading from Supabase:', error);
        toast({
          title: "Error syncing with database",
          description: "Using locally stored data instead",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadFromSupabase();
  }, [toast]);

  // Save to localStorage and Supabase whenever columns change
  useEffect(() => {
    const syncToSupabase = async () => {
      try {
        // Save columns
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          await supabase
            .from('kanban_columns')
            .upsert({
              id: column.id,
              title: column.title,
              order_index: i
            });

          // Save items for this column
          for (let j = 0; j < column.items.length; j++) {
            const item = column.items[j];
            await supabase
              .from('kanban_items')
              .upsert({
                column_id: column.id,
                title: item.title,
                description: item.description,
                author: item.author,
                order_index: j
              });
          }
        }

        // Store in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
      } catch (error) {
        console.error('Error syncing to Supabase:', error);
        toast({
          title: "Error syncing with database",
          description: "Changes saved locally only",
          variant: "destructive"
        });
      }
    };

    if (!isLoading) {
      syncToSupabase();
    }
  }, [columns, isLoading, toast]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActivePinData(null);
      return;
    }

    const activeColumnId = String(active.id).split('-')[0];
    const overColumnId = String(over.id).split('-')[0];
    const activeItemIndex = parseInt(String(active.id).split('-')[1]);
    
    // Handle dropping on a column (empty column case)
    if (!String(over.id).includes('-')) {
      setColumns(prevColumns => {
        const sourceColumnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
        const destinationColumnIndex = prevColumns.findIndex(col => col.id === over.id);
        
        const newColumns = [...prevColumns];
        const sourceItems = [...newColumns[sourceColumnIndex].items];
        const [movedItem] = sourceItems.splice(activeItemIndex, 1);
        
        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          items: sourceItems
        };
        
        newColumns[destinationColumnIndex] = {
          ...newColumns[destinationColumnIndex],
          items: [...newColumns[destinationColumnIndex].items, movedItem]
        };

        return newColumns;
      });
    } else {
      // Handle dropping on an item
      const overItemIndex = parseInt(String(over.id).split('-')[1]);
      
      setColumns(prevColumns => {
        if (activeColumnId === overColumnId) {
          // Same column drag
          const columnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
          const column = prevColumns[columnIndex];
          const items = arrayMove(column.items, activeItemIndex, overItemIndex);

          return prevColumns.map((col, index) =>
            index === columnIndex ? { ...col, items } : col
          );
        } else {
          // Different column drag
          const sourceColumnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
          const destinationColumnIndex = prevColumns.findIndex(col => col.id === overColumnId);
          
          const newColumns = [...prevColumns];
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

          return newColumns;
        }
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
    handleDragEnd,
    isLoading
  };
};
