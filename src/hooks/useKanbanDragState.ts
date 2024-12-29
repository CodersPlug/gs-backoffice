import { useState, useEffect } from "react";
import { Column, Pin } from "@/types/kanban";
import { UniqueIdentifier } from "@dnd-kit/core";

export const useKanbanDragState = (initialColumns: Column[]) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activePinData, setActivePinData] = useState<Pin | null>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const findColumnAndIndex = (itemId: UniqueIdentifier) => {
    for (const column of columns) {
      const itemIndex = column.items.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        return { columnId: column.id, index: itemIndex };
      }
    }
    return null;
  };

  const updateColumnsOptimistically = (
    sourceColumnId: string,
    sourceIndex: number,
    destinationColumnId: string,
    destinationIndex: number
  ) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
      const destColumn = newColumns.find(col => col.id === destinationColumnId);

      if (!sourceColumn || !destColumn) return prevColumns;

      const [movedItem] = sourceColumn.items.splice(sourceIndex, 1);
      destColumn.items.splice(destinationIndex, 0, movedItem);

      return newColumns;
    });
  };

  return {
    columns,
    setColumns,
    activeId,
    setActiveId,
    activePinData,
    setActivePinData,
    findColumnAndIndex,
    updateColumnsOptimistically
  };
};