interface TitleSectionProps {
  icon?: string;
  title: string;
  id: string;
}

const TitleSection = ({ icon, title, id }: TitleSectionProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1">
        {icon && <span className="text-gray-500">{icon}</span>}
        <h3 className="font-medium text-gray-900 dark:text-dark-foreground line-clamp-1">
          {title}
        </h3>
      </div>
      <span className="text-xs font-mono bg-gray-100 dark:bg-dark-muted px-2 py-0.5 rounded text-gray-600 dark:text-dark-foreground/70">
        #{id.slice(0, 8)}
      </span>
    </div>
  );
};

export default TitleSection;