import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Recordings from "@/pages/recordings";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { FileAudio, Camera } from "lucide-react";

function Navigation() {
  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 flex justify-around">
      <Link href="/">
        <a className="flex flex-col items-center text-muted-foreground hover:text-primary">
          <Camera className="h-6 w-6" />
          <span className="text-sm">New</span>
        </a>
      </Link>
      <Link href="/recordings">
        <a className="flex flex-col items-center text-muted-foreground hover:text-primary">
          <FileAudio className="h-6 w-6" />
          <span className="text-sm">Recordings</span>
        </a>
      </Link>
    </Card>
  );
}

function Router() {
  return (
    <div className="min-h-screen pb-20">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/recordings" component={Recordings} />
        <Route component={NotFound} />
      </Switch>
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
