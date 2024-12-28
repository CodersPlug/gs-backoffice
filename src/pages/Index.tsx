import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PinCard from "@/components/PinCard";

const pins = [
  {
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    title: "Espacio de Trabajo Moderno",
    description: "Un espacio de trabajo minimalista perfecto para el trabajo remoto y la creatividad.",
    author: "Sara Johnson"
  },
  {
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    title: "Elementos Tecnológicos",
    description: "Gadgets tecnológicos esenciales para el profesional moderno.",
    author: "Miguel Chen"
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    title: "Belleza de Circuitos",
    description: "La belleza intrincada de la tecnología moderna capturada en detalle.",
    author: "Alejandro Turner"
  },
  {
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    title: "Configuración Productiva",
    description: "Una disposición limpia y productiva del espacio de trabajo para máxima concentración.",
    author: "Emma Blanco"
  },
  {
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    title: "Trabajo Remoto",
    description: "El ambiente perfecto para nómades digitales.",
    author: "David Molinari"
  },
  {
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    title: "Vida de Código",
    description: "El espacio de trabajo de un desarrollador mostrando la belleza del código.",
    author: "Carlos Negro"
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