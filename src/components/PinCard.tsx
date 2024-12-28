import { useState } from "react";
import { MessageCircle, FileText } from "lucide-react";

interface PinCardProps {
  image: string;
  title: string;
  description: string;
  author: string;
}

const PinCard = ({ image, title, description, author }: PinCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group relative w-full rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100 shadow-sm"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <div
        className={`relative w-full transition-transform duration-500 transform-gpu ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
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
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">By {author}</span>
              <div className="text-xs text-gray-400">Click to view details</div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 bg-white rounded-lg p-4 transform rotate-y-180 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 flex-grow">{description}</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">By {author}</span>
                <button className="p-2 rounded-full hover:bg-gray-50 transition-colors">
                  <MessageCircle className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinCard;