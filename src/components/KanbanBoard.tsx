import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { Column, Pin } from "@/types/kanban";

const initialPins = [
  {
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    title: "Proceso de Onboarding",
    description: "Guía paso a paso para el proceso de incorporación de nuevos empleados a la empresa.",
    author: "Sara Johnson"
  },
  {
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    title: "Política de Vacaciones",
    description: "Documento detallado sobre las políticas y procedimientos para solicitud de vacaciones.",
    author: "Miguel Chen"
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    title: "Manual de Marca",
    description: "Guía completa sobre el uso correcto de la marca, logotipos y elementos visuales.",
    author: "Alejandro Turner"
  },
  {
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    title: "Protocolo de Seguridad",
    description: "Procedimientos y normas de seguridad para todas las instalaciones de la empresa.",
    author: "Emma Blanco"
  },
  {
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    title: "Proceso de Ventas",
    description: "Documentación detallada del proceso de ventas y atención al cliente.",
    author: "David Molinari"
  },
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    title: "Manual de Sistemas",
    description: "Guía técnica para el uso y mantenimiento de los sistemas internos.",
    author: "Carlos Negro"
  }
];

const initialColumns = [
  { id: 'blocked', title: 'Bloqueado', items: initialPins.slice(0, 1) },
  { id: 'todo', title: 'Para Hacer', items: initialPins.slice(1, 3) },
  { id: 'doing', title: 'Haciendo', items: initialPins.slice(3, 4) },
  { id: 'done', title: 'Hecho', items: initialPins.slice(4) }
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activePinData, setActivePinData] = useState<Pin | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
            const newItems = [...overColumn.items];
            newItems.splice(overItemIndex >= 0 ? overItemIndex : newItems.length, 0, item);
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

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 min-h-[calc(100vh-10rem)]">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>
      <DragOverlayWrapper activeId={activeId} activePinData={activePinData} />
    </DndContext>
  );
};

export default KanbanBoard;