import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./components/home/HomePage";

export default function App() {
  return (
    <div className="dark min-h-screen bg-background">
      <Header />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-6 py-8">
          <HomePage />
        </div>
        <Footer />
      </main>
    </div>
  );
}
