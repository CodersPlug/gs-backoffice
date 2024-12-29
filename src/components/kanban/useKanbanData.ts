import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Column } from "@/types/kanban";

export const useKanbanData = () => {
  return useQuery({
    queryKey: ['kanban'],
    queryFn: async () => {
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
        .eq('deleted', false)  // Only fetch non-deleted items
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
            // Use source_info directly since it contains the snapshot URL
            image: item.source_info || '',
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
    }
  });
};