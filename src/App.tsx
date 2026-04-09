import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import ClientNew from "./pages/ClientNew";
import ClientDetail from "./pages/ClientDetail";
import ClientOverview from "./pages/ClientOverview";
import ClientBrand from "./pages/ClientBrand";
import ClientProjects from "./pages/ClientProjects";
import ClientAIContext from "./pages/ClientAIContext";
import Tasks from "./pages/Tasks";
import ContentCalendar from "./pages/ContentCalendar";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/new" element={<ClientNew />} />
            <Route path="/clients/:id" element={<ClientDetail />}>
              <Route index element={<ClientOverview />} />
              <Route path="brand" element={<ClientBrand />} />
              <Route path="projects" element={<ClientProjects />} />
              <Route path="ai-context" element={<ClientAIContext />} />
            </Route>
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/team" element={<Team />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
