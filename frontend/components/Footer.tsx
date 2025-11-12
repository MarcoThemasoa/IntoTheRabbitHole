import { Shield, Mail, ExternalLink, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white mt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-xl">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <span className="font-bold text-2xl">RuangAman</span>
            </div>
            <p className="text-blue-100 leading-relaxed mb-6 max-w-md">
              Platform dari UBAYA West angkatan 2025, untuk kesadaran dan dukungan bagi korban "deepfake" di Indonesia. 
              Ingatlah bahwa anda tidak sendiri {"<3"}, segera mencari bantuan jika anda adalah korban Deepfake.
            </p>
            <div className="flex items-center space-x-2 text-purple-200">
              <Heart className="h-5 w-5" />
              <span className="text-sm">Dibuat dengan dedikasi untuk Indonesia</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Navigasi Cepat</h3>
            <div className="space-y-3">
              <Link
                to="/"
                className="block text-blue-200 hover:text-white hover:translate-x-1 transform duration-200"
              >
                Beranda
              </Link>
              <Link
                to="/how-to-report"
                className="block text-blue-200 hover:text-white hover:translate-x-1 transform duration-200"
              >
                Cara Melapor
              </Link>
              <Link
                to="/stories"
                className="block text-blue-200 hover:text-white hover:translate-x-1 transform duration-200"
              >
                Kisah Korban
              </Link>
              <Link
                to="/submit-story"
                className="block text-blue-200 hover:text-white hover:translate-x-1 transform duration-200"
              >
                Bagikan Kisah
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-white ">Sumber Daya</h3>
            <div className="space-y-4">
              <a
                href="https://patrolisiber.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-200 hover:text-white transition-all group"
              >
                <span className="group-hover:translate-x-1 transform duration-200">Patroli Siber</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://aduankonten.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-200 hover:text-white transition-all group"
              >
                <span className="group-hover:translate-x-1 transform duration-200">Aduan Konten</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <div className="pt-4">
                <div className="flex items-center space-x-2 text-purple-200">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">support@deepfakeaware.id</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200 text-sm">
              &copy; 2024 DeepfakeAware Indonesia. Semua hak dilindungi.
            </p>
            <p className="text-purple-200 text-sm">
              Melindungi masyarakat dari ancaman deepfake
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
