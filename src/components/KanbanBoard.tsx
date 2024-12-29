import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { useKanbanDrag } from "@/hooks/useKanbanDrag";

const initialPins = [
  {
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    title: "Proceso de Onboarding",
    description: "Guía paso a paso para el proceso de incorporación de nuevos empleados a la empresa.",
    author: "Sara Johnson"
  }
];

const initialColumns = [
  { id: 'blocked', title: 'Bloqueado', items: [initialPins[0]] },
  { id: 'todo', title: 'Para Hacer', items: [] },
  { id: 'doing', title: 'Haciendo', items: [] },
  { id: 'done', title: 'Hecho', items: [] }
];

const KanbanBoard = () => {
  const {
    columns,
    activeId,
    activePinData,
    handleDragStart,
    handleDragEnd
  } = useKanbanDrag(initialColumns);

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
