import { DialogHeader as UIDialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DialogHeaderProps {
  title: string;
  icon?: string;
}

const DialogHeader = ({ title, icon }: DialogHeaderProps) => {
  return (
    <UIDialogHeader>
      <DialogTitle className="flex items-center gap-2 text-xl font-semibold dark:text-dark-foreground">
        {icon && <span className="text-gray-500">{icon}</span>}
        {title}
      </DialogTitle>
    </UIDialogHeader>
  );
};

export default DialogHeader;