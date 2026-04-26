'use client'; 

import { useEffect, useRef, useState, useMemo, Suspense, lazy } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AlertTriangle, Users, FileText, ArrowRight, Shield, Eye, MessageSquare } from "lucide-react";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import TextType from "@/components/TextType";
import type { AnalyticsStats, ListStoriesResponse } from "@/lib/types";
import { getVisitorId } from "@/lib/utils";

// Lazy load FaultyTerminal to avoid blocking initial render
const FaultyTerminal = lazy(() => import("@/components/FaultyTerminal"));

export default function Home() {
  const { data: stats } = useQuery<AnalyticsStats>({
    queryKey: ["stats"],
    queryFn: () => fetch('/api/stats').then((res) => res.json()),
  });

  const queryClient = useQueryClient();
  const terminalGridMul = useMemo(() => [2, 1] as [number, number], []);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Defer non-critical work using requestIdleCallback
    const idleCallbackId = requestIdleCallback(() => {
      // Prefetch stories
      queryClient.prefetchQuery<ListStoriesResponse>({
        queryKey: ["stories"],
        queryFn: () => fetch('/api/stories').then((res) => res.json()),
        staleTime: 1000 * 60 * 5,
      });

      // Track visitor
      const visitorId = getVisitorId();
      fetch('/api/track', { 
        method: 'POST', 
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ 
          page: '/',
          visitorId: visitorId
        }) 
      }).catch(console.error);
    });

    // Set up intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Only observe critical animation elements, not all [data-animate]
    const animationElements = document.querySelectorAll("[data-animate]");
    animationElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      cancelIdleCallback(idleCallbackId);
      observerRef.current?.disconnect();
    };
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/50">
      <section ref={heroSectionRef} 
      className="relative overflow-hidden text-white py-24">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900" />}>
            <FaultyTerminal
              eventTargetRef={heroSectionRef}
              scale={1.5}
              gridMul={terminalGridMul}
              digitSize={1.2}
              timeScale={1}
              curvature={0.1}
              scanlineIntensity={0}
              glitchAmount={0.2}
              flickerAmount={0.9}
              noiseAmp={1}
              tint="#a4a4a4ff"
              gradientStartColor="#1e3a8a"
              gradientEndColor="#8b5cf6"
              mouseReact={true}
              mouseStrength={1}
              pageLoadAnimation={false}
              brightness={0.8}
            />
          </Suspense>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
              Platform Kesadaran Deepfake Indonesia
            </div>
            
            <div className="grid justify-items-center">
              <h1
                className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 invisible [grid-area:1/1]"
                aria-hidden="true"
              >
                Bersama Melawan Deepfake
              </h1>
              
              <TextType
                as="h1"
                text="Bersama Melawan Deepfake"
                className="text-5xl  md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 [grid-area:1/1]"
                typingSpeed={50}
                loop={false}
                showCursor={true}
                cursorCharacter="_"
                cursorClassName="text-white text-5xl md:text-7xl"
                initialDelay={200}
              />
            </div>

            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 ">
              Anda tidak sendirian{"<3"}. Kami di sini untuk membantu Anda mengatasi ancaman deepfake.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 ">
              <Link to="/how-to-report">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Cara Melapor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Link to="/submit-story">
                <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-blue-50 border-white text-blue-600 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  <TextType
                    as="span"
                    text="Bagikan Kisah Anda"
                    typingSpeed={100}
                    loop={true}
                    pauseDuration={3000}
                    showCursor={true}
                    cursorCharacter="_"
                    cursorClassName="text-blue-600"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* === ELEGANT BENTO GRID === */}
        <div
          id="bento-grid"
          data-animate
          className={`grid grid-cols-1 md:grid-cols-4 gap-6 transition-all duration-1000 ease-out ${
            isVisible["bento-grid"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* 1. Main Educational Anchor - Deep & Refined */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 group border border-white/10 isolate">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-colors duration-700" />
            <Shield className="h-12 w-12 mb-6 text-blue-300 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-4 text-white">
              Apa itu <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Deepfake?</span>
            </h3>
            <p className="text-blue-100/70 text-lg leading-relaxed font-light">
              Deepfake adalah teknologi AI yang dapat memanipulasi video, audio, atau gambar untuk membuat konten palsu yang tampak sangat nyata. Teknologi ini sering disalahgunakan untuk penipuan, manipulasi opini, dan pencemaran nama baik.
            </p>
          </div>

          {/* 2. Stat Card: Total Visitors - Clean Glassmorphism */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-100 transition-all duration-500 group flex flex-col justify-center">
            <div className="bg-blue-50/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-500">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-sm font-medium text-slate-500 mb-2">Total Dikunjungi</h4>
            <p className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tighter">
              {stats?.totalVisitors.toLocaleString() || "0"}
            </p>
          </div>

          {/* 3. Stat Card: Stories Shared - Clean Glassmorphism */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-purple-100 transition-all duration-500 group flex flex-col justify-center">
            <div className="bg-purple-50/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-500">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="text-sm font-medium text-slate-500 mb-2">Kisah Dibagikan</h4>
            <p className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tighter">
              {stats?.totalStories.toLocaleString() || "0"}
            </p>
          </div>

          {/* 4. Warning Card - Sophisticated Accent */}
          <div className="md:col-span-2 relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group flex items-center">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-400 to-red-500" />
            <div className="flex items-start space-x-6 pl-2">
              <div className="bg-orange-50 p-4 rounded-2xl group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
                <AlertTriangle className="h-7 w-7 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2 text-slate-900 tracking-tight">Peringatan Penting</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Kasus deepfake meningkat drastis di Indonesia. Jika Anda menjadi korban, segera laporkan dan ingat: <span className="font-medium text-slate-800">Anda tidak sendirian.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 5. Tip: Recognize Signs - Soft Tint */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-indigo-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-indigo-100 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-100/30 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
            <Eye className="h-8 w-8 mb-6 text-indigo-600 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-semibold mb-3 text-slate-900 tracking-tight">Kenali Tanda</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              Perhatikan ketidaksesuaian wajah, gerakan bibir tidak sinkron, atau kualitas video yang tidak konsisten.
            </p>
          </div>

          {/* 6. Tip: Report Immediately - Soft Tint */}
          <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-100 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100/30 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
            <MessageSquare className="h-8 w-8 mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-semibold mb-3 text-slate-900 tracking-tight">Laporkan Segera</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              Jangan tunda melaporkan ke Patroli Siber dan Aduan Konten untuk pencegahan tindakan yang lebih jauh.
            </p>
          </div>
        </div>
        {/* === END ELEGANT BENTO GRID === */}

        <div
          id="cta-section"
          data-animate
          className={` z-0 mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[2.5rem] p-12 md:p-16 text-center text-white shadow-2xl transition-all duration-1000 ${
            isVisible["cta-section"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">Butuh Bantuan?</h2>
          <p className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto font-light">
            Kami siap membantu Anda melaporkan kasus deepfake dan memberikan dukungan yang Anda butuhkan secara terarah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/how-to-report">
              <Button size="lg" className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-indigo-50 shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-full px-8">
                Panduan Lengkap
              </Button>
            </Link>
            <Link to="/stories">
              <Button size="lg" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-full px-8">
                Baca Kisah Lainnya
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}