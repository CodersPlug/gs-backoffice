export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
};