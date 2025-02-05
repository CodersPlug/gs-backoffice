interface TitleSectionProps {
  icon?: string;
  title: string;
  id: string;
}

const TitleSection = ({ icon, title, id }: TitleSectionProps) => {
  // Format the ID to show three letters and three numbers
  const formatId = (id: string) => {
    // Generate a consistent 3-letter prefix based on the first 3 characters of the hash
    const letters = id
      .slice(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, 'X');
    
    // Generate 3 numbers based on the next 3 characters of the hash
    const numbers = id
      .slice(3, 6)
      .replace(/[^0-9]/g, '0')
      .padEnd(3, '0');

    return `${letters} ${numbers}`;
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h3 className="font-medium text-gray-900 dark:text-dark-foreground line-clamp-1">
          {title}
        </h3>
      </div>
      <span className="text-xs font-mono bg-gray-100 dark:bg-dark-muted px-2 py-0.5 rounded text-gray-600 dark:text-dark-foreground/70">
        {formatId(id)}
      </span>
    </div>
  );
};

export default TitleSection;