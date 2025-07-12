import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import WhatsAppParser from "@/pages/whatsapp-parser";
import DocumentUpload from "@/pages/document-upload";
import Suppliers from "@/pages/suppliers";
import ManualEntry from "@/pages/manual-entry";
import DemoParser from "@/pages/demo-parser";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/whatsapp-parser" component={WhatsAppParser} />
          <Route path="/document-upload" component={DocumentUpload} />
          <Route path="/suppliers" component={Suppliers} />
          <Route path="/manual-entry" component={ManualEntry} />
          <Route path="/demo-parser" component={DemoParser} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
