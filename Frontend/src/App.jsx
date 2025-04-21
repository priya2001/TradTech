import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "../src/lib/context";

import Index from "./pages/Index";
import Customer from "./pages/Customer";
import Shopkeeper from "./pages/Shopkeeper";
import Admin from "./pages/Admin";
import Machine from "./pages/Machine";
import NotFound from "./pages/NotFound";
import EditProfile from './pages/EditProfile';
import ChangePassword from "./pages/ChangePassword";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/shopkeeper" element={<Shopkeeper />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/machine/:shopId" element={<Machine />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/profile/change-password" element={<ChangePassword />} />
            <Route path="*" element={<NotFound />} />
            

          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
