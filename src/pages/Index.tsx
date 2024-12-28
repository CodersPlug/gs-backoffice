import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PinCard from "@/components/PinCard";

const pins = [
  {
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    title: "Modern Workspace",
    description: "A minimalist workspace setup perfect for remote work and creativity.",
    author: "Sarah Johnson"
  },
  {
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    title: "Tech Essentials",
    description: "Essential tech gadgets for the modern professional.",
    author: "Mike Chen"
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    title: "Circuit Beauty",
    description: "The intricate beauty of modern technology captured in detail.",
    author: "Alex Turner"
  },
  {
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    title: "Productive Setup",
    description: "A clean and productive workspace arrangement for maximum focus.",
    author: "Emma White"
  },
  {
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    title: "Remote Work",
    description: "The perfect remote work environment for digital nomads.",
    author: "David Miller"
  },
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    title: "Code Life",
    description: "A developer's workspace showcasing the beauty of code.",
    author: "Chris Black"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pins.map((pin, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <PinCard {...pin} />
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;