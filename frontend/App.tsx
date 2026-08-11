import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";

// Lazy load pages for code splitting
const HowToReport = lazy(() => import("./pages/HowToReport"));
const Stories = lazy(() => import("./pages/Stories"));
const SubmitStory = lazy(() => import("./pages/SubmitStory"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
    },
  },
});

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-sky-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 animate-pulse shadow-lg" />
      <div className="animate-pulse text-sky-500 text-sm font-medium">Memuat...</div>
    </div>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-sky-50">
            <Navigation />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/how-to-report" element={<HowToReport />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/submit-story" element={<SubmitStory />} />
              </Routes>
            </Suspense>
            <Toaster />
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
