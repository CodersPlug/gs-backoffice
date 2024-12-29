import { useState } from "react";
import { Column } from "@/types/kanban";

export const useKanbanState = (initialColumns: Column[]) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const updateColumns = (newColumns: Column[]) => {
    setColumns(newColumns);
  };

  return {
    columns,
    updateColumns,
  };
};