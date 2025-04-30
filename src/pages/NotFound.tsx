
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-50/50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-ocean-600 mb-4">404</h1>
        <div className="mb-6 relative">
          <img 
            src="/placeholder.svg" 
            alt="Surfista" 
            className="w-32 h-32 mx-auto opacity-30"
          />
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-ocean-300/20 to-ocean-500/20 rounded-full blur-md"></div>
        </div>
        <p className="text-xl text-ocean-900 mb-4">Oops! Essa onda não existe</p>
        <p className="text-gray-600 mb-8">Parece que você pegou a onda errada. Vamos voltar para o line-up?</p>
        <Link to="/">
          <Button className="bg-ocean-600 hover:bg-ocean-700">
            Voltar ao Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
