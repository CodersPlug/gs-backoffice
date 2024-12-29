import { useState, useEffect } from "react";
import { DragStartEvent, DragEndEvent, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column, Pin } from "@/types/kanban";

const STORAGE_KEY = 'kanban-board-state';

export const useKanbanDrag = (initialColumns: Column[]) => {
  // Load initial state from localStorage or use provided initialColumns
  const [columns, setColumns] = useState<Column[]>(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : initialColumns;
  });
  
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activePinData, setActivePinData] = useState<Pin | null>(null);

  // Save to localStorage whenever columns change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
  }, [columns]);

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
    handleDragEnd
  };
};