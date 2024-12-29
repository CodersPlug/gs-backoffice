import React from 'react';
import { Maximize2, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PinCardFooterProps {
  onOpenDialog: () => void;
  id: string;
}

const PinCardFooter = ({ onOpenDialog, id }: PinCardFooterProps) => {
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase
        .from('kanban_items')
        .update({ deleted: true })
        .eq('id', id);

      if (error) throw error;
      
      toast.success("Card deleted successfully");
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error("Failed to delete card");
    }
  };

  return (
    <div className="mt-4 pt-2 border-t border-gray-100 dark:border-dark-border">
      <div className="flex items-center justify-between">
        <button 
          className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
        </button>
        <button 
          className="p-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-dark-muted transition-colors cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDialog();
          }}
        >
          <Maximize2 className="h-4 w-4 text-gray-400 dark:text-dark-foreground/60" />
        </button>
      </div>
    </div>
  );
};

export default PinCardFooter;