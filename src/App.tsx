
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PreInscricoes from "./pages/PreInscricoes";
import Surfistas from "./pages/Surfistas";
import Apoio from "./pages/Apoio";
import Marujos from "./pages/Marujos";
import Agenda from "./pages/Agenda";
import Cronograma from "./pages/Cronograma";
import Usuarios from "./pages/Usuarios";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/pre-inscricoes" element={<PreInscricoes />} />
            <Route path="/surfistas" element={<Surfistas />} />
            <Route path="/apoio" element={<Apoio />} />
            <Route path="/marujos" element={<Marujos />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/cronograma" element={<Cronograma />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
