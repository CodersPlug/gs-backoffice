import { useState, useEffect } from "react";
import { Column } from "@/types/kanban";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = 'kanban-board-state';

export const useKanbanSync = (initialColumns: Column[]) => {
  const { toast } = useToast();
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : initialColumns;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data from Supabase
  useEffect(() => {
    const loadFromSupabase = async () => {
      try {
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

        if (!columnsData) {
          setColumns(initialColumns);
          return;
        }

        const transformedColumns = columnsData.map(column => ({
          id: column.id,
          title: column.title,
          items: itemsData
            ?.filter(item => item?.column_id === column.id)
            .map(item => ({
              image: '',
              title: item.title,
              description: item.description || '',
              author: item.author || ''
            })) || []
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
        setColumns(initialColumns);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromSupabase();
  }, [initialColumns, toast]);

  // Sync to Supabase when columns change
  useEffect(() => {
    const syncToSupabase = async () => {
      if (isLoading) return;

      try {
        for (let i = 0; i < columns.length; i++) {
          const column = columns[i];
          if (!column) continue;

          await supabase
            .from('kanban_columns')
            .upsert({
              id: column.id,
              title: column.title,
              order_index: i
            });

          for (let j = 0; j < (column.items?.length || 0); j++) {
            const item = column.items[j];
            if (!item) continue;

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

    syncToSupabase();
  }, [columns, isLoading, toast]);

  return { columns, setColumns, isLoading };
};