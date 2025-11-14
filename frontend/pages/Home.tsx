'use client'; // Added this line

import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AlertTriangle, Users, FileText, ArrowRight, Shield, Eye, MessageSquare } from "lucide-react";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";
import FaultyTerminal from "@/components/FaultyTerminal";
import TextType from "@/components/TextType"; // Added this import
import type { AnalyticsStats } from "@/lib/types"; // Import the helper function
import { getVisitorId } from "@/lib/utils"; // Import the helper function

export default function Home() {
  const { data: stats } = useQuery<AnalyticsStats>({
  queryKey: ["stats"],
  // Cukup panggil API Anda secara relatif. Vercel tahu di mana menemukannya.
  queryFn: () => fetch('/api/stats').then((res) => res.json()),
  });

  const terminalGridMul = useMemo(() => [2, 1] as [number, number], []);
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const visitorId = getVisitorId(); // Panggil helper function
    fetch('/api/track', { 
      method: 'POST', 
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({ 
        page: '/', // atau '/stories', dll.
        visitorId: visitorId // <-- TAMBAHKAN INI
      }) 
    }).catch(console.error);
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

    const elements = document.querySelectorAll("[data-animate]");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <section ref={heroSectionRef} 
      className="relative overflow-hidden text-white py-24">
        <div className="absolute inset-0 z-0">
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
            tint="#a4a4a4ff" // You might want white text on a blue/purple gradient
            gradientStartColor="#1e3a8a" // Customize your gradient start color (e.g., deep blue)
            gradientEndColor="#8b5cf6"   // Customize your gradient end color (e.g., vibrant purple)
            mouseReact={true}
            mouseStrength={1}
            pageLoadAnimation={false}
            brightness={0.8}
          />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
              Platform Kesadaran Deepfake Indonesia
            </div>
            
            {/* === MODIFIED TITLE === */}
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
            {/* === END MODIFIED TITLE === */}

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
              
              {/* === MODIFIED BUTTON === */}
              <Link to="/submit-story">
                <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-blue-50 border-white text-blue-600 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  <TextType
                    as="span" // Use 'span' to be valid inside a button
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
              {/* === END MODIFIED BUTTON === */}

            </div>
          </div>
        </div>
      </section>

      {/* ... (rest of the file is unchanged) ... */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div
          id="bento-grid"
          data-animate
          className={`grid grid-cols-1 md:grid-cols-4 gap-4 transition-all duration-700 ${
            isVisible["bento-grid"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-2xl hover:shadow-blue-500/20 transition-all hover:scale-[1.02] group">
            <Shield className="h-12 w-12 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-bold mb-4">Apa itu Deepfake?</h3>
            <p className="text-blue-100 text-lg leading-relaxed">
              Deepfake adalah teknologi AI yang dapat memanipulasi video, audio, atau gambar untuk membuat konten palsu yang tampak nyata. Teknologi ini sering disalahgunakan untuk penipuan dan pencemaran nama baik.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:scale-[1.02] group">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Total Dikunjung</h4>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalVisitors.toLocaleString() || "0"}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:scale-[1.02] group">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="h-7 w-7 text-blue-600" />
            </div>
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Kisah Dibagikan</h4>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalStories.toLocaleString() || "0"}</p>
          </div>

          <div className="md:col-span-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 shadow-2xl hover:shadow-orange-500/20 transition-all hover:scale-[1.02] group">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-8 w-8 text-white flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div className="text-white">
                <h3 className="font-bold text-xl mb-2">Peringatan Penting</h3>
                <p className="text-white/90 leading-relaxed">
                  Kasus deepfake meningkat drastis di Indonesia. Jika Anda menjadi korban, segera laporkan dan ingat: Anda tidak sendirian.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-8 text-white shadow-2xl hover:shadow-purple-500/20 transition-all hover:scale-[1.02] group">
            <Eye className="h-10 w-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-3">Kenali Tanda</h3>
            <p className="text-purple-100 text-sm leading-relaxed">
              Perhatikan ketidaksesuaian wajah, gerakan bibir tidak sinkron, atau kualitas video tidak konsisten.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl hover:shadow-indigo-500/20 transition-all hover:scale-[1.02] group">
            <MessageSquare className="h-10 w-10 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-3">Laporkan Segera</h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              Jangan tunda melaporkan ke Patroli Siber dan Aduan Konten untuk tindakan cepat.
            </p>
          </div>
        </div>

        <div
          id="cta-section"
          data-animate
          className={` z-0 mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl transition-all duration-700 ${
            isVisible["cta-section"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Butuh Bantuan?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Kami siap membantu Anda melaporkan kasus deepfake dan memberikan dukungan yang Anda butuhkan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/how-to-report">
              <Button size="lg" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:scale-105 transition-all">
                Panduan Lengkap
              </Button>
            </Link>
            <Link to="/stories">
              <Button size="lg" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:scale-105 transition-all">
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