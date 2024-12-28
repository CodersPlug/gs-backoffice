import { useState } from "react";
import { MessageCircle, FileText, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PinCardProps {
  image: string;
  title: string;
  description: string;
  author: string;
}

const PinCard = ({ image, title, description }: PinCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="group relative w-full rounded-lg overflow-hidden cursor-pointer transform transition-all duration-500 hover:-translate-y-1 bg-white border border-gray-100 shadow-sm"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative p-4">
          <div className="flex items-start space-x-3 mb-3">
            <div className="p-2 bg-gray-50 rounded-lg">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-end">
              <Eye className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] animate-in zoom-in-90 duration-700 ease-in-out">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="space-y-4">
              <p className="text-gray-600">{description}</p>
              <div className="flex justify-end">
                <button 
                  className="p-2 rounded-full hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                >
                  <MessageCircle className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PinCard;