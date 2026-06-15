import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Complo from "./pages/Complo";
import ScoreDeCredito from "./pages/ScoreDeCredito";
import PodunkAnnies from "./pages/PodunkAnnies";
import DenisEnergiaSolar from "./pages/DenisEnergiaSolar";
import FamilyRealty from "./pages/family-realty";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/complo" element={<Complo />} />
          <Route path="/Score.de.credito.DCarvalho" element={<ScoreDeCredito />} />
          <Route path="/PodunkAnnies" element={<PodunkAnnies />} />
          <Route path="/denis-energia-solar" element={<DenisEnergiaSolar />} />
          <Route path="/family-realty" element={<FamilyRealty />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
