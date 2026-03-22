import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import NumerologyMap from "./pages/NumerologyMap";
import Chat from "./pages/Chat";
import History from "./pages/History";
import FavorableDates from "./pages/FavorableDates";

import ProfilePage from "./pages/Profile";
import Compatibility from "./pages/Compatibility";
import BrandAnalyzer from "./pages/BrandAnalyzer";
import Pillars from "./pages/Pillars";
import AdvancedReport from "./pages/AdvancedReport";
import HouseAnalyzer from "./pages/HouseAnalyzer";
import Community from "./pages/Community";
import Pricing from "./pages/Pricing";
import PersonalYear from "./pages/PersonalYear";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SubscriptionProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/map" element={<ProtectedRoute route="/map"><NumerologyMap /></ProtectedRoute>} />
            <Route path="/personal-year" element={<ProtectedRoute route="/map"><PersonalYear /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute route="/chat"><Chat /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute route="/history"><History /></ProtectedRoute>} />
            <Route path="/dates" element={<ProtectedRoute route="/dates"><FavorableDates /></ProtectedRoute>} />
            <Route path="/whatsapp" element={<WhatsApp />} />
            <Route path="/compatibility" element={<ProtectedRoute route="/compatibility"><Compatibility /></ProtectedRoute>} />
            <Route path="/brand" element={<ProtectedRoute route="/brand"><BrandAnalyzer /></ProtectedRoute>} />
            <Route path="/pillars" element={<ProtectedRoute route="/pillars"><Pillars /></ProtectedRoute>} />
            <Route path="/advanced-report" element={<ProtectedRoute route="/advanced-report"><AdvancedReport /></ProtectedRoute>} />
            <Route path="/house" element={<ProtectedRoute route="/house"><HouseAnalyzer /></ProtectedRoute>} />
            <Route path="/community" element={<Community />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SubscriptionProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
