interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  if (!progress) return null;

  return (
    <div className="w-full bg-gray-200 dark:bg-dark-muted rounded-full h-1.5">
      <div 
        className="bg-dark-accent h-1.5 rounded-full" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;