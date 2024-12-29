interface TitleSectionProps {
  icon?: string;
  title: string;
}

const TitleSection = ({ icon, title }: TitleSectionProps) => {
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      <h3 className="font-medium text-gray-900 dark:text-dark-foreground line-clamp-1">
        {title}
      </h3>
    </div>
  );
};

export default TitleSection;