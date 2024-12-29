import { useState } from "react";
import { DragStartEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, Pin } from "@/types/kanban";

export const useKanbanDrag = (initialColumns: Column[]) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
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
    
    // Handle dropping on a column (empty column case)
    if (!String(over.id).includes('-')) {
      const destinationColumnId = String(over.id);
      const sourceColumn = columns.find(col => col.id === activeColumnId);
      const destinationColumn = columns.find(col => col.id === destinationColumnId);
      
      if (sourceColumn && destinationColumn) {
        const [movedItem] = sourceColumn.items.splice(activeItemIndex, 1);
        
        setColumns(prevColumns => {
          const newColumns = [...prevColumns];
          const sourceColumnIndex = newColumns.findIndex(col => col.id === activeColumnId);
          const destinationColumnIndex = newColumns.findIndex(col => col.id === destinationColumnId);
          
          newColumns[sourceColumnIndex] = {
            ...sourceColumn,
            items: sourceColumn.items
          };
          
          newColumns[destinationColumnIndex] = {
            ...destinationColumn,
            items: [...destinationColumn.items, movedItem]
          };
          
          return newColumns;
        });
      }
    } else {
      const overColumnId = String(over.id).split('-')[0];
      const overItemIndex = parseInt(String(over.id).split('-')[1]);
      
      if (activeColumnId === overColumnId) {
        // Same column drag
        const columnIndex = columns.findIndex(col => col.id === activeColumnId);
        const column = columns[columnIndex];
        const items = arrayMove(column.items, activeItemIndex, overItemIndex);
        
        setColumns(prevColumns =>
          prevColumns.map((col, index) =>
            index === columnIndex ? { ...col, items } : col
          )
        );
      } else {
        // Different column drag
        const sourceColumnIndex = columns.findIndex(col => col.id === activeColumnId);
        const destinationColumnIndex = columns.findIndex(col => col.id === overColumnId);
        
        const newColumns = [...columns];
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
        
        setColumns(newColumns);
      }
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