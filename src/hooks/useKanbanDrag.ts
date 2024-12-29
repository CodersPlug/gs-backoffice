import { useState } from "react";
import { DragStartEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, Pin } from "@/types/kanban";

export const useKanbanDrag = (initialColumns: Column[]) => {
  const [columns, setColumns] = useState(initialColumns);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activePinData, setActivePinData] = useState<Pin | null>(null);

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
    const overItemIndex = parseInt(String(over.id).split('-')[1]);

    if (activeColumnId === overColumnId) {
      // Same column drag
      setColumns(prevColumns => {
        const columnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
        const column = prevColumns[columnIndex];
        const items = arrayMove(column.items, activeItemIndex, overItemIndex);

        return prevColumns.map((col, index) =>
          index === columnIndex ? { ...col, items } : col
        );
      });
    } else {
      // Different column drag
      setColumns(prevColumns => {
        const sourceColumnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
        const destinationColumnIndex = prevColumns.findIndex(col => col.id === overColumnId);
        
        if (sourceColumnIndex === -1 || destinationColumnIndex === -1) return prevColumns;

        const newColumns = [...prevColumns];
        const sourceItems = [...newColumns[sourceColumnIndex].items];
        const [movedItem] = sourceItems.splice(activeItemIndex, 1);
        const destinationItems = [...newColumns[destinationColumnIndex].items];
        
        // Insert at the correct position
        const insertIndex = overItemIndex >= 0 ? overItemIndex : destinationItems.length;
        destinationItems.splice(insertIndex, 0, movedItem);

        newColumns[sourceColumnIndex] = {
          ...newColumns[sourceColumnIndex],
          items: sourceItems
        };
        newColumns[destinationColumnIndex] = {
          ...newColumns[destinationColumnIndex],
          items: destinationItems
        };

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