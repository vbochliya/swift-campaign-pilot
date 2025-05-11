
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./contexts/AuthContext";

// Layout
import AuthLayout from "./components/layouts/AuthLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import CampaignList from "./pages/campaigns/CampaignList";
import NewCampaign from "./pages/campaigns/NewCampaign";
import CampaignDetail from "./pages/campaigns/CampaignDetail";
import TemplateList from "./pages/templates/TemplateList";
import NewTemplate from "./pages/templates/NewTemplate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/campaigns" element={<CampaignList />} />
              <Route path="/campaigns/new" element={<NewCampaign />} />
              <Route path="/campaigns/:id" element={<CampaignDetail />} />
              <Route path="/templates" element={<TemplateList />} />
              <Route path="/templates/new" element={<NewTemplate />} />
              <Route path="/analytics" element={<Dashboard />} />
              <Route path="/settings" element={<Dashboard />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
