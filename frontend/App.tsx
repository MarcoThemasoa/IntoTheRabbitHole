import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import HowToReport from "./pages/HowToReport";
import Stories from "./pages/Stories";
import SubmitStory from "./pages/SubmitStory";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-white">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-to-report" element={<HowToReport />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/submit-story" element={<SubmitStory />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
