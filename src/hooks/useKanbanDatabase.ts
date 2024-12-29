import { supabase } from "@/integrations/supabase/client";

export const useKanbanDatabase = () => {
  const updateItemPosition = async (itemId: string, columnId: string, orderIndex: number) => {
    const { error } = await supabase
      .from('kanban_items')
      .update({
        column_id: columnId,
        order_index: orderIndex
      })
      .eq('id', itemId);

    if (error) throw error;
  };

  const updateOrderIndices = async (columnId: string, items: { id: string }[]) => {
    for (let i = 0; i < items.length; i++) {
      const { error } = await supabase
        .from('kanban_items')
        .update({ order_index: i })
        .eq('id', items[i].id);

      if (error) {
        console.error('Error updating order index:', error);
      }
    }
  };

  return {
    updateItemPosition,
    updateOrderIndices
  };
};