import { useEffect } from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import backend from "~backend/client";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

export default function HowToReport() {
  useEffect(() => {
    backend.analytics.trackPageView({ page: "/how-to-report" }).catch(console.error);
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
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cara Melaporkan Deepfake</h1>
          <p className="text-xl text-blue-100">
            Panduan langkah demi langkah untuk melaporkan konten deepfake
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          {reportingSteps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-purple-50 rounded-lg p-8 border border-purple-200">
          <h2 className="font-bold text-2xl text-gray-900 mb-6">Sumber Daya Pelaporan</h2>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Patroli Siber Indonesia
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Platform resmi untuk melaporkan kejahatan siber di Indonesia
                  </p>
                  <a
                    href="https://patrolisiber.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      Kunjungi Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Aduan Konten Indonesia
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Layanan aduan konten negatif di internet
                  </p>
                  <a
                    href="https://aduankonten.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      Kunjungi Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
