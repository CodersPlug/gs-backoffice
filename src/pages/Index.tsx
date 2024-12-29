import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KanbanBoard from "@/components/KanbanBoard";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-dark-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-20 pb-8 overflow-x-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-foreground">Task Board</h1>
          <p className="text-dark-foreground/80 mt-2">Manage and track your tasks efficiently</p>
        </div>
        <KanbanBoard />
      </main>
      <Footer />
    </div>
  );
};

export default Index;