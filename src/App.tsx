import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import NumerologyMap from "./pages/NumerologyMap";
import Chat from "./pages/Chat";
import History from "./pages/History";
import FavorableDates from "./pages/FavorableDates";
import WhatsApp from "./pages/WhatsApp";
import ProfilePage from "./pages/Profile";
import Compatibility from "./pages/Compatibility";
import BrandAnalyzer from "./pages/BrandAnalyzer";
import Pillars from "./pages/Pillars";
import AdvancedReport from "./pages/AdvancedReport";
import HouseAnalyzer from "./pages/HouseAnalyzer";
import Community from "./pages/Community";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<NumerologyMap />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/dates" element={<FavorableDates />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
          <Route path="/compatibility" element={<Compatibility />} />
          <Route path="/brand" element={<BrandAnalyzer />} />
          <Route path="/pillars" element={<Pillars />} />
          <Route path="/advanced-report" element={<AdvancedReport />} />
          <Route path="/house" element={<HouseAnalyzer />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
