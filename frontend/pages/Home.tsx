import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { AlertTriangle, Users, FileText, ArrowRight } from "lucide-react";
import backend from "~backend/client";
import StatCard from "../components/StatCard";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: () => backend.analytics.getStats(),
  });

  useEffect(() => {
    backend.analytics.trackPageView({ page: "/" }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Bersama Melawan Deepfake
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Platform kesadaran dan dukungan untuk korban deepfake di Indonesia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/how-to-report">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Cara Melapor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/submit-story">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                  Bagikan Kisah Anda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <StatCard
            label="Total Pengunjung"
            value={stats?.totalVisitors.toLocaleString() || "0"}
            icon={<Users className="h-6 w-6" />}
            color="blue"
          />
          <StatCard
            label="Kisah yang Dibagikan"
            value={stats?.totalStories.toLocaleString() || "0"}
            icon={<FileText className="h-6 w-6" />}
            color="purple"
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-16">
          <div className="flex items-start space-x-4">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Peringatan: Peningkatan Kasus Deepfake
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Teknologi deepfake semakin canggih dan sering disalahgunakan untuk
                penipuan, pencemaran nama baik, dan kejahatan siber lainnya. Jika Anda
                menjadi korban, Anda tidak sendirian. Kami di sini untuk membantu.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="font-bold text-xl text-gray-900 mb-3">Apa itu Deepfake?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Deepfake adalah teknologi AI yang dapat memanipulasi video, audio, atau
              gambar untuk membuat konten palsu yang tampak nyata.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="font-bold text-xl text-gray-900 mb-3">Kenali Tanda-tandanya</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Perhatikan ketidaksesuaian pada wajah, gerakan bibir yang tidak sinkron,
              atau kualitas video yang tidak konsisten.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <h3 className="font-bold text-xl text-gray-900 mb-3">Laporkan Segera</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Jangan tunda untuk melaporkan konten deepfake ke otoritas yang berwenang
              seperti Patroli Siber dan Aduan Konten.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
