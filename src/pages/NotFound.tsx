
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-6">Página não encontrada</p>
        <p className="text-gray-500 mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Button asChild>
          <Link to="/">Voltar para o Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
