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

    if (activeColumnId !== overColumnId) {
      setColumns(prevColumns => {
        const activeColumn = prevColumns.find(col => col.id === activeColumnId);
        const overColumn = prevColumns.find(col => col.id === overColumnId);

        if (!activeColumn || !overColumn) return prevColumns;

        const activeItemIndex = parseInt(String(active.id).split('-')[1]);
        const overItemIndex = parseInt(String(over.id).split('-')[1]);
        const item = activeColumn.items[activeItemIndex];

        return prevColumns.map(col => {
          if (col.id === activeColumnId) {
            return {
              ...col,
              items: col.items.filter((_, index) => index !== activeItemIndex)
            };
          }
          if (col.id === overColumnId) {
            const newItems = [...col.items];
            if (overItemIndex >= 0) {
              newItems.splice(overItemIndex, 0, item);
            } else {
              newItems.push(item);
            }
            return {
              ...col,
              items: newItems
            };
          }
          return col;
        });
      });
    } else {
      const columnIndex = columns.findIndex(col => col.id === activeColumnId);
      const itemIndex = parseInt(String(active.id).split('-')[1]);
      const overItemIndex = parseInt(String(over.id).split('-')[1]);

      setColumns(prevColumns => {
        const column = prevColumns[columnIndex];
        const items = arrayMove(column.items, itemIndex, overItemIndex);

        return prevColumns.map((col, index) =>
          index === columnIndex ? { ...col, items } : col
        );
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