import { useEffect, useState, useRef } from "react";
import { ExternalLink, CheckCircle2, PhoneCall, ShieldCheck, AlertTriangle, ArrowRight, Siren } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import FaqAccordion from "@/components/FaqAccordion";
import { Button } from "@/components/ui/button";
import { getVisitorId } from "@/lib/utils";

const emergencyContacts = [
  { label: "Patroli Siber", value: "patrolisiber.id", href: "https://patrolisiber.id" },
  { label: "Aduan Konten", value: "aduankonten.id", href: "https://aduankonten.id" },
  { label: "Polisi (Darurat)", value: "110", href: "tel:110" },
];

const tips = [
  "Jangan pernah membalas atau bernegosiasi dengan pelaku — itu hanya memperpanjang tekanan.",
  "Jangan hapus bukti apa pun. Simpan screenshot, tautan, dan metadata sebelum melapor.",
  "Beritahu orang terpercaya. Anda tidak perlu menghadapi ini sendirian.",
  "Aktifkan autentikasi dua faktor di semua akun media sosial Anda.",
  "Jangan membagikan ulang konten deepfake — itu justru memperluas penyebarannya.",
];

const faqs = [
  {
    q: "Berapa lama proses pelaporan?",
    a: "Pelaporan ke platform biasanya diproses dalam 24–72 jam. Untuk Patroli Siber dan kepolisian, waktunya bervariasi tergantung kompleksitas kasus. Yang terpenting, segera laporkan agar konten bisa diturunkan lebih cepat.",
  },
  {
    q: "Apakah saya perlu pengacara?",
    a: "Untuk kasus serius, sangat disarankan berkonsultasi dengan pengacara atau lembaga bantuan hukum. Mereka dapat membantu menyusun laporan yang kuat dan mendampingi Anda di setiap proses.",
  },
  {
    q: "Apa yang harus saya lakukan jika konten menyebar luas?",
    a: "Laporkan ke platform dan Aduan Konten secara bersamaan. Minta orang terpercaya untuk ikut melaporkan konten tersebut agar lebih cepat diturunkan. Jangan panik — setiap laporan mempercepat penanganan.",
  },
];

export default function HowToReport() {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const visitorId = getVisitorId();
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: '/how-to-report',
        visitorId: visitorId
      })
    }).catch(() => { /* tracking is best-effort */ });

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
            observerRef.current?.unobserve(entry.target);
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

  const reveal = (id: string, base: string) =>
    isVisible[id] ? `${base} opacity-100 translate-x-0` : `${base} opacity-0 translate-x-10`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-50">
      {/* ============ HERO ============ */}
      <section className="bg-gradient-to-br from-sky-500 via-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
            <Siren className="inline h-4 w-4 mr-1 -mt-0.5" />
            Panduan Resmi
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Cara Melaporkan Deepfake
          </h1>
          <p className="text-xl text-sky-100 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Panduan langkah demi langkah untuk melaporkan konten deepfake
          </p>
        </div>
      </section>

      {/* ============ EMERGENCY CONTACTS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="bg-white rounded-2xl p-6 shadow-xl border border-sky-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 group"
            >
              <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <PhoneCall className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{contact.label}</p>
                <p className="font-bold text-slate-900 text-lg">{contact.value}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ============ STEPS ============ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Langkah <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Pelaporan</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Ikuti lima langkah berikut secara berurutan untuk hasil terbaik.
          </p>
        </div>

        <div className="space-y-6">
          {reportingSteps.map((step, index) => (
            <div
              key={index}
              id={`step-${index}`}
              data-animate
              className={`bg-white rounded-2xl shadow-xl p-8 border border-sky-100 hover:shadow-2xl transition-all duration-700 hover:scale-[1.02] ${
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
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-2xl text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ TIPS ============ */}
      <section className="bg-white py-20 content-visibility-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Tips <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Penting</span>
            </h2>
            <p className="text-lg text-slate-500">Hal-hal yang perlu Anda perhatikan selama proses pelaporan.</p>
          </div>

          <div
            id="tips-section"
            data-animate
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-1000 ease-out ${
              isVisible["tips-section"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {tips.map((tip, index) => {
              // Jika jumlah tips ganjil, kartu terakhir direntangkan penuh & kontennya di tengah agar rapi
              const isLastOdd = tips.length % 2 === 1 && index === tips.length - 1;
              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 bg-sky-50 rounded-2xl p-6 border border-sky-100 ${
                    isLastOdd ? "md:col-span-2 justify-center" : ""
                  }`}
                >
                  <div className="bg-white p-2 rounded-xl shadow-sm flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-sky-600" />
                  </div>
                  <p className="text-slate-700 leading-relaxed font-light">{tip}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ RESOURCES ============ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div
          id="resources-section"
          data-animate
          className={`bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl p-10 border border-sky-200 shadow-xl transition-all duration-1000 ${
            isVisible["resources-section"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="font-bold text-3xl text-slate-900 mb-8">Sumber Daya Pelaporan</h2>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-sky-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-slate-900 mb-3">
                    Patroli Siber Indonesia
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Platform resmi untuk melaporkan kejahatan siber di Indonesia
                  </p>
                  <a
                    href="https://patrolisiber.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg group-hover:scale-105 transition-transform">
                      Kunjungi Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
                <CheckCircle2 className="h-8 w-8 text-sky-500 flex-shrink-0 ml-4" />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-sky-200 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-xl text-slate-900 mb-3">
                    Aduan Konten Indonesia
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    Layanan aduan konten negatif di internet
                  </p>
                  <a
                    href="https://aduankonten.id"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg group-hover:scale-105 transition-transform">
                      Kunjungi Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
                <CheckCircle2 className="h-8 w-8 text-sky-500 flex-shrink-0 ml-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 content-visibility-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            Pertanyaan <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Pelaporan</span>
          </h2>
        </div>

        <FaqAccordion items={faqs} />
      </section>

      {/* ============ CTA ============ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 content-visibility-auto">
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-blue-800 rounded-[2.5rem] p-10 md:p-14 text-center text-white shadow-2xl">
          <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-sky-200" />
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Butuh Dukungan Lebih Lanjut?</h2>
          <p className="text-sky-100/90 mb-8 max-w-xl mx-auto font-light">
            Anda tidak perlu menghadapi ini sendirian. Bagikan kisah Anda atau baca pengalaman korban lain yang berhasil bangkit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/submit-story">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-700 hover:bg-sky-50 shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-full px-8">
                Bagikan Kisah Anda
                <ArrowRight className="ml-2 h-5 w-5" />
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