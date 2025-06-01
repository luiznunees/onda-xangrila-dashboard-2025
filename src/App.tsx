
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PreInscricoes from "./pages/PreInscricoes";
import Confirmados from "./pages/Confirmados";
import Surfistas from "./pages/Surfistas";
import Apoio from "./pages/Apoio";
import Marujos from "./pages/Marujos";
import Agenda from "./pages/Agenda";
import Cronograma from "./pages/Cronograma";
import Usuarios from "./pages/Usuarios";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pre-inscricoes" element={<PreInscricoes />} />
          <Route path="/confirmados" element={<Confirmados />} />
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
  </QueryClientProvider>
);

export default App;
