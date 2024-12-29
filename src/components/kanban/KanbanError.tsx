interface KanbanErrorProps {
  error: Error;
}

const KanbanError = ({ error }: KanbanErrorProps) => {
  return (
    <div className="flex justify-center items-center h-full">
      <p className="text-red-500">
        Error al cargar el tablero kanban. Por favor, intentá nuevamente más tarde.
      </p>
    </div>
  );
};

export default KanbanError;