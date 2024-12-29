import { DragStartEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";
import { Column, Pin } from "@/types/kanban";
import { useKanbanState } from "./useKanbanState";

export const useKanbanDrag = (initialColumns: Column[]) => {
  const { columns, updateColumns } = useKanbanState(initialColumns);
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
    const activeItemIndex = parseInt(String(active.id).split('-')[1]);

    if (!String(over.id).includes('-')) {
      handleDropOnColumn(activeColumnId, activeItemIndex, String(over.id));
    } else {
      handleDropOnItem(activeColumnId, activeItemIndex, String(over.id));
    }

    setActiveId(null);
    setActivePinData(null);
  };

  const handleDropOnColumn = (sourceColumnId: string, sourceItemIndex: number, targetColumnId: string) => {
    const sourceColumn = columns.find(col => col.id === sourceColumnId);
    const targetColumn = columns.find(col => col.id === targetColumnId);
    
    if (sourceColumn && targetColumn) {
      const [movedItem] = sourceColumn.items.splice(sourceItemIndex, 1);
      const newColumns = columns.map(col => {
        if (col.id === sourceColumnId) {
          return { ...col, items: sourceColumn.items };
        }
        if (col.id === targetColumnId) {
          return { ...col, items: [...col.items, movedItem] };
        }
        return col;
      });
      updateColumns(newColumns);
    }
  };

  const handleDropOnItem = (sourceColumnId: string, sourceItemIndex: number, overId: string) => {
    const overColumnId = overId.split('-')[0];
    const overItemIndex = parseInt(overId.split('-')[1]);

    if (sourceColumnId === overColumnId) {
      // Same column drag
      const columnIndex = columns.findIndex(col => col.id === sourceColumnId);
      const column = columns[columnIndex];
      const items = arrayMove(column.items, sourceItemIndex, overItemIndex);
      
      const newColumns = columns.map((col, index) =>
        index === columnIndex ? { ...col, items } : col
      );
      updateColumns(newColumns);
    } else {
      // Different column drag
      const sourceColumnIndex = columns.findIndex(col => col.id === sourceColumnId);
      const targetColumnIndex = columns.findIndex(col => col.id === overColumnId);
      
      const newColumns = [...columns];
      const sourceItems = [...newColumns[sourceColumnIndex].items];
      const [movedItem] = sourceItems.splice(sourceItemIndex, 1);
      const targetItems = [...newColumns[targetColumnIndex].items];
      
      targetItems.splice(overItemIndex, 0, movedItem);
      
      newColumns[sourceColumnIndex] = {
        ...newColumns[sourceColumnIndex],
        items: sourceItems
      };
      newColumns[targetColumnIndex] = {
        ...newColumns[targetColumnIndex],
        items: targetItems
      };
      
      updateColumns(newColumns);
    }
  };

  return {
    columns,
    activeId,
    activePinData,
    handleDragStart,
    handleDragEnd
  };
};