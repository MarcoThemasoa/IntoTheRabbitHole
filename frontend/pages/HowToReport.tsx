import { useEffect, useState, useRef } from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import backend from "~backend/client";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

export default function HowToReport() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    backend.analytics.trackPageView({ page: "/how-to-report" }).catch(console.error);

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

  const reportingSteps = [
    {
      title: "Kumpulkan Bukti",
      description: "Ambil screenshot atau rekam konten deepfake. Catat tanggal, waktu, dan platform di mana konten tersebut ditemukan.",
    },
    {
      title: "Laporkan ke Platform",
      description: "Gunakan fitur pelaporan pada platform media sosial tempat konten tersebut berada (Facebook, Instagram, TikTok, dll).",
    },
    {
      title: "Lapor ke Patroli Siber",
      description: "Kunjungi patrolisiber.id untuk melaporkan kejahatan siber termasuk penyebaran konten deepfake.",
    },
    {
      title: "Lapor ke Aduan Konten",
      description: "Gunakan aduankonten.id untuk melaporkan konten negatif yang melanggar hukum atau norma.",
    },
    {
      title: "Hubungi Polisi",
      description: "Untuk kasus serius, buat laporan ke Unit Cyber Crime di kepolisian setempat dengan membawa bukti-bukti yang telah dikumpulkan.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Cara Melaporkan Deepfake
          </h1>
          <p className="text-xl text-blue-100 animate-in fade-in slide-in-from-bottom-4 duration-1000 ">
            Panduan langkah demi langkah untuk melaporkan konten deepfake
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-6">
          {reportingSteps.map((step, index) => (
            <div
              key={index}
              id={`step-${index}`}
              data-animate
              className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] ${
                isVisible[`step-${index}`]
                  ? "opacity-100 translate-x-0"
                  : index % 2 === 0
                  ? "opacity-0 -translate-x-10"
                  : "opacity-0 translate-x-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          id="resources-section"
          data-animate
          className={`mt-20 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-10 border border-purple-200 shadow-xl transition-all duration-1000 ${
            isVisible["resources-section"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="font-bold text-3xl text-gray-900 mb-8">Sumber Daya Pelaporan</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">
                    Patroli Siber Indonesia
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Platform resmi untuk melaporkan kejahatan siber di Indonesia
                  </p>
                  <a
                    href="https://patrolisiber.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg group-hover:scale-105 transition-transform">
                      Kunjungi Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0 ml-4" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-gray-900 mb-3">
                    Aduan Konten Indonesia
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Layanan aduan konten negatif di internet
                  </p>
                  <a
                    href="https://aduankonten.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg group-hover:scale-105 transition-transform">
                      Kunjungi Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0 ml-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
