'use client';

import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  AlertTriangle, ArrowRight, Shield, ShieldCheck, Eye, MessageSquare,
  Heart, Users, FileText, Lock, PhoneCall, GraduationCap, BookOpen,
  CheckCircle2, HandHeart, Sparkles, Landmark, Clock
} from "lucide-react";
import Footer from "../components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import { Button } from "@/components/ui/button";
import type { AnalyticsStats, ListStoriesResponse } from "@/lib/types";
import { getVisitorId } from "@/lib/utils";

// FAQ items — rendered by FaqAccordion (state-based, always animates)
const faqs = [
  {
    q: "Apa itu deepfake?",
    a: "Deepfake adalah teknologi AI yang memanipulasi video, audio, atau gambar sehingga tampak sangat nyata padahal palsu. Teknologi ini sering disalahgunakan untuk penipuan, pencemaran nama baik, dan teror psikologis.",
  },
  {
    q: "Saya menjadi korban deepfake. Apa langkah pertama?",
    a: "Tetap tenang dan jangan panik. Amankan semua bukti (screenshot, tautan, tangkapan layar), lalu segera laporkan ke platform tempat konten itu beredar dan ke patrolisiber.id. Anda juga bisa menghubungi kami untuk pendampingan.",
  },
  {
    q: "Apakah identitas saya akan dirahasiakan?",
    a: "Ya, sepenuhnya. Anda dapat membagikan kisah secara anonim. Informasi pribadi Anda tidak akan dibagikan tanpa persetujuan Anda.",
  },
  {
    q: "Apakah layanan ini gratis?",
    a: "Ya, seluruh informasi, panduan, dan dukungan di platform ini gratis. Tujuan kami adalah membantu Anda, bukan mencari keuntungan.",
  },
  {
    q: "Bagaimana cara menghapus konten deepfake?",
    a: "Laporkan konten ke platform media sosial terkait dengan fitur pelaporan resmi. Untuk konten yang melanggar hukum, ajukan pengaduan ke aduankonten.id dan Patroli Siber. Simpan bukti laporan Anda.",
  },
];

export default function Home() {
  const { data: stats } = useQuery<AnalyticsStats>({
    queryKey: ["stats"],
    queryFn: async () => {
      try {
        const res = await fetch('/api/stats');
        if (!res.ok) return { totalVisitors: 0, totalStories: 0 };
        return await res.json();
      } catch {
        // Never let a stats failure block the page
        return { totalVisitors: 0, totalStories: 0 };
      }
    },
    retry: 1,
  });

  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: '/',
          visitorId: visitorId
        })
      }).catch(() => { /* tracking is best-effort */ });
    });

    // Set up intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
            observerRef.current?.unobserve(entry.target); // one-shot
          }
        });
      },
      { threshold: 0.1 }
    );

    const animationElements = document.querySelectorAll("[data-animate]");
    animationElements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      cancelIdleCallback(idleCallbackId);
      observerRef.current?.disconnect();
    };
  }, [queryClient]);

  const reveal = (id: string, base: string) =>
    isVisible[id] ? `${base} opacity-100 translate-y-0` : `${base} opacity-0 translate-y-12`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50/50 to-white">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden text-white">
        {/* Lightweight CSS gradient background (replaces heavy WebGL terminal) */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-blue-600 to-blue-900" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl animate-float-soft" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] bg-blue-300/20 rounded-full blur-3xl animate-float-soft" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA4IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 animate-fade-up">
              <Sparkles className="inline h-4 w-4 mr-1 -mt-0.5" />
              Platform Kesadaran Deepfake Indonesia
            </div>

            {/* Full text rendered instantly for fast LCP */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Bersama Melawan{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-white">
                Deepfake
              </span>
            </h1>

            <p
              className="text-xl md:text-2xl mb-10 text-sky-100 max-w-3xl mx-auto animate-fade-up"
              style={{ animationDelay: "0.25s" }}
            >
              Anda tidak sendirian. Kami di sini, dengan sepenuh hati, siap mendampingi Anda menghadapi ancaman deepfake.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Link to="/how-to-report">
                <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-sky-50 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Cara Melapor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to="/submit-story">
                <Button size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  <Heart className="mr-2 h-5 w-5" />
                  Bagikan Kisah Anda
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sky-100 animate-fade-up"
              style={{ animationDelay: "0.55s" }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-sky-200" />
                <span className="text-sm">Rahasia &amp; Aman</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-sky-200" />
                <span className="text-sm">Bisa Anonim</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-sky-200" />
                <span className="text-sm">Gratis Selamanya</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <svg className="absolute bottom-0 left-0 w-full text-sky-50" viewBox="0 0 1440 60" fill="currentColor" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,32L60,37.3C120,43,240,53,360,53.3C480,53,600,43,720,37.3C840,32,960,32,1080,37.3C1200,43,1320,53,1380,58.7L1440,64L1440,60L0,60Z" />
        </svg>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section className="bg-sky-50 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-sky-100 p-3 rounded-2xl flex-shrink-0">
                <Lock className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Kerahasiaan Terjaga</h3>
                <p className="text-sm text-slate-500">Kisah Anda aman dan dapat dibagikan secara anonim.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-2xl flex-shrink-0">
                <PhoneCall className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Pendampingan Nyata</h3>
                <p className="text-sm text-slate-500">Panduan langkah demi langkah untuk melaporkan kasus Anda.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-sky-100 p-3 rounded-2xl flex-shrink-0">
                <Heart className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Tanpa Penghakiman</h3>
                <p className="text-sm text-slate-500">Kami percaya pada kekuatan Anda. Apa pun yang terjadi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ BENTO GRID ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 content-visibility-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Pahami, Waspada, dan <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Bertindak</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Informasi lengkap untuk melindungi diri Anda dan orang-orang terdekat dari ancaman deepfake.
          </p>
        </div>

        <div
          id="bento-grid"
          data-animate
          className={`grid grid-cols-1 md:grid-cols-4 gap-6 transition-all duration-1000 ease-out ${reveal("bento-grid", "")}`}
        >
          {/* 1. Main Educational Anchor */}
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden bg-gradient-to-br from-sky-950 via-blue-900 to-blue-950 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 group border border-white/10 isolate">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl group-hover:bg-sky-300/20 transition-colors duration-700" />
            <Shield className="h-12 w-12 mb-6 text-sky-300 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-3xl md:text-4xl font-light tracking-tight mb-4 text-white">
              Apa itu <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-300">Deepfake?</span>
            </h3>
            <p className="text-sky-100/80 text-lg leading-relaxed font-light">
              Deepfake adalah teknologi AI yang dapat memanipulasi video, audio, atau gambar untuk membuat konten palsu yang tampak sangat nyata. Teknologi ini sering disalahgunakan untuk penipuan, manipulasi opini, dan pencemaran nama baik.
            </p>
          </div>

          {/* 2. Stat Card: Total Visitors */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sky-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-sky-200 transition-all duration-500 group flex flex-col justify-center">
            <div className="bg-sky-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-500">
              <Users className="h-6 w-6 text-sky-600" />
            </div>
            <h4 className="text-sm font-medium text-slate-500 mb-2">Total Dikunjungi</h4>
            <p className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tighter">
              {stats?.totalVisitors.toLocaleString() || "0"}
            </p>
          </div>

          {/* 3. Stat Card: Stories Shared */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sky-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all duration-500 group flex flex-col justify-center">
            <div className="bg-blue-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-1 transition-transform duration-500">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="text-sm font-medium text-slate-500 mb-2">Kisah Dibagikan</h4>
            <p className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tighter">
              {stats?.totalStories.toLocaleString() || "0"}
            </p>
          </div>

          {/* 4. Warning Card */}
          <div className="md:col-span-2 relative overflow-hidden bg-white/90 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sky-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 group flex items-center">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-sky-400 to-blue-600" />
            <div className="flex items-start space-x-6 pl-2">
              <div className="bg-sky-50 p-4 rounded-2xl group-hover:scale-105 transition-transform duration-500 flex-shrink-0">
                <AlertTriangle className="h-7 w-7 text-sky-600" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2 text-slate-900 tracking-tight">Peringatan Penting</h3>
                <p className="text-slate-600 leading-relaxed font-light">
                  Kasus deepfake meningkat drastis di Indonesia. Jika Anda menjadi korban, segera laporkan dan ingat: <span className="font-medium text-slate-800">Anda tidak sendirian.</span>
                </p>
              </div>
            </div>
          </div>

          {/* 5. Tip: Recognize Signs */}
          <div className="md:col-span-2 bg-gradient-to-br from-sky-50 to-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-sky-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-sky-200 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-sky-100/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
            <Eye className="h-8 w-8 mb-6 text-sky-600 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-semibold mb-3 text-slate-900 tracking-tight">Kenali Tanda</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              Perhatikan ketidaksesuaian wajah, gerakan bibir tidak sinkron, atau kualitas video yang tidak konsisten. Percayai naluri Anda — jika terasa salah, kemungkinan besar memang begitu.
            </p>
          </div>

          {/* 6. Tip: Report Immediately */}
          <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-100/50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-700" />
            <MessageSquare className="h-8 w-8 mb-6 text-blue-600 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-xl font-semibold mb-3 text-slate-900 tracking-tight">Laporkan Segera</h3>
            <p className="text-slate-600 text-sm leading-relaxed font-light">
              Jangan tunda melaporkan ke Patroli Siber dan Aduan Konten. Setiap laporan Anda adalah langkah berani untuk melindungi diri sendiri dan orang lain.
            </p>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="bg-gradient-to-b from-white to-sky-50 py-20 content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Bagaimana <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Kami Membantu</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Tiga langkah sederhana menuju pemulihan Anda.</p>
          </div>

          <div
            id="how-it-works"
            data-animate
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ease-out ${reveal("how-it-works", "")}`}
          >
            {[
              { icon: Eye, title: "1. Kenali", desc: "Pelajari tanda-tanda deepfake dan cara melindungi diri serta orang terdekat dari manipulasi digital." },
              { icon: Landmark, title: "2. Laporkan", desc: "Ikuti panduan lengkap kami untuk melaporkan ke platform, Patroli Siber, Aduan Konten, dan kepolisian." },
              { icon: HandHeart, title: "3. Pulihkan", desc: "Baca kisah korban lain yang berhasil bangkit. Bagikan cerita Anda dan temukan dukungan emosional." },
            ].map((step) => (
              <div key={step.title} className="bg-white rounded-3xl p-8 shadow-lg border border-sky-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group">
                <div className="bg-gradient-to-br from-sky-400 to-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed font-light">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ EMOTIONAL SUPPORT ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 content-visibility-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 rounded-3xl bg-gradient-to-r from-sky-50 via-white to-blue-50 border border-sky-100 p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Heart className="h-8 w-8 text-sky-500 flex-shrink-0 animate-pulse" />
          <p className="text-slate-700 font-light text-lg">
            <span className="font-medium text-slate-900">Kamu berharga.</span> Apa pun yang terjadi, kamu tidak sendirian — ada orang-orang yang peduli dan siap membantumu.
          </p>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="bg-sky-50 py-20 content-visibility-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
              Ruang Aman untuk <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Anda</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Dukungan yang kami sediakan untuk setiap langkah perjalanan Anda.</p>
          </div>

          <div
            id="features"
            data-animate
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ease-out ${reveal("features", "")}`}
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-sky-100 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-sky-100 p-3 rounded-2xl">
                  <GraduationCap className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Edukasi</h3>
              </div>
              <ul className="space-y-3">
                {["Cara mengenali konten palsu", "Panduan melindungi privasi digital", "Informasi hukum terbaru"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-sky-100 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-blue-100 p-3 rounded-2xl">
                  <HandHeart className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Dukungan Emosional</h3>
              </div>
              <ul className="space-y-3">
                {["Kisah korban yang tidak sendirian", "Komunitas yang saling menguatkan", "Semangat untuk terus melangkah"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-sky-100 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-sky-100 p-3 rounded-2xl">
                  <BookOpen className="h-6 w-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bantuan Pelaporan</h3>
              </div>
              <ul className="space-y-3">
                {["Langkah melapor yang jelas", "Tautan resmi Patroli Siber", "Panduan Aduan Konten"].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span className="font-light">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 content-visibility-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Pertanyaan yang <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Sering Diajukan</span>
          </h2>
        </div>

        <FaqAccordion items={faqs} />
      </section>

      {/* ============ CTA ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 content-visibility-auto">
        <div
          id="cta-section"
          data-animate
          className={` z-0 bg-gradient-to-r from-sky-500 via-blue-600 to-blue-800 rounded-[2.5rem] p-12 md:p-16 text-center text-white shadow-2xl transition-all duration-1000 ${reveal("cta-section", "")}`}
        >
          <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">Kami Siap Mendampingi Anda</h2>
          <p className="text-lg md:text-xl text-sky-100/90 mb-10 max-w-2xl mx-auto font-light">
            Anda tidak perlu menghadapi ini sendirian. Tim kami siap membantu Anda melaporkan kasus deepfake dan memberikan dukungan yang Anda butuhkan — dengan empati dan kerahasiaan penuh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/how-to-report">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-sky-50 shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-full px-8">
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
