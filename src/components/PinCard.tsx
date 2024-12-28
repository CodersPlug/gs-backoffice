import { useState } from "react";
import { MessageCircle } from "lucide-react";

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
      className="group relative w-full rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
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
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium truncate">{title}</span>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 bg-white rounded-lg p-4 transform rotate-y-180 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 flex-grow">{description}</p>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">By {author}</span>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <MessageCircle className="h-4 w-4 text-gray-600" />
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