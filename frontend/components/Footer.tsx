import { Shield, Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg text-gray-900">DeepfakeAware</span>
            </div>
            <p className="text-gray-600 text-sm">
              Platform kesadaran dan dukungan untuk korban deepfake di Indonesia.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hubungi Kami</h3>
            <div className="flex items-center space-x-2 text-gray-600 text-sm">
              <Mail className="h-4 w-4" />
              <span>support@deepfakeaware.id</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Sumber Daya</h3>
            <div className="space-y-2">
              <a
                href="https://patrolisiber.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-purple-600 text-sm"
              >
                <span>Patroli Siber</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://aduankonten.id"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 hover:text-purple-600 text-sm"
              >
                <span>Aduan Konten</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; 2024 DeepfakeAware Indonesia. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
}
